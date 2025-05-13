import { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonText,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonProgressBar
} from '@ionic/react';
import { 
  alertCircleOutline, 
  timeOutline, 
  locationOutline, 
  personOutline,
  checkmarkCircleOutline,
  warningOutline,
  informationCircleOutline
} from 'ionicons/icons';
import { supabase } from '../utils/supabaseClient';

interface PriorityStat {
  priority: string;
  count: number;
}

interface StatusStat {
  status: string;
  count: number;
}

interface AreaStat {
  areas: {
    area_name: string;
  } | null;
  count: number;
}

interface UserStat {
  users: {
    username: string;
  } | null;
  total_reports: number;
  resolved_reports: number;
}

interface DashboardStats {
  totalReports: number;
  priorityStats: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
  statusStats: {
    pending: number;
    in_progress: number;
    resolved: number;
  };
  responseTimeStats: {
    averageFirstResponse: number;
    averageResolution: number;
  };
  userStats: {
    totalUsers: number;
    activeUsers: number;
    topContributors: {
      username: string;
      total_reports: number;
      resolved_reports: number;
    }[];
  };
}

const DashboardContainer = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch total reports
      const { count: totalReports } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true });

      // Fetch all posts data in one query
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          post_id,
          post_created_at,
          post_updated_at,
          status,
          priority,
          user_id
        `)
        .order('post_created_at', { ascending: false });

      if (postsError) throw postsError;

      // Calculate priority stats
      const priorityStats = {
        urgent: postsData?.filter(post => post.priority === 'urgent').length || 0,
        high: postsData?.filter(post => post.priority === 'high').length || 0,
        medium: postsData?.filter(post => post.priority === 'medium').length || 0,
        low: postsData?.filter(post => post.priority === 'low').length || 0,
      };

      // Calculate status stats
      const statusStats = {
        pending: postsData?.filter(post => post.status === 'pending').length || 0,
        in_progress: postsData?.filter(post => post.status === 'in_progress').length || 0,
        resolved: postsData?.filter(post => post.status === 'resolved').length || 0,
      };

      // Calculate response times
      const responseTimes = postsData?.map(post => {
        const created = new Date(post.post_created_at).getTime();
        const updated = new Date(post.post_updated_at).getTime();
        return {
          firstResponse: post.status !== 'pending' ? (updated - created) / 1000 : 0,
          resolution: post.status === 'resolved' ? (updated - created) / 1000 : 0
        };
      }) || [];

      const responseTimeStats = {
        averageFirstResponse: responseTimes.reduce((sum, rt) => sum + rt.firstResponse, 0) / 
          (responseTimes.filter(rt => rt.firstResponse > 0).length || 1),
        averageResolution: responseTimes.reduce((sum, rt) => sum + rt.resolution, 0) / 
          (responseTimes.filter(rt => rt.resolution > 0).length || 1)
      };

      // Fetch user stats
      const { data: userStatsData, error: userError } = await supabase
        .from('users')
        .select(`
          user_id,
          username,
          user_avatar_url,
          user_email
        `);

      if (userError) throw userError;

      // Process user statistics
      const processedUserStats = {
        totalUsers: userStatsData?.length || 0,
        activeUsers: userStatsData?.filter(user => 
          postsData?.some(post => post.user_id === user.user_id)
        ).length || 0,
        topContributors: userStatsData?.map(user => {
          const userPosts = postsData?.filter(post => post.user_id === user.user_id) || [];
          const resolvedPosts = userPosts.filter(post => post.status === 'resolved').length;
          return {
            username: user.username || 'Unknown',
            total_reports: userPosts.length,
            resolved_reports: resolvedPosts
          };
        })
        .sort((a, b) => b.total_reports - a.total_reports)
        .slice(0, 5) || [],
      };

      setStats({
        totalReports: totalReports || 0,
        priorityStats,
        statusStats,
        responseTimeStats,
        userStats: processedUserStats
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();

    // Set up real-time subscription
    const subscription = supabase
      .channel('dashboard_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'posts' 
        }, 
        () => {
          fetchDashboardStats();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchDashboardStats();
    event.detail.complete();
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <IonText>Loading dashboard...</IonText>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <IonText color="danger">Failed to load dashboard data</IonText>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>

      <IonGrid>
        {/* Total Reports Card */}
        <IonRow>
          <IonCol size="12">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <IonIcon icon={alertCircleOutline} style={{ marginRight: '8px' }} />
                  Total Reports: {stats?.totalReports}
                </IonCardTitle>
              </IonCardHeader>
            </IonCard>
          </IonCol>
        </IonRow>

        {/* Priority and Status Stats */}
        <IonRow>
          <IonCol size="12" sizeMd="6">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Reports by Priority</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  <IonItem>
                    <IonLabel>Urgent</IonLabel>
                    <IonBadge color="danger" slot="end">{stats?.priorityStats.urgent || 0}</IonBadge>
                    <IonProgressBar value={(stats?.priorityStats.urgent || 0) / (stats?.totalReports || 1)} color="danger" />
                  </IonItem>
                  <IonItem>
                    <IonLabel>High</IonLabel>
                    <IonBadge color="warning" slot="end">{stats?.priorityStats.high || 0}</IonBadge>
                    <IonProgressBar value={(stats?.priorityStats.high || 0) / (stats?.totalReports || 1)} color="warning" />
                  </IonItem>
                  <IonItem>
                    <IonLabel>Medium</IonLabel>
                    <IonBadge color="primary" slot="end">{stats?.priorityStats.medium || 0}</IonBadge>
                    <IonProgressBar value={(stats?.priorityStats.medium || 0) / (stats?.totalReports || 1)} color="primary" />
                  </IonItem>
                  <IonItem>
                    <IonLabel>Low</IonLabel>
                    <IonBadge color="success" slot="end">{stats?.priorityStats.low || 0}</IonBadge>
                    <IonProgressBar value={(stats?.priorityStats.low || 0) / (stats?.totalReports || 1)} color="success" />
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
          </IonCol>

          <IonCol size="12" sizeMd="6">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Reports by Status</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  <IonItem>
                    <IonLabel>Pending</IonLabel>
                    <IonBadge color="danger" slot="end">{stats?.statusStats.pending || 0}</IonBadge>
                    <IonProgressBar value={(stats?.statusStats.pending || 0) / (stats?.totalReports || 1)} color="danger" />
                  </IonItem>
                  <IonItem>
                    <IonLabel>In Progress</IonLabel>
                    <IonBadge color="warning" slot="end">{stats?.statusStats.in_progress || 0}</IonBadge>
                    <IonProgressBar value={(stats?.statusStats.in_progress || 0) / (stats?.totalReports || 1)} color="warning" />
                  </IonItem>
                  <IonItem>
                    <IonLabel>Resolved</IonLabel>
                    <IonBadge color="success" slot="end">{stats?.statusStats.resolved || 0}</IonBadge>
                    <IonProgressBar value={(stats?.statusStats.resolved || 0) / (stats?.totalReports || 1)} color="success" />
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>

        {/* Response Times */}
        <IonRow>
          <IonCol size="12">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <IonIcon icon={timeOutline} style={{ marginRight: '8px' }} />
                  Response Times
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  <IonItem>
                    <IonLabel>Average First Response</IonLabel>
                    <IonText slot="end">
                      {formatTime(stats?.responseTimeStats.averageFirstResponse)}
                    </IonText>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Average Resolution Time</IonLabel>
                    <IonText slot="end">
                      {formatTime(stats?.responseTimeStats.averageResolution)}
                    </IonText>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>

        {/* User Statistics */}
        <IonRow>
          <IonCol size="12">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <IonIcon icon={personOutline} style={{ marginRight: '8px' }} />
                  User Statistics
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    <IonCol size="6">
                      <IonText>
                        <h3>Total Users: {stats?.userStats.totalUsers}</h3>
                      </IonText>
                    </IonCol>
                    <IonCol size="6">
                      <IonText>
                        <h3>Active Users: {stats?.userStats.activeUsers}</h3>
                      </IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol size="12">
                      <IonText>
                        <h4>Top Contributors</h4>
                      </IonText>
                      <IonList>
                        {stats?.userStats.topContributors.map((user, index) => (
                          <IonItem key={index}>
                            <IonLabel>
                              <h2>{user.username}</h2>
                              <p>Total Reports: {user.total_reports}</p>
                            </IonLabel>
                            <IonBadge color="success" slot="end">
                              {user.resolved_reports} Resolved
                            </IonBadge>
                          </IonItem>
                        ))}
                      </IonList>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};

const formatTime = (seconds: number | undefined): string => {
  if (!seconds) return 'N/A';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

export default DashboardContainer; 