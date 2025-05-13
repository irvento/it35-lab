import { 
    IonButtons,
    IonContent, 
    IonHeader, 
    IonMenuButton, 
    IonPage, 
    IonTitle, 
    IonToolbar 
} from '@ionic/react';
import DashboardContainer from '../../components/DashboardContainer';

const Dashboard: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen style={{ 
        '--background': '#f4f5f8'
      }}>
        <div style={{ 
          padding: '16px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          <DashboardContainer />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;