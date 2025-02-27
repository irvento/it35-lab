import { 
    IonButtons,
    IonContent, 
    IonHeader, 
    IonMenuButton, 
    IonPage, 
    IonTitle, 
    IonToolbar 
  } from '@ionic/react';
  import Map from '../components/Map';
  
  const MapPage: React.FC = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot='start'>
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Map</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
    <div style={{ height: '100%', width: '100%' }}>
      <Map />
    </div>
  </IonContent>
      </IonPage>
    );
  };
  
  export default MapPage;