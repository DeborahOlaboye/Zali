import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

const execAsync = promisify(exec);

// Types
type ApiResponse = {
  success: boolean;
  requestId?: string;
  output?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
};

// Environment variables validation
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_RPC_URL',
  'CONTRACTS_DIR',
  'VRF_SCRIPT_PATH'
];

// Validate environment variables
function validateEnvironment() {
  const missingVars = REQUIRED_ENV_VARS.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

// Logging utility
function logRequest(requestId: string, message: string, level: 'info' | 'error' = 'info', metadata: any = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    requestId,
    level,
    message,
    ...metadata
  };
  
  if (level === 'error') {
    console.error(JSON.stringify(logEntry));
  } else {
    console.log(JSON.stringify(logEntry));
  }
}

// Error handler
class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }

  toResponse(): ApiResponse {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details
      }
    };
  }
}

export async function POST(request: NextRequest) {
  const requestId = uuidv4();
  const startTime = Date.now();
  
  try {
    // Log request
    logRequest(requestId, 'VRF fulfillment request received', 'info', {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries())
    });

    // Validate environment
    validateEnvironment();

    // Validate request method
    if (request.method !== 'POST') {
      throw new ApiError(405, 'METHOD_NOT_ALLOWED', 'Only POST method is allowed');
    }

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await request.json();
      // Add any request body validation here if needed
    } catch (error) {
      throw new ApiError(400, 'INVALID_REQUEST', 'Invalid JSON payload');
    }

    // Build command with environment variables
    const command = `cd ${process.env.CONTRACTS_DIR} && \
      forge script ${process.env.VRF_SCRIPT_PATH} \
      --rpc-url ${process.env.NEXT_PUBLIC_RPC_URL} \
      --broadcast`;

    logRequest(requestId, 'Executing VRF fulfillment script', 'info', { command });
    
    const { stdout, stderr } = await execAsync(command, { maxBuffer: 1024 * 1024 * 5 }); // 5MB buffer
    
    // Handle command output
    if (stderr && !stderr.includes('No files changed')) {
      logRequest(requestId, 'VRF script execution warning', 'error', { stderr });
      // Don't fail on warnings, but log them
    }
    
    logRequest(requestId, 'VRF fulfillment completed successfully', 'info', {
      executionTime: `${Date.now() - startTime}ms`,
      outputLength: stdout?.length || 0
    });
    
    return NextResponse.json({
      success: true,
      requestId,
      output: stdout
    } as ApiResponse);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof Error ? error.stack : undefined;
    
    logRequest(requestId, 'VRF fulfillment failed', 'error', {
      error: errorMessage,
      details: errorDetails,
      executionTime: `${Date.now() - startTime}ms`
    });
    
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const response = error instanceof ApiError 
      ? error.toResponse() 
      : {
          success: false,
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
          }
        } as ApiResponse;
    
    return NextResponse.json(response, { status: statusCode });
  }
}