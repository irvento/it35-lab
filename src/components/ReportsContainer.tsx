import { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonAvatar, 
  IonChip, 
  IonButton, 
  IonIcon, 
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonPopover,
  IonSelect,
  IonSelectOption,
  IonAlert
} from '@ionic/react';
import { locationOutline, timeOutline, personOutline, createOutline } from 'ionicons/icons';
import { supabase } from '../utils/supabaseClient';
import { useHistory } from 'react-router-dom';

interface Report {
  post_id: string;
  user_id: number;
  username: string;
  avatar_url: string;
  post_content: string;
  status: string;
  priority: string;
  latitude: number;
  longitude: number;
  post_created_at: string;
  post_updated_at: string;
  photo_url?: string;
}

const ReportsContainer = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [editingStatus, setEditingStatus] = useState<{ postId: string; status: string } | null>(null);
  const history = useHistory();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('post_created_at', { ascending: false });

    if (!error && data) {
      // Sort reports: unresolved first (by priority), then resolved
      const sortedReports = data.sort((a, b) => {
        // If one is resolved and the other isn't, unresolved comes first
        if (a.status === 'resolved' && b.status !== 'resolved') return 1;
        if (a.status !== 'resolved' && b.status === 'resolved') return -1;
        
        // If both are resolved or both are unresolved, sort by priority
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
      });

      setReports(sortedReports);
    }
  };

  const updateStatus = async (postId: string, newStatus: string) => {
    const { data, error } = await supabase
      .from('posts')
      .update({ 
        status: newStatus,
        post_updated_at: new Date().toISOString()
      })
      .match({ post_id: postId })
      .select('*');

    if (!error && data) {
      setReports(reports.map(report => 
        report.post_id === postId ? { ...report, status: newStatus } : report
      ));
      setAlertMessage('Status updated successfully!');
      setIsAlertOpen(true);
    } else {
      setAlertMessage('Failed to update status. Please try again.');
      setIsAlertOpen(true);
    }
    setEditingStatus(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'primary';
      case 'low': return 'success';
      default: return 'medium';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'in_progress': return 'warning';
      case 'pending': return 'danger';
      default: return 'medium';
    }
  };

  const viewLocation = (latitude: number, longitude: number) => {
    history.replace(`/it35-lab/app/map?lat=${latitude}&lng=${longitude}`);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Reports Summary</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow className="ion-text-center ion-padding-bottom" style={{ borderBottom: '1px solid #ddd' }}>
              <IonCol size="2"><strong>Priority</strong></IonCol>
              <IonCol size="2"><strong>Status</strong></IonCol>
              <IonCol size="3"><strong>Reporter</strong></IonCol>
              <IonCol size="3"><strong>Report</strong></IonCol>
              <IonCol size="2"><strong>Actions</strong></IonCol>
            </IonRow>

            {reports.map((report) => (
              <IonRow 
                key={report.post_id} 
                className="ion-align-items-center ion-padding-vertical"
                style={{ 
                  borderBottom: '1px solid #eee',
                  backgroundColor: report.status === 'resolved' ? '#f8f9fa' : 'white'
                }}
              >
                <IonCol size="2">
                  <IonChip color={getPriorityColor(report.priority)}>
                    {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                  </IonChip>
                </IonCol>
                <IonCol size="2">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IonChip color={getStatusColor(report.status)}>
                      {report.status.replace('_', ' ').charAt(0).toUpperCase() + report.status.slice(1)}
                    </IonChip>
                    <IonButton
                      fill="clear"
                      size="small"
                      onClick={() => setEditingStatus({ postId: report.post_id, status: report.status })}
                    >
                      <IonIcon icon={createOutline} />
                    </IonButton>
                  </div>
                </IonCol>
                <IonCol size="3">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IonAvatar style={{ marginRight: '8px', width: '32px', height: '32px' }}>
                      <img src={report.avatar_url} alt={report.username} />
                    </IonAvatar>
                    <IonText>{report.username}</IonText>
                  </div>
                </IonCol>
                <IonCol size="3">
                  <IonText>
                    <p style={{ margin: 0, color: '#333' }}>{report.post_content.substring(0, 50)}...</p>
                    <small style={{ color: '#666' }}>
                      {new Date(report.post_created_at).toLocaleString()}
                    </small>
                  </IonText>
                </IonCol>
                <IonCol size="2">
                  <IonButton
                    fill="clear"
                    size="small"
                    onClick={() => viewLocation(report.latitude, report.longitude)}
                  >
                    <IonIcon icon={locationOutline} />
                  </IonButton>
                </IonCol>
              </IonRow>
            ))}
          </IonGrid>
        </IonCardContent>
      </IonCard>

      <IonPopover
        isOpen={editingStatus !== null}
        onDidDismiss={() => setEditingStatus(null)}
      >
        <IonContent className="ion-padding">
          <IonSelect
            value={editingStatus?.status}
            onIonChange={(e) => {
              if (editingStatus) {
                updateStatus(editingStatus.postId, e.detail.value);
              }
            }}
            interface="popover"
          >
            <IonSelectOption value="pending">Pending</IonSelectOption>
            <IonSelectOption value="in_progress">In Progress</IonSelectOption>
            <IonSelectOption value="resolved">Resolved</IonSelectOption>
          </IonSelect>
        </IonContent>
      </IonPopover>

      <IonAlert
        isOpen={isAlertOpen}
        onDidDismiss={() => setIsAlertOpen(false)}
        header="Status Update"
        message={alertMessage}
        buttons={['OK']}
      />
    </div>
  );
};

export default ReportsContainer;
