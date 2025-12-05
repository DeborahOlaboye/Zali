import { createMockRequestResponse } from './setup';
import handler from '../../pages/api/users';
import { db } from './setup';

describe('Users API', () => {
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const { req, res } = createMockRequestResponse('POST');
      
      // Mock request body
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
      };
      
      // Call the API handler
      await handler(req, res);
      
      // Check the response
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toMatchObject({
        success: true,
        data: {
          name: 'Test User',
          email: 'test@example.com',
        },
      });
      
      // Verify the user was created in the database
      const user = await db.collection('users').findOne({ email: 'test@example.com' });
      expect(user).toMatchObject({
        name: 'Test User',
        email: 'test@example.com',
      });
    });
    
    it('should return 400 if email is missing', async () => {
      const { req, res } = createMockRequestResponse('POST');
      
      // Mock request body with missing email
      req.body = {
        name: 'Test User',
      };
      
      await handler(req, res);
      
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toMatchObject({
        success: false,
        error: 'Email is required',
      });
    });
  });
  
  describe('GET /api/users', () => {
    beforeEach(async () => {
      // Insert test data
      await db.collection('users').insertMany([
        { name: 'User 1', email: 'user1@example.com' },
        { name: 'User 2', email: 'user2@example.com' },
      ]);
    });
    
    it('should return all users', async () => {
      const { req, res } = createMockRequestResponse('GET');
      
      await handler(req, res);
      
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toMatchObject({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({ name: 'User 1' }),
          expect.objectContaining({ name: 'User 2' }),
        ]),
      });
      expect(res._getJSONData().data).toHaveLength(2);
    });
  });
});
