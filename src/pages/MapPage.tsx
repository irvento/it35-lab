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
        <IonContent fullscreen style={{ '--padding-top': '0px', '--padding-bottom': '0px' }}>
          <div style={{ height: '100%', width: '100%', position: 'relative' }}>
            <Map />
          </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default MapPage;