import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Execute the VRF fulfillment script
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    const command = 'cd /home/debby/Desktop/DEBY/Hacks/Zali/contracts && forge script script/FulfillVRF.s.sol --rpc-url https://rpc.ankr.com/celo_sepolia --broadcast';
    
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr && !stderr.includes('No files changed')) {
      console.error('VRF fulfillment error:', stderr);
      return NextResponse.json({ error: 'VRF fulfillment failed' }, { status: 500 });
    }
    
    console.log('VRF fulfillment output:', stdout);
    return NextResponse.json({ success: true, output: stdout });
    
  } catch (error) {
    console.error('VRF fulfillment error:', error);
    return NextResponse.json({ error: 'VRF fulfillment failed' }, { status: 500 });
  }
}