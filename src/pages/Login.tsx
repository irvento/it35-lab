import { 
  IonAlert,
  IonButton,
  IonButtons,
    IonContent, 
    IonHeader, 
    IonIcon, 
    IonInput, 
    IonItem, 
    IonLabel, 
    IonMenuButton, 
    IonPage, 
    IonTitle, 
    IonToolbar, 
    useIonRouter
} from '@ionic/react';
import { lockClosed, personCircle } from 'ionicons/icons';

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const doLogin = () => {
      navigation.push('/it35-lab/app','forward','replace');
  }
  return (
    <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <IonTitle>Login</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      <IonItem>
        <IonLabel position="floating">Username <IonIcon icon={personCircle} slot="start" /></IonLabel>
        <IonInput
        />
      </IonItem>
      <IonItem>
        <IonLabel position="floating">Password <IonIcon icon={lockClosed} slot="start" /></IonLabel>
        <IonInput
          type="password"
        />
      </IonItem>
      <IonButton expand="full" onClick={doLogin} id='login-button'>
        Login
      </IonButton>
      
      <IonAlert
        trigger="login-button'"
        header="logged in!"
        subHeader="A Sub Header Is Optional"
        message="Logged in successfully"
        buttons={['ok']}
      ></IonAlert>

    </IonContent>
    
  </IonPage>
  );
};

export default Login;