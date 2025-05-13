import { 
    IonButtons,
      IonContent, 
      IonHeader, 
      IonMenuButton, 
      IonPage, 
      IonTitle, 
      IonToolbar 
  } from '@ionic/react';
import ReportsContainer from '../../components/ReportsContainer';

const Reports: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Reports</IonTitle>
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
          <ReportsContainer />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Reports;