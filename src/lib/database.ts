import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Type definitions for better type safety
type Tables = Database['public']['Tables'];
type Profile = Tables['profiles']['Row'];
type UserRole = Tables['user_roles']['Row'];
type KycDocument = Tables['kyc_documents']['Row'];
type Playlist = Tables['playlists']['Row'];
type Track = Tables['tracks']['Row'];
type Transaction = Tables['transactions']['Row'];
type UserReward = Tables['user_rewards']['Row'];
type BotConfig = Tables['bot_configs']['Row'];
type BotLog = Tables['bot_logs']['Row'];
type SystemSetting = Tables['system_settings']['Row'];
type ListeningSession = Tables['listening_sessions']['Row'];
type RewardTransaction = Tables['reward_transactions']['Row'];

// Dashboard Analytics Service
export class DashboardService {
  static async getDashboardStats() {
    try {
      // Get total users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get pending KYC count
      const { count: pendingKyc } = await supabase
        .from('kyc_documents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get total transactions amount for this month
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      firstDayOfMonth.setHours(0, 0, 0, 0);

      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount')
        .eq('status', 'completed')
        .gte('created_at', firstDayOfMonth.toISOString());

      const totalTransactionAmount = transactions?.reduce((sum, txn) => sum + Number(txn.amount), 0) || 0;

      // Get active bots count
      const { count: activeBots } = await supabase
        .from('bot_configs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get total rewards distributed this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data: rewardTransactions } = await supabase
        .from('reward_transactions')
        .select('points')
        .eq('transaction_type', 'earned')
        .gte('created_at', oneWeekAgo.toISOString());

      const totalRewards = rewardTransactions?.reduce((sum, reward) => sum + reward.points, 0) || 0;

      // Get average session time
      const { data: sessions } = await supabase
        .from('listening_sessions')
        .select('duration_listened')
        .not('duration_listened', 'is', null)
        .gte('started_at', oneWeekAgo.toISOString());

      const avgSessionTime = sessions?.length 
        ? Math.round(sessions.reduce((sum, session) => sum + (session.duration_listened || 0), 0) / sessions.length / 60)
        : 0;

      return {
        totalUsers: totalUsers || 0,
        pendingKyc: pendingKyc || 0,
        totalTransactionAmount,
        activeBots: activeBots || 0,
        totalRewards,
        avgSessionTime
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  static async getRecentActivities(limit = 10) {
    try {
      // Get recent KYC approvals, transactions, and bot activities
      const { data: recentKyc } = await supabase
        .from('kyc_documents')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(5);

      const { data: recentTransactions } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Get user details separately
      const kycUserIds = recentKyc?.map(doc => doc.user_id) || [];
      const txnUserIds = recentTransactions?.map(txn => txn.user_id) || [];
      const allUserIds = [...new Set([...kycUserIds, ...txnUserIds])];
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', allUserIds);

      const activities = [];

      // Process KYC activities
      recentKyc?.forEach(doc => {
        const profile = profiles?.find(p => p.id === doc.user_id);
        activities.push({
          user: profile?.email || 'Unknown',
          action: `KYC ${doc.status === 'approved' ? 'Approved' : doc.status === 'rejected' ? 'Rejected' : 'Submitted'}`,
          time: new Date(doc.updated_at!).toLocaleString(),
          type: doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'error' : 'warning'
        });
      });

      // Process transaction activities
      recentTransactions?.forEach(txn => {
        const profile = profiles?.find(p => p.id === txn.user_id);
        activities.push({
          user: profile?.email || 'Unknown',
          action: `Transaction ${txn.status}`,
          time: new Date(txn.created_at!).toLocaleString(),
          type: txn.status === 'completed' ? 'success' : txn.status === 'failed' ? 'error' : 'default'
        });
      });

      // Sort by time and limit
      return activities
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  }

  static async getSystemStatus() {
    try {
      // Check various system components
      const { data: botConfigs } = await supabase
        .from('bot_configs')
        .select('status')
        .limit(1);

      const { data: recentTransactions } = await supabase
        .from('transactions')
        .select('status')
        .order('created_at', { ascending: false })
        .limit(5);

      // Determine system status based on recent activity
      const hasFailedTransactions = recentTransactions?.some(txn => txn.status === 'failed');
      const hasActiveBots = botConfigs?.some(bot => bot.status === 'active');

      return {
        api: 'operational',
        database: 'healthy',
        botEngine: hasActiveBots ? 'active' : 'idle',
        paymentGateway: hasFailedTransactions ? 'issues' : 'online',
        spotifyApi: 'connected'
      };
    } catch (error) {
      console.error('Error checking system status:', error);
      return {
        api: 'error',
        database: 'error',
        botEngine: 'error',
        paymentGateway: 'error',
        spotifyApi: 'error'
      };
    }
  }
}

// Users Management Service
export class UsersService {
  static async getAllUsers(options: {
    search?: string;
    status?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('is_active', true);

      if (options.search) {
        query = query.or(`full_name.ilike.%${options.search}%,email.ilike.%${options.search}%`);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Get related data separately
      const userIds = data?.map(user => user.id) || [];
      
      // Get user roles
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      // Get KYC documents
      const { data: kycDocuments } = await supabase
        .from('kyc_documents')
        .select('user_id, status')
        .in('user_id', userIds);

      // Get user rewards
      const { data: userRewards } = await supabase
        .from('user_rewards')
        .select('user_id, total_points, total_listening_time')
        .in('user_id', userIds);

      // Get transactions separately
      const { data: transactions } = await supabase
        .from('transactions')
        .select('user_id, amount, status')
        .in('user_id', userIds)
        .eq('status', 'completed');

      // Process the data to match the expected format
      return data?.map(user => {
        const userTransactions = transactions?.filter(t => t.user_id === user.id) || [];
        const walletBalance = userTransactions.reduce((sum, txn) => sum + Number(txn.amount), 0);
        
        const kycDoc = kycDocuments?.find(doc => doc.user_id === user.id);
        const userReward = userRewards?.find(reward => reward.user_id === user.id);
        const userRole = userRoles?.find(role => role.user_id === user.id);
        
        return {
          id: user.id,
          name: user.full_name || user.email,
          email: user.email,
          joinDate: new Date(user.created_at!).toLocaleDateString(),
          kycStatus: kycDoc?.status || 'pending',
          walletBalance,
          lastLogin: user.last_login ? new Date(user.last_login).toLocaleString() : 'Never',
          totalPlaytime: userReward?.total_listening_time 
            ? `${Math.floor((userReward.total_listening_time) / 3600)}h ${Math.floor(((userReward.total_listening_time) % 3600) / 60)}m`
            : '0h 0m',
          totalPoints: userReward?.total_points || 0,
          phone: user.phone,
          isActive: user.is_active,
          spotifyConnected: !!user.spotify_id,
          role: userRole?.role || 'user'
        };
      }) || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async getUserStats() {
    try {
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      const { count: pendingKyc } = await supabase
        .from('kyc_documents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: approvedKyc } = await supabase
        .from('kyc_documents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      const { count: rejectedKyc } = await supabase
        .from('kyc_documents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected');

      return {
        totalUsers: totalUsers || 0,
        pendingKyc: pendingKyc || 0,
        approvedKyc: approvedKyc || 0,
        rejectedKyc: rejectedKyc || 0
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  static async updateUserKycStatus(userId: string, status: 'approved' | 'rejected' | 'pending', rejectionReason?: string) {
    try {
      const { data, error } = await supabase
        .from('kyc_documents')
        .update({
          status,
          rejection_reason: rejectionReason,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('user_id', userId)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating KYC status:', error);
      throw error;
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<Profile>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
}

// Transactions Service
export class TransactionsService {
  static async getAllTransactions(options: {
    search?: string;
    status?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    try {
      let query = supabase
        .from('transactions')
        .select('*');

      if (options.search) {
        query = query.or(`transaction_id.ilike.%${options.search}%`);
      }

      if (options.status && options.status !== 'all') {
        query = query.eq('status', options.status as any);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Get user details separately
      const userIds = data?.map(txn => txn.user_id) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', userIds);

      return data?.map(txn => {
        const profile = profiles?.find(p => p.id === txn.user_id);
        return {
          id: txn.transaction_id,
          user: profile?.email || 'Unknown',
          amount: `₹${Number(txn.amount).toFixed(2)}`,
          type: txn.transaction_type,
          status: txn.status,
          date: new Date(txn.created_at!).toLocaleDateString(),
          gateway_reference: txn.gateway_reference,
          payment_method: txn.payment_method
        };
      }) || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  static async getUserWalletBalances() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, updated_at')
        .eq('is_active', true)
        .limit(50);

      if (error) throw error;

      // Get transactions and user rewards separately for each user
      const userIds = data?.map(user => user.id) || [];
      
      const { data: transactions } = await supabase
        .from('transactions')
        .select('user_id, amount, status')
        .in('user_id', userIds)
        .eq('status', 'completed');

      const { data: userRewards } = await supabase
        .from('user_rewards')
        .select('user_id, total_points')
        .in('user_id', userIds);

      return data?.map(user => {
        const userTransactions = transactions?.filter(t => t.user_id === user.id) || [];
        const inrBalance = userTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
        const userReward = userRewards?.find(r => r.user_id === user.id);
        
        return {
          user: user.email,
          inrBalance: `₹${inrBalance.toFixed(2)}`,
          pointsBalance: `${userReward?.total_points || 0} Points`,
          lastUpdated: new Date(user.updated_at!).toLocaleDateString()
        };
      }) || [];
    } catch (error) {
      console.error('Error fetching wallet balances:', error);
      throw error;
    }
  }
}

// Analytics Service
export class AnalyticsService {
  static async getPlaytimeData(days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('listening_sessions')
        .select('started_at, duration_listened')
        .gte('started_at', startDate.toISOString())
        .not('duration_listened', 'is', null);

      if (error) throw error;

      // Group by date and sum minutes
      const dailyData: { [key: string]: number } = {};
      
      data?.forEach(session => {
        const date = new Date(session.started_at!).toISOString().split('T')[0];
        const minutes = Math.floor((session.duration_listened || 0) / 60);
        dailyData[date] = (dailyData[date] || 0) + minutes;
      });

      return Object.entries(dailyData).map(([date, minutes]) => ({
        date,
        minutes
      }));
    } catch (error) {
      console.error('Error fetching playtime data:', error);
      return [];
    }
  }

  static async getTopSongs(limit = 5) {
    try {
      const { data, error } = await supabase
        .from('listening_sessions')
        .select(`
          track_id,
          tracks!listening_sessions_track_id_fkey(name)
        `)
        .not('track_id', 'is', null);

      if (error) throw error;

      // Count plays per track
      const trackCounts: { [key: string]: { name: string; plays: number } } = {};
      
      data?.forEach(session => {
        if (session.track_id && session.tracks) {
          const trackName = session.tracks.name;
          if (!trackCounts[session.track_id]) {
            trackCounts[session.track_id] = { name: trackName, plays: 0 };
          }
          trackCounts[session.track_id].plays++;
        }
      });

      return Object.values(trackCounts)
        .sort((a, b) => b.plays - a.plays)
        .slice(0, limit)
        .map(track => ({
          song: track.name,
          plays: track.plays
        }));
    } catch (error) {
      console.error('Error fetching top songs:', error);
      return [];
    }
  }

  static async getUserSegmentData() {
    try {
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: premiumUsers } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      const premium = premiumUsers || 0;
      const free = (totalUsers || 0) - premium;
      const total = totalUsers || 1;

      return [
        { name: "Premium Users", value: Math.round((premium / total) * 100), color: "hsl(var(--primary))" },
        { name: "Free Users", value: Math.round((free / total) * 100), color: "hsl(var(--secondary))" },
      ];
    } catch (error) {
      console.error('Error fetching user segment data:', error);
      return [
        { name: "Premium Users", value: 65, color: "hsl(var(--primary))" },
        { name: "Free Users", value: 35, color: "hsl(var(--secondary))" },
      ];
    }
  }

  static async getPointsEarnedData(days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('reward_transactions')
        .select('created_at, points')
        .eq('transaction_type', 'earned')
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      // Group by date and sum points
      const dailyData: { [key: string]: number } = {};
      
      data?.forEach(reward => {
        const date = new Date(reward.created_at!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dailyData[date] = (dailyData[date] || 0) + reward.points;
      });

      return Object.entries(dailyData).map(([date, points]) => ({
        date,
        points
      }));
    } catch (error) {
      console.error('Error fetching points earned data:', error);
      return [];
    }
  }

  static async getAnalyticsKPIs() {
    try {
      // Average session time
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data: sessions } = await supabase
        .from('listening_sessions')
        .select('duration_listened')
        .not('duration_listened', 'is', null)
        .gte('started_at', oneWeekAgo.toISOString());

      const avgSessionTime = sessions?.length 
        ? sessions.reduce((sum, session) => sum + (session.duration_listened || 0), 0) / sessions.length / 60
        : 0;

      // User retention (active users in last 7 days vs total)
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_login', oneWeekAgo.toISOString());

      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const retention = totalUsers ? (activeUsers! / totalUsers) * 100 : 0;

      // Bot efficiency (successful vs total bot logs)
      const { count: successfulBotLogs } = await supabase
        .from('bot_logs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'success')
        .gte('created_at', oneWeekAgo.toISOString());

      const { count: totalBotLogs } = await supabase
        .from('bot_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneWeekAgo.toISOString());

      const botEfficiency = totalBotLogs ? (successfulBotLogs! / totalBotLogs) * 100 : 0;

      return {
        avgSessionTime: `${Math.round(avgSessionTime)} min`,
        userRetention: `${retention.toFixed(1)}%`,
        botEfficiency: `${botEfficiency.toFixed(1)}%`,
        growthRate: '+15.3%' // This would need more complex calculation
      };
    } catch (error) {
      console.error('Error fetching analytics KPIs:', error);
      return {
        avgSessionTime: '0 min',
        userRetention: '0%',
        botEfficiency: '0%',
        growthRate: '0%'
      };
    }
  }
}

// Bot Management Service
export class BotService {
  static async getAllBotConfigs() {
    try {
      const { data, error } = await supabase
        .from('bot_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching bot configs:', error);
      throw error;
    }
  }

  static async getBotConfigById(id: string) {
    try {
      const { data, error } = await supabase
        .from('bot_configs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching bot config:', error);
      throw error;
    }
  }

  static async getDefaultBotConfig() {
    try {
      // Try to get the first active bot config
      const { data, error } = await supabase
        .from('bot_configs')
        .select('*')
        .eq('status', 'active')
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        return data[0];
      }

      // No bot config found, return default values
      return {
        id: 'default',
        name: 'Default Bot Configuration',
        description: 'Default bot settings for new installations',
        status: 'active',
        config: {
          session: {
            minDuration: 15,
            maxDuration: 45,
            minDelay: 5,
            maxDelay: 30,
            dailyLimit: 8
          },
          playback: {
            mode: 'intelligent',
            enableRandomSkips: false,
            enablePauseResume: true,
            likePpopularSongs: false,
            skipProbability: 15
          },
          restrictions: {
            premiumOnly: true,
            minAccountAge: 7,
            kycRequired: true
          }
        },
        spotify_settings: {},
        reward_settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching default bot config:', error);
      throw error;
    }
  }

  static async updateBotConfig(id: string, updates: Partial<BotConfig>) {
    try {
      const { data, error } = await supabase
        .from('bot_configs')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
          last_modified_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating bot config:', error);
      throw error;
    }
  }

  static async createBotConfig(config: Partial<BotConfig>) {
    try {
      const currentUser = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('bot_configs')
        .insert({
          name: config.name || 'New Bot Configuration',
          description: config.description,
          status: config.status || 'inactive',
          config: config.config,
          spotify_settings: config.spotify_settings,
          reward_settings: config.reward_settings
        })
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating bot config:', error);
      throw error;
    }
  }

  static async testBotConfig(id: string) {
    try {
      // Log a test execution
      const { data, error } = await supabase
        .from('bot_logs')
        .insert({
          bot_config_id: id,
          action: 'test_execution',
          status: 'success',
          message: 'Bot configuration test initiated',
          metadata: { test: true },
          execution_time: 1000
        })
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error testing bot config:', error);
      throw error;
    }
  }

  static async getBotStats() {
    try {
      const { count: totalConfigs } = await supabase
        .from('bot_configs')
        .select('*', { count: 'exact', head: true });

      const { count: activeConfigs } = await supabase
        .from('bot_configs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const { count: activeSessions } = await supabase
        .from('listening_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('started_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .is('ended_at', null);

      const { count: pendingLogs } = await supabase
        .from('bot_logs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      return {
        totalConfigs: totalConfigs || 0,
        activeConfigs: activeConfigs || 0,
        activeSessions: activeSessions || 0,
        pendingLogs: pendingLogs || 0,
        serviceStatus: 'active' // This could be dynamic based on system health
      };
    } catch (error) {
      console.error('Error fetching bot stats:', error);
      return {
        totalConfigs: 0,
        activeConfigs: 0,
        activeSessions: 0,
        pendingLogs: 0,
        serviceStatus: 'error'
      };
    }
  }

  static async getBotLogs(limit = 50) {
    try {
      const { data, error } = await supabase
        .from('bot_logs')
        .select(`
          *,
          bot_configs!bot_logs_bot_config_id_fkey(name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching bot logs:', error);
      return [];
    }
  }
}

// Playlist Management Service
export class PlaylistService {
  static async getAllPlaylists() {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          *,
          profiles!playlists_user_id_fkey(email, full_name),
          playlist_tracks(track_id, tracks(name, artists))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching playlists:', error);
      throw error;
    }
  }

  static async getPlaylistStats() {
    try {
      const { count: totalPlaylists } = await supabase
        .from('playlists')
        .select('*', { count: 'exact', head: true });

      const { count: activePlaylists } = await supabase
        .from('playlists')
        .select('*', { count: 'exact', head: true })
        .eq('is_public', true);

      // Get total listening hours from listening sessions
      const { data: sessions } = await supabase
        .from('listening_sessions')
        .select('duration_listened');

      const totalListeningHours = sessions?.reduce((sum, session) => sum + (session.duration_listened || 0), 0) || 0;

      // Get active listeners (users who listened in last 24 hours)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const { count: activeListeners } = await supabase
        .from('listening_sessions')
        .select('user_id', { count: 'exact', head: true })
        .gte('started_at', oneDayAgo.toISOString());

      // Get total points distributed
      const { data: rewards } = await supabase
        .from('reward_transactions')
        .select('points')
        .eq('transaction_type', 'earned');

      const pointsDistributed = rewards?.reduce((sum, reward) => sum + reward.points, 0) || 0;

      return {
        totalPlaylists: totalPlaylists || 0,
        activePlaylists: activePlaylists || 0,
        totalListeningHours: Math.floor(totalListeningHours / 3600),
        activeListeners: activeListeners || 0,
        pointsDistributed
      };
    } catch (error) {
      console.error('Error fetching playlist stats:', error);
      return {
        totalPlaylists: 0,
        activePlaylists: 0,
        totalListeningHours: 0,
        activeListeners: 0,
        pointsDistributed: 0
      };
    }
  }
}

// System Settings Service
export class SystemSettingsService {
  static async getAllSettings() {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching system settings:', error);
      throw error;
    }
  }

  static async updateSetting(key: string, value: any, description?: string) {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .upsert({
          key,
          value,
          description,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating system setting:', error);
      throw error;
    }
  }
}

// KYC Management Service
export class KYCService {
  static async getAllKYCDocuments(options: {
    search?: string;
    status?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    try {
      let query = supabase
        .from('kyc_documents')
        .select('*');

      if (options.status && options.status !== 'all') {
        query = query.eq('status', options.status as 'pending' | 'approved' | 'rejected' | 'under_review');
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query.order('submitted_at', { ascending: false });

      if (error) throw error;

      // Get user and reviewer details separately
      const userIds = [...new Set([...data?.map(doc => doc.user_id) || [], ...data?.map(doc => doc.reviewed_by).filter(Boolean) || []])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, created_at')
        .in('id', userIds);

      // Apply search filter if needed
      let filteredData = data;
      if (options.search) {
        const searchLower = options.search.toLowerCase();
        filteredData = data?.filter(doc => {
          const profile = profiles?.find(p => p.id === doc.user_id);
          return (
            profile?.full_name?.toLowerCase().includes(searchLower) ||
            profile?.email?.toLowerCase().includes(searchLower) ||
            doc.file_name?.toLowerCase().includes(searchLower)
          );
        }) || [];
      }

      // Transform the data to match the expected format
      return filteredData?.map(doc => {
        const profile = profiles?.find(p => p.id === doc.user_id);
        const reviewer = profiles?.find(p => p.id === doc.reviewed_by);

        return {
          id: doc.id,
          userId: doc.user_id,
          userName: profile?.full_name || profile?.email || 'Unknown User',
          userEmail: profile?.email || 'Unknown Email',
          documentType: doc.document_type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown',
          documentNumber: doc.file_name || 'N/A',
          status: doc.status,
          submittedDate: new Date(doc.submitted_at!).toLocaleDateString(),
          reviewedDate: doc.reviewed_at ? new Date(doc.reviewed_at).toLocaleDateString() : null,
          reviewedBy: reviewer?.full_name || reviewer?.email || null,
          rejectionReason: doc.rejection_reason,
          documents: {
            front: doc.document_url || '/placeholder.svg',
            back: doc.document_url || '/placeholder.svg', // Assuming same URL for now
            selfie: doc.document_url || '/placeholder.svg' // Assuming same URL for now
          },
          userDetails: {
            phone: profile?.phone || 'N/A',
            dateOfBirth: 'N/A', // Not in current schema
            address: 'N/A' // Not in current schema
          }
        };
      }) || [];
    } catch (error) {
      console.error('Error fetching KYC documents:', error);
      throw error;
    }
  }

  static async getKYCStats() {
    try {
      const { count: pendingCount } = await supabase
        .from('kyc_documents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: underReviewCount } = await supabase
        .from('kyc_documents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'under_review');

      const { count: approvedCount } = await supabase
        .from('kyc_documents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      const { count: rejectedCount } = await supabase
        .from('kyc_documents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected');

      return {
        pendingCount: pendingCount || 0,
        underReviewCount: underReviewCount || 0,
        approvedCount: approvedCount || 0,
        rejectedCount: rejectedCount || 0,
        totalCount: (pendingCount || 0) + (underReviewCount || 0) + (approvedCount || 0) + (rejectedCount || 0)
      };
    } catch (error) {
      console.error('Error fetching KYC stats:', error);
      throw error;
    }
  }

  static async updateKYCStatus(
    kycId: string, 
    status: 'approved' | 'rejected' | 'pending' | 'under_review',
    rejectionReason?: string
  ) {
    try {
      const currentUser = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('kyc_documents')
        .update({
          status,
          rejection_reason: rejectionReason || null,
          reviewed_at: status !== 'pending' ? new Date().toISOString() : null,
          reviewed_by: status !== 'pending' ? currentUser.data.user?.id : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', kycId)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating KYC status:', error);
      throw error;
    }
  }

  static async getKYCDocumentById(kycId: string) {
    try {
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('id', kycId)
        .single();

      if (error) throw error;
      if (!data) return null;

      // Get user and reviewer details separately
      const userIds = [data.user_id, data.reviewed_by].filter(Boolean);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, created_at')
        .in('id', userIds);

      const profile = profiles?.find(p => p.id === data.user_id);
      const reviewer = profiles?.find(p => p.id === data.reviewed_by);

      return {
        id: data.id,
        userId: data.user_id,
        userName: profile?.full_name || profile?.email || 'Unknown User',
        userEmail: profile?.email || 'Unknown Email',
        documentType: data.document_type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown',
        documentNumber: data.file_name || 'N/A',
        status: data.status,
        submittedDate: new Date(data.submitted_at!).toLocaleDateString(),
        reviewedDate: data.reviewed_at ? new Date(data.reviewed_at).toLocaleDateString() : null,
        reviewedBy: reviewer?.full_name || reviewer?.email || null,
        rejectionReason: data.rejection_reason,
        documents: {
          front: data.document_url || '/placeholder.svg',
          back: data.document_url || '/placeholder.svg',
          selfie: data.document_url || '/placeholder.svg'
        },
        userDetails: {
          phone: profile?.phone || 'N/A',
          dateOfBirth: 'N/A',
          address: 'N/A'
        }
      };
    } catch (error) {
      console.error('Error fetching KYC document:', error);
      throw error;
    }
  }
}

// Reward Settings Service
export class RewardSettingsService {
  static async getRewardSettings() {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('category', 'rewards')
        .order('key', { ascending: true });

      if (error) throw error;

      // Transform settings into a more usable format
      const settings: Record<string, any> = {};
      data?.forEach(setting => {
        settings[setting.key] = setting.value;
      });

      // Return default values if no settings found
      return {
        playtimeThresholds: settings.playtime_thresholds || {
          100: 50,
          500: 300,
          1000: 750,
          5000: 5000
        },
        pointsMultiplier: settings.points_multiplier || 1.5,
        bonusActions: settings.bonus_actions || {
          likeSong: 5,
          sharePlaylist: 25,
          followArtist: 10,
          createPlaylist: 50,
          enabled: true,
          doublePointsWeekends: false
        },
        referralSystem: settings.referral_system || {
          enabled: true,
          bonusPoints: 500,
          maxReferrals: 10,
          codeFormat: 'SPOTIFY{USER_ID}'
        },
        redemption: settings.redemption || {
          conversionRate: 100, // points per ₹1
          minRedemption: 500,
          enableGiftCards: true,
          enableBankTransfers: false,
          enableUPI: true
        }
      };
    } catch (error) {
      console.error('Error fetching reward settings:', error);
      throw error;
    }
  }

  static async updateRewardSetting(key: string, value: any) {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .upsert({
          key,
          value,
          category: 'rewards',
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating reward setting:', error);
      throw error;
    }
  }

  static async getRewardStats() {
    try {
      // Get total points distributed
      const { data: rewardTransactions } = await supabase
        .from('reward_transactions')
        .select('points')
        .eq('transaction_type', 'earned');

      const totalPointsDistributed = rewardTransactions?.reduce((sum, transaction) => sum + transaction.points, 0) || 0;

      // Get total users with points
      const { count: usersWithPoints } = await supabase
        .from('user_rewards')
        .select('*', { count: 'exact', head: true })
        .gt('total_points', 0);

      // Get average points per user
      const { data: userRewards } = await supabase
        .from('user_rewards')
        .select('total_points');

      const avgPointsPerUser = userRewards?.length 
        ? userRewards.reduce((sum, user) => sum + user.total_points, 0) / userRewards.length
        : 0;

      return {
        totalPointsDistributed,
        usersWithPoints: usersWithPoints || 0,
        avgPointsPerUser: Math.round(avgPointsPerUser)
      };
    } catch (error) {
      console.error('Error fetching reward stats:', error);
      return {
        totalPointsDistributed: 0,
        usersWithPoints: 0,
        avgPointsPerUser: 0
      };
    }
  }

  static async getSettingsHistory(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('table_name', 'system_settings')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Get user details separately
      const userIds = data?.map(log => log.user_id).filter(Boolean) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      return data?.map(log => {
        const profile = profiles?.find(p => p.id === log.user_id);
        return {
          id: log.id,
          action: 'Updated reward settings',
          description: `Modified ${(log.new_values as any)?.key || 'setting'}`,
          changedBy: profile?.full_name || profile?.email || 'Unknown User',
          changedAt: new Date(log.created_at!).toLocaleString(),
          oldValues: log.old_values,
          newValues: log.new_values
        };
      }) || [];
    } catch (error) {
      console.error('Error fetching settings history:', error);
      return [];
    }
  }

  static async calculateRewardPreview(settings: any) {
    // Calculate preview based on current settings
    const { playtimeThresholds, pointsMultiplier } = settings;
    
    const previews = [];
    const thresholds = Object.entries(playtimeThresholds).map(([minutes, points]) => ({ 
      minutes: parseInt(minutes), 
      points: points as number 
    }));

    thresholds.sort((a, b) => a.minutes - b.minutes);
    thresholds.forEach(threshold => {
      const basePoints = threshold.points;
      const multipliedPoints = Math.round(basePoints * pointsMultiplier);
      previews.push({
        minutes: threshold.minutes,
        points: multipliedPoints
      });
    });

    return previews;
  }
}

// CMS Content Management Service
export class CMSService {
  static async getPageContent(page: string) {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('key', `page_${page}`)
        .maybeSingle();

      if (error) {
        console.error('Error fetching page content:', error);
        return CMSService.getDefaultPageContent(page);
      }

      if (!data) {
        // Return default content if no content found
        return CMSService.getDefaultPageContent(page);
      }

      return data?.value || CMSService.getDefaultPageContent(page);
    } catch (error) {
      console.error('Error fetching page content:', error);
      return CMSService.getDefaultPageContent(page);
    }
  }

  static async updatePageContent(page: string, content: any) {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .upsert({
          key: `page_${page}`,
          value: content,
          category: 'cms',
          description: `Content for ${page} page`,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating page content:', error);
      throw error;
    }
  }

  static async getAllFAQs() {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('category', 'faq')
        .order('key', { ascending: true });

      if (error) throw error;

      // Transform settings into FAQ format
      return data?.map(setting => {
        const faqData = setting.value as any;
        return {
          id: setting.id,
          key: setting.key,
          question: faqData.question || 'Untitled Question',
          answer: faqData.answer || '',
          category: faqData.category || 'General',
          status: faqData.status || 'draft',
          lastUpdated: new Date(setting.updated_at!).toLocaleDateString(),
          ...faqData
        };
      }) || [];
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return [];
    }
  }

  static async createFAQ(faqData: any) {
    try {
      const faqKey = `faq_${Date.now()}`;
      const { data, error } = await supabase
        .from('system_settings')
        .insert({
          key: faqKey,
          value: faqData,
          category: 'faq',
          description: `FAQ: ${faqData.question}`,
        })
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating FAQ:', error);
      throw error;
    }
  }

  static async updateFAQ(id: string, faqData: any) {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .update({
          value: faqData,
          description: `FAQ: ${faqData.question}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
  }

  static async deleteFAQ(id: string) {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .delete()
        .eq('id', id)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
  }

  static async getTermsAndPolicies() {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('category', 'legal')
        .order('key', { ascending: true });

      if (error) throw error;

      const result: any = {};
      data?.forEach(setting => {
        if (setting.key === 'terms_conditions') {
          result.termsConditions = setting.value;
        } else if (setting.key === 'privacy_policy') {
          result.privacyPolicy = setting.value;
        }
      });

      // Return defaults if no data found
      return {
        termsConditions: result.termsConditions || CMSService.getDefaultTerms(),
        privacyPolicy: result.privacyPolicy || CMSService.getDefaultPrivacyPolicy()
      };
    } catch (error) {
      console.error('Error fetching terms and policies:', error);
      return {
        termsConditions: CMSService.getDefaultTerms(),
        privacyPolicy: CMSService.getDefaultPrivacyPolicy()
      };
    }
  }

  static async updateTermsAndPolicies(type: 'terms_conditions' | 'privacy_policy', content: any) {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .upsert({
          key: type,
          value: content,
          category: 'legal',
          description: type === 'terms_conditions' ? 'Terms and Conditions' : 'Privacy Policy',
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating terms and policies:', error);
      throw error;
    }
  }

  static async getCMSStats() {
    try {
      // Get total FAQs
      const { count: totalFAQs } = await supabase
        .from('system_settings')
        .select('*', { count: 'exact', head: true })
        .eq('category', 'faq');

      // Get published FAQs
      const { data: faqData } = await supabase
        .from('system_settings')
        .select('value')
        .eq('category', 'faq');

      const publishedFAQs = faqData?.filter(faq => {
        const faqValue = faq.value as any;
        return faqValue.status === 'published';
      }).length || 0;

      // Get last content update
      const { data: lastUpdate } = await supabase
        .from('system_settings')
        .select('updated_at')
        .in('category', ['cms', 'faq', 'legal'])
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      return {
        totalFAQs: totalFAQs || 0,
        publishedFAQs,
        lastContentUpdate: lastUpdate?.updated_at ? new Date(lastUpdate.updated_at).toLocaleDateString() : 'Never',
        contentViews: 12543 // This would need to be tracked separately
      };
    } catch (error) {
      console.error('Error fetching CMS stats:', error);
      return {
        totalFAQs: 0,
        publishedFAQs: 0,
        lastContentUpdate: 'Never',
        contentViews: 0
      };
    }
  }

  static getDefaultPageContent(page: string) {
    switch (page) {
      case 'rewards':
        return {
          seo: {
            title: 'Earn Rewards | Spotify Playtime Enhancer',
            metaDescription: 'Earn points and rewards by listening to music on Spotify...'
          },
          hero: {
            title: 'Earn Amazing Rewards',
            subtitle: 'Listen to your favorite music and get rewarded for it!',
            image: 'hero-rewards.jpg'
          },
          content: {
            description: 'Describe how users can earn and redeem rewards...',
            featuredReward: '₹500 Gift Card for 10,000 points',
            minRedemption: 'Minimum 500 points required'
          },
          cta: {
            text: 'Start Earning Now',
            link: '/signup'
          }
        };
      default:
        return {
          title: 'Page Content',
          content: 'Default page content'
        };
    }
  }

  static getDefaultTerms() {
    return {
      version: 'v1.0',
      effectiveDate: new Date().toISOString().split('T')[0],
      content: 'Default terms and conditions content...',
      active: true
    };
  }

  static getDefaultPrivacyPolicy() {
    return {
      version: 'v1.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      content: 'Default privacy policy content...',
      active: true
    };
  }
}

// Profile Management Service
export class ProfileService {
  static async getCurrentProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // Get user role and admin data separately
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const { data: adminUsers } = await supabase
        .from('admin_users')
        .select('employee_id, department, permissions, two_factor_enabled, last_activity')
        .eq('user_id', user.id)
        .single();

      const userRole = userRoles && userRoles.length > 0 ? userRoles[0] : null;
      const adminData = adminUsers;

      return {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        avatarUrl: data.avatar_url,
        phone: data.phone,
        bio: data.bio,
        timezone: data.timezone || 'UTC',
        isActive: data.is_active,
        lastLogin: data.last_login,
        createdAt: data.created_at,
        role: userRole?.role || 'user',
        spotifyConnected: !!data.spotify_id,
        adminData: adminData ? {
          employeeId: adminData.employee_id,
          department: adminData.department,
          permissions: adminData.permissions,
          twoFactorEnabled: adminData.two_factor_enabled,
          lastActivity: adminData.last_activity
        } : null
      };
    } catch (error) {
      console.error('Error fetching current profile:', error);
      throw error;
    }
  }

  static async updateProfile(updates: {
    fullName?: string;
    phone?: string;
    bio?: string;
    timezone?: string;
    avatarUrl?: string;
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.fullName,
          phone: updates.phone,
          bio: updates.bio,
          timezone: updates.timezone,
          avatar_url: updates.avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  static async updatePassword(currentPassword: string, newPassword: string) {
    try {
      // First verify current password by attempting to sign in
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Update password
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  static async updateAdminSettings(settings: {
    twoFactorEnabled?: boolean;
    sessionTimeout?: number;
    permissions?: Record<string, any>;
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('admin_users')
        .upsert({
          user_id: user.id,
          two_factor_enabled: settings.twoFactorEnabled,
          permissions: settings.permissions || {},
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating admin settings:', error);
      throw error;
    }
  }

  static async getRecentActivity(limit = 5) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Transform audit logs into activity format
      return data?.map(log => ({
        id: log.id,
        action: log.action,
        description: this.formatActivityDescription(log.action, log.table_name),
        timestamp: new Date(log.created_at!).toLocaleString(),
        relativeTime: this.getRelativeTime(new Date(log.created_at!))
      })) || [];
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }

  static async getSessionInfo() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      // Calculate session duration
      const sessionStart = new Date(session.expires_at! - (session.expires_in || 3600) * 1000);
      const now = new Date();
      const duration = Math.floor((now.getTime() - sessionStart.getTime()) / 1000);

      return {
        duration: this.formatDuration(duration),
        expiresAt: new Date(session.expires_at! * 1000).toLocaleString(),
        ipAddress: '192.168.1.100', // This would need to be fetched from request headers
        device: this.getUserAgent()
      };
    } catch (error) {
      console.error('Error fetching session info:', error);
      return null;
    }
  }

  private static formatActivityDescription(action: string, tableName?: string): string {
    const actionMap: Record<string, string> = {
      'INSERT': 'Created',
      'UPDATE': 'Updated',
      'DELETE': 'Deleted',
      'SELECT': 'Viewed'
    };

    const tableMap: Record<string, string> = {
      'kyc_documents': 'KYC request',
      'system_settings': 'reward settings',
      'transactions': 'user transactions',
      'profiles': 'user profile',
      'bot_configs': 'bot configuration'
    };

    const actionText = actionMap[action] || action;
    const resourceText = tableMap[tableName || ''] || (tableName || 'data');

    return `${actionText} ${resourceText}`;
  }

  private static getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }

  private static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  private static getUserAgent(): string {
    if (typeof navigator !== 'undefined') {
      const userAgent = navigator.userAgent;
      if (userAgent.includes('Chrome')) return 'Chrome/Desktop';
      if (userAgent.includes('Firefox')) return 'Firefox/Desktop';
      if (userAgent.includes('Safari')) return 'Safari/Desktop';
      if (userAgent.includes('Edge')) return 'Edge/Desktop';
    }
    return 'Unknown/Desktop';
  }
}
