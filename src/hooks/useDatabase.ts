import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  DashboardService,
  UsersService,
  TransactionsService,
  AnalyticsService,
  BotService,
  PlaylistService,
  SystemSettingsService,
  KYCService,
  RewardSettingsService,
  CMSService,
  ProfileService
} from '@/lib/database';

// Generic hook for async operations
export function useAsyncOperation<T>(
  operation: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const execute = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    execute();
  }, dependencies);

  return { data, loading, error, refetch: execute };
}

// Dashboard hooks
export function useDashboardStats() {
  return useAsyncOperation(() => DashboardService.getDashboardStats());
}

export function useRecentActivities() {
  return useAsyncOperation(() => DashboardService.getRecentActivities());
}

export function useSystemStatus() {
  return useAsyncOperation(() => DashboardService.getSystemStatus());
}

// Users hooks
export function useUsers(options: {
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
} = {}) {
  return useAsyncOperation(
    () => UsersService.getAllUsers(options),
    [options.search, options.status, options.limit, options.offset]
  );
}

export function useUserStats() {
  return useAsyncOperation(() => UsersService.getUserStats());
}

export function useUserActions() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const updateKycStatus = async (
    userId: string, 
    status: 'approved' | 'rejected' | 'pending', 
    rejectionReason?: string
  ) => {
    try {
      setLoading(true);
      const result = await UsersService.updateUserKycStatus(userId, status, rejectionReason);
      toast({
        title: 'Success',
        description: `KYC status updated to ${status}`,
      });
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Error in updateKycStatus hook:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update KYC status',
        variant: 'destructive'
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userId: string, updates: any) => {
    try {
      setLoading(true);
      const result = await UsersService.updateUserProfile(userId, updates);
      
      // Check if there were any updates applied
      if (result && Array.isArray(result)) {
        toast({
          title: 'Success',
          description: 'User profile updated successfully',
        });
        return { success: true, data: result };
      } else {
        toast({
          title: 'Info',
          description: 'No changes were made to the profile',
        });
        return { success: true, data: [] };
      }
    } catch (error: any) {
      console.error('Error in updateUserProfile hook:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user profile',
        variant: 'destructive'
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateKycStatus,
    updateUserProfile,
    loading
  };
}

// Hook to get a single user by ID
export function useUserById(userId?: string) {
  return useAsyncOperation(
    () => {
      if (!userId) {
        return Promise.resolve(null);
      }
      return UsersService.getUserById(userId);
    },
    [userId]
  );
}

// Transactions hooks
export function useTransactions(options: {
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
} = {}) {
  return useAsyncOperation(
    () => TransactionsService.getAllTransactions(options),
    [options.search, options.status, options.limit, options.offset]
  );
}

export function useWalletBalances() {
  return useAsyncOperation(() => TransactionsService.getUserWalletBalances());
}

// Analytics hooks
export function usePlaytimeData(days = 7) {
  return useAsyncOperation(
    () => AnalyticsService.getPlaytimeData(days),
    [days]
  );
}

export function useTopSongs(limit = 5) {
  return useAsyncOperation(
    () => AnalyticsService.getTopSongs(limit),
    [limit]
  );
}

export function useUserSegmentData() {
  return useAsyncOperation(() => AnalyticsService.getUserSegmentData());
}

export function usePointsEarnedData(days = 7) {
  return useAsyncOperation(
    () => AnalyticsService.getPointsEarnedData(days),
    [days]
  );
}

export function useAnalyticsKPIs() {
  return useAsyncOperation(() => AnalyticsService.getAnalyticsKPIs());
}

// Bot Management hooks
export function useBotConfigs() {
  return useAsyncOperation(() => BotService.getAllBotConfigs());
}

export function useBotLogs(limit = 50) {
  return useAsyncOperation(
    () => BotService.getBotLogs(limit),
    [limit]
  );
}

export function useBotActions() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const updateBotConfig = async (id: string, updates: any) => {
    try {
      setLoading(true);
      await BotService.updateBotConfig(id, updates);
      toast({
        title: 'Success',
        description: 'Bot configuration updated successfully',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update bot configuration',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createBotConfig = async (config: any) => {
    try {
      setLoading(true);
      await BotService.createBotConfig(config);
      toast({
        title: 'Success',
        description: 'Bot configuration created successfully',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create bot configuration',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const testBotConfig = async (id: string) => {
    try {
      setLoading(true);
      await BotService.testBotConfig(id);
      toast({
        title: 'Test Started',
        description: 'Bot configuration test initiated successfully',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start bot test',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateBotConfig,
    createBotConfig,
    testBotConfig,
    loading
  };
}

// Hook to get a single bot configuration
export function useBotConfig(id?: string) {
  return useAsyncOperation(
    () => {
      if (!id) {
        return Promise.resolve(null);
      }
      if (id === 'default') {
        return BotService.getDefaultBotConfig();
      }
      return BotService.getBotConfigById(id);
    },
    [id]
  );
}

// Hook to get bot status and statistics
export function useBotStats() {
  return useAsyncOperation(() => BotService.getBotStats());
}

// Playlist hooks
export function usePlaylists() {
  return useAsyncOperation(() => PlaylistService.getAllPlaylists());
}

export function usePlaylistStats() {
  return useAsyncOperation(() => PlaylistService.getPlaylistStats());
}

// Playlist Actions hook
export function usePlaylistActions() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const importPlaylist = async (playlistData: any, userId: string) => {
    try {
      setLoading(true);
      const result = await PlaylistService.importPlaylist(playlistData, userId);
      toast({
        title: 'Success',
        description: 'Playlist imported successfully',
      });
      return result;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to import playlist',
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePlaylistStatus = async (playlistId: string, isPublic: boolean) => {
    try {
      setLoading(true);
      const result = await PlaylistService.updatePlaylistStatus(playlistId, isPublic);
      toast({
        title: 'Success',
        description: 'Playlist status updated successfully',
      });
      return result;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update playlist status',
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deletePlaylist = async (playlistId: string) => {
    try {
      setLoading(true);
      const result = await PlaylistService.deletePlaylist(playlistId);
      toast({
        title: 'Success',
        description: 'Playlist deleted successfully',
      });
      return result;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete playlist',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    importPlaylist,
    updatePlaylistStatus,
    deletePlaylist,
    loading
  };
}

// System Settings hooks
export function useSystemSettings() {
  return useAsyncOperation(() => SystemSettingsService.getAllSettings());
}

export function useSystemSettingsActions() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const updateSetting = async (key: string, value: any, description?: string) => {
    try {
      setLoading(true);
      await SystemSettingsService.updateSetting(key, value, description);
      toast({
        title: 'Success',
        description: 'Setting updated successfully',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update setting',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateSetting,
    loading
  };
}

// Pagination hook
export function usePagination(initialPage = 1, initialLimit = 10) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const offset = (page - 1) * limit;

  const nextPage = () => setPage(prev => prev + 1);
  const prevPage = () => setPage(prev => Math.max(1, prev - 1));
  const goToPage = (newPage: number) => setPage(Math.max(1, newPage));

  return {
    page,
    limit,
    offset,
    setLimit,
    nextPage,
    prevPage,
    goToPage
  };
}

// Search and Filter hook
export function useSearchAndFilter() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setSearch('');
    setFilters({});
  };

  return {
    search,
    setSearch,
    debouncedSearch,
    filters,
    updateFilter,
    clearFilters
  };
}

// KYC hooks
export function useKYCDocuments(options: {
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
} = {}) {
  return useAsyncOperation(
    () => KYCService.getAllKYCDocuments(options),
    [options.search, options.status, options.limit, options.offset]
  );
}

export function useKYCStats() {
  return useAsyncOperation(() => KYCService.getKYCStats());
}

export function useKYCActions(refetchUsers?: () => void) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const updateKYCStatus = async (
    kycId: string, 
    status: 'approved' | 'rejected' | 'pending',
    rejectionReason?: string,
    skipDocumentValidation: boolean = false
  ) => {
    try {
      console.log('useKYCActions.updateKYCStatus called with:', { kycId, status, rejectionReason, skipDocumentValidation });
      setLoading(true);
      const result = await KYCService.updateUserKycStatus(kycId, status, rejectionReason, skipDocumentValidation);
      
      // Check if the update was successful
      if (result && result.length > 0) {
        toast({
          title: 'Success',
          description: `KYC status updated to ${status}`,
        });
        
        // If a refetchUsers function is provided, call it to refresh user data
        if (refetchUsers) {
          console.log('Calling refetchUsers to refresh user data');
          refetchUsers();
        }
        
        return true;
      } else {
        toast({
          title: 'Warning',
          description: 'No KYC document was updated',
          variant: 'destructive'
        });
        return false;
      }
    } catch (error) {
      console.error('Error updating KYC status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update KYC status: ' + (error as Error).message,
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const approveKYC = async (kycId: string, skipDocumentValidation: boolean = false) => {
    return updateKYCStatus(kycId, 'approved', undefined, skipDocumentValidation);
  };

  const rejectKYC = async (kycId: string, reason: string) => {
    if (!reason.trim()) {
      toast({
        title: 'Rejection Reason Required',
        description: 'Please provide a reason for rejection.',
        variant: 'destructive',
      });
      return false;
    }
    return updateKYCStatus(kycId, 'rejected', reason);
  };

  return {
    updateKYCStatus,
    approveKYC,
    rejectKYC,
    loading
  };
}

// Reward Settings hooks
export function useRewardSettings() {
  return useAsyncOperation(() => RewardSettingsService.getRewardSettings());
}

export function useRewardStats() {
  return useAsyncOperation(() => RewardSettingsService.getRewardStats());
}

export function useRewardHistory(limit = 10) {
  return useAsyncOperation(
    () => RewardSettingsService.getSettingsHistory(limit),
    [limit]
  );
}

export function useRewardActions() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const updateRewardSetting = async (key: string, value: any) => {
    try {
      setLoading(true);
      await RewardSettingsService.updateRewardSetting(key, value);
      toast({
        title: 'Success',
        description: 'Reward setting updated successfully',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update reward setting',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const calculatePreview = async (settings: any) => {
    try {
      setLoading(true);
      const preview = await RewardSettingsService.calculateRewardPreview(settings);
      return preview;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to calculate preview',
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const saveAllSettings = async (settings: any) => {
    try {
      setLoading(true);
      const updates = [
        RewardSettingsService.updateRewardSetting('playtime_thresholds', settings.playtimeThresholds),
        RewardSettingsService.updateRewardSetting('points_multiplier', settings.pointsMultiplier),
        RewardSettingsService.updateRewardSetting('bonus_actions', settings.bonusActions),
        RewardSettingsService.updateRewardSetting('referral_system', settings.referralSystem),
        RewardSettingsService.updateRewardSetting('redemption', settings.redemption)
      ];
      
      await Promise.all(updates);
      
      toast({
        title: 'Success',
        description: 'All reward settings saved successfully',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save reward settings',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateRewardSetting,
    calculatePreview,
    saveAllSettings,
    loading
  };
}

// CMS Content Management hooks
export function usePageContent(page: string) {
  return useAsyncOperation(
    () => CMSService.getPageContent(page),
    [page]
  );
}

export function useFAQs() {
  return useAsyncOperation(() => CMSService.getAllFAQs());
}

export function useTermsAndPolicies() {
  return useAsyncOperation(() => CMSService.getTermsAndPolicies());
}

export function useCMSStats() {
  return useAsyncOperation(() => CMSService.getCMSStats());
}

export function useCMSActions() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const updatePageContent = async (page: string, content: any) => {
    try {
      setLoading(true);
      await CMSService.updatePageContent(page, content);
      toast({
        title: 'Success',
        description: 'Page content updated successfully',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update page content',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createFAQ = async (faqData: any) => {
    try {
      setLoading(true);
      await CMSService.createFAQ(faqData);
      toast({
        title: 'Success',
        description: 'FAQ created successfully',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create FAQ',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateFAQ = async (id: string, faqData: any) => {
    try {
      setLoading(true);
      await CMSService.updateFAQ(id, faqData);
      toast({
        title: 'Success',
        description: 'FAQ updated successfully',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update FAQ',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteFAQ = async (id: string) => {
    try {
      setLoading(true);
      await CMSService.deleteFAQ(id);
      toast({
        title: 'Success',
        description: 'FAQ deleted successfully',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete FAQ',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTermsAndPolicies = async (type: 'terms_conditions' | 'privacy_policy', content: any) => {
    try {
      setLoading(true);
      await CMSService.updateTermsAndPolicies(type, content);
      toast({
        title: 'Success',
        description: `${type === 'terms_conditions' ? 'Terms and Conditions' : 'Privacy Policy'} updated successfully`,
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update legal documents',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updatePageContent,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    updateTermsAndPolicies,
    loading
  };
}

// Profile Management hooks
export function useCurrentProfile() {
  return useAsyncOperation(() => ProfileService.getCurrentProfile());
}

export function useRecentActivity(limit = 5) {
  return useAsyncOperation(
    () => ProfileService.getRecentActivity(limit),
    [limit]
  );
}

export function useSessionInfo() {
  return useAsyncOperation(() => ProfileService.getSessionInfo());
}

export function useProfileActions() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const updateProfile = async (updates: {
    fullName?: string;
    phone?: string;
    bio?: string;
    timezone?: string;
    avatarUrl?: string;
  }) => {
    try {
      setLoading(true);
      await ProfileService.updateProfile(updates);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      await ProfileService.updatePassword(currentPassword, newPassword);
      toast({
        title: 'Success',
        description: 'Password updated successfully',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update password. Please check your current password.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAdminSettings = async (settings: {
    twoFactorEnabled?: boolean;
    sessionTimeout?: number;
    permissions?: Record<string, any>;
  }) => {
    try {
      setLoading(true);
      await ProfileService.updateAdminSettings(settings);
      toast({
        title: 'Success',
        description: 'Admin settings updated successfully',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update admin settings',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    updatePassword,
    updateAdminSettings,
    logout,
    loading
  };
}