import { 
    IonButtons,
      IonCard,
      IonCardContent,
      IonCardHeader,
      IonCardSubtitle,
      IonCardTitle,
      IonCol,
      IonContent, 
      IonGrid, 
      IonHeader, 
      IonMenuButton, 
      IonPage, 
      IonRow, 
      IonTitle, 
      IonToolbar 
  } from '@ionic/react';
import { h } from 'ionicons/dist/types/stencil-public-runtime';
  
  const Dashboard: React.FC = () => {
    return (
      <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot='start'>
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCard color="tertiary" style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', height: '100%' }}>
                <IonCardHeader style={{ textAlign: 'center', padding: '70px' }}>
                  <IonCardTitle>REPORT A CRIME</IonCardTitle>
                </IonCardHeader>
        
              </IonCard>
            </IonCol>

            <IonCol>
              <IonGrid>
                <IonRow>

                  <IonCol>
                    <IonCard color="success" style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                      <IonCardHeader>
                        <IonCardTitle>Crimes</IonCardTitle>
                        <IonCardSubtitle></IonCardSubtitle>
                      </IonCardHeader>
                      <IonCardContent>
                        Stay safe.
                      </IonCardContent>
                    </IonCard>
                  </IonCol>

                  <IonCol>
                    <IonCard color="warning" style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                      <IonCardHeader>
                        <IonCardTitle>Notifications</IonCardTitle>
                        <IonCardSubtitle>Latest Updates</IonCardSubtitle>
                      </IonCardHeader>
                      <IonCardContent>
                        Get notified about important changes and news.
                      </IonCardContent>
                    </IonCard>
                  </IonCol>

                </IonRow>
              </IonGrid>
            </IonCol>
            
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCard color="danger" style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', height: '100%' }}>
                <IonCardHeader style={{ textAlign: 'center', padding: '70px' }}>
                  <IonCardTitle>EMERGENCY HOTLINES</IonCardTitle>
                </IonCardHeader>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
    );
  };
  
  export default Dashboard;