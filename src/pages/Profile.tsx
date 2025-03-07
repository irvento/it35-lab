import { 
    IonAvatar,
    IonButton,
    IonButtons,
      IonContent, 
      IonHeader, 
      IonIcon, 
      IonItem, 
      IonLabel, 
      IonList, 
      IonMenuButton, 
      IonPage, 
      IonTitle, 
      IonToolbar 
  } from '@ionic/react';
import { pencilOutline, logOutOutline } from 'ionicons/icons';
  
  const Profile: React.FC = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot='start'>
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Profile</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen className="ion-padding">
        <IonAvatar style={{ width: "100px", height: "100px", margin: "0 auto" }}>
          <img src="https://picsum.photos/100" alt="Profile" />
        </IonAvatar>

        <IonList>
          <IonItem>
            <IonLabel>
              <h2>Lester Moe</h2>
              <p>lestermoe@example.com</p>
            </IonLabel>
            <IonButton fill="clear" slot="end">
              <IonIcon icon={pencilOutline} />
            </IonButton>
          </IonItem>

            <IonItem>
                <IonLabel>
                <h2>Change Password</h2>
                <p>***********************</p>
                </IonLabel>
                <IonButton fill="clear" slot="end">
                <IonIcon icon={pencilOutline} />
                </IonButton>
                </IonItem>
        </IonList>

        <IonButton expand="full" color="danger" routerLink="/it35-lab" routerDirection="back">
          <IonIcon icon={logOutOutline} slot="start" />
          Logout
        </IonButton>
      </IonContent>
      </IonPage>
    );
  };
  
  export default Profile;