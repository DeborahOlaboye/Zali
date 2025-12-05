import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient, Db } from 'mongodb';
import { createMocks } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';

let mongoServer: MongoMemoryServer;
let connection: MongoClient;
let db: Db;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  connection = await MongoClient.connect(uri);
  db = connection.db();
  
  // Set up test environment variables
  process.env.MONGODB_URI = uri;
  process.env.NODE_ENV = 'test';
});

beforeEach(async () => {
  // Clear all test data before each test
  const collections = await db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await connection.close();
  await mongoServer.stop();
});

// Helper function to create mock request and response objects
export const createMockRequestResponse = (method: string) => {
  const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
    method,
  });
  
  // Add json method to response
  res.json = (data: any) => {
    res._getJSONData = () => data;
    return res;
  };
  
  // Add status method to response
  res.status = (statusCode: number) => {
    res.statusCode = statusCode;
    return res;
  };
  
  return { req, res };
};

export { db };
