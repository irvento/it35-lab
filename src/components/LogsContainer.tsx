import { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonAvatar, 
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonBadge
} from '@ionic/react';
import { timeOutline, personOutline, createOutline, trashOutline, create, refreshOutline } from 'ionicons/icons';
import { supabase } from '../utils/supabaseClient';

interface Log {
  id: string;
  user_id: string;
  action: string;
  log_details: string;
  created_at: string;
  username?: string;
  avatar_url?: string;
}

const LogsContainer = () => {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from('logs')
      .select(`
        *,
        users:user_id (username, user_avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const formattedLogs = data.map(log => ({
        ...log,
        username: log.users?.username,
        avatar_url: log.users?.user_avatar_url
      }));
      setLogs(formattedLogs);
    }
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchLogs();
    event.detail.complete();
  };

  const getActionColor = (action: string) => {
    if (action.includes('create')) return 'success';
    if (action.includes('update')) return 'warning';
    if (action.includes('delete')) return 'danger';
    return 'primary';
  };

  const getActionIcon = (action: string) => {
    if (action.includes('create')) return createOutline;
    if (action.includes('update')) return refreshOutline;
    if (action.includes('delete')) return trashOutline;
    return create;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

    if (diffInHours < 24) {
      return `${Math.round(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const formatAction = (action: string) => {
    return action
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Activity Logs</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>

          <IonList>
            {logs.map((log) => (
              <IonItem key={log.id} lines="full">
                <IonAvatar slot="start">
                  <img src={log.avatar_url || 'https://ionicframework.com/docs/img/demos/avatar.svg'} alt={log.username} />
                </IonAvatar>
                <IonLabel>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <IonText color="dark">
                      <strong>{log.username || 'Unknown User'}</strong>
                    </IonText>
                    <IonChip color={getActionColor(log.action)}>
                      <IonIcon icon={getActionIcon(log.action)} style={{ marginRight: '4px' }} />
                      {formatAction(log.action)}
                    </IonChip>
                  </div>
                  <p style={{ 
                    margin: '4px 0',
                    color: 'var(--ion-color-medium)',
                    fontSize: '0.9em'
                  }}>
                    {log.log_details}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    color: 'var(--ion-color-medium)',
                    fontSize: '0.8em'
                  }}>
                    <IonIcon icon={timeOutline} />
                    <span>{formatTimestamp(log.created_at)}</span>
                  </div>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default LogsContainer; 