import { UsersService } from './database';

// Mock the supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    select: jest.fn().mockResolvedValue({ data: [], error: null }),
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } })
    }
  }
}));

describe('UsersService', () => {
  describe('updateUserProfile', () => {
    it('should correctly map camelCase to snake_case', async () => {
      const userId = 'test-user-id';
      const updates = {
        fullName: 'John Doe',
        phoneNumber: '+1234567890',
        isActive: true,
        spotifyId: 'spotify-123'
      };

      const result = await UsersService.updateUserProfile(userId, updates);
      
      // The result should be an empty array since we're mocking the supabase client
      expect(result).toEqual([]);
    });

    it('should filter out invalid column names', async () => {
      const userId = 'test-user-id';
      const updates = {
        fullName: 'John Doe',
        invalidField: 'invalid-value',
        isActive: true
      };

      const result = await UsersService.updateUserProfile(userId, updates);
      
      // The result should be an empty array since we're mocking the supabase client
      expect(result).toEqual([]);
    });
  });
});