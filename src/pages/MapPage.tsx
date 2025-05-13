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
  import { useLocation } from 'react-router-dom';
  
  const MapPage: React.FC = () => {
    const location = useLocation();
    
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
        <IonContent fullscreen style={{ 
          '--padding-top': '0px', 
          '--padding-bottom': '0px', 
          '--padding-start': '0px', 
          '--padding-end': '0px',
          '--background': 'transparent'
        }}>
          <div style={{ 
            height: '100%', 
            width: '100%', 
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Map key={location.search} />
          </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default MapPage;