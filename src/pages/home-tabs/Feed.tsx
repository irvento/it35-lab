import { 
  IonButtons,
    IonContent, 
    IonHeader, 
    IonMenuButton, 
    IonPage, 
    IonTitle, 
    IonToolbar 
} from '@ionic/react';
import FeedContainer from '../../components/FeedContainer';

const Feed: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Feed</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen style={{ 
        '--padding-top': '0px',
        '--padding-bottom': '0px',
        '--padding-start': '0px',
        '--padding-end': '0px'
      }}>
        <div style={{ padding: '16px' }}>
          <FeedContainer />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Feed;