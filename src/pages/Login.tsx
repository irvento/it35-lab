import { 
  IonButton,
  IonButtons,
  IonContent, 
  IonHeader, 
  IonMenuButton, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  useIonRouter,
  IonInput, 
  IonInputPasswordToggle, 
  IonModal, 
  IonItem, 
  IonLabel, 
  IonText, 
  IonList, 
  IonToast,
  IonGrid,
  IonCol,
  IonRow,
  IonAvatar,
  IonIcon
} from '@ionic/react';
import { cash } from 'ionicons/icons';
import React, { useState } from 'react';

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const doLogin = () => {
    navigation.push('/it35-lab/app', 'forward', 'replace');
  }

  const doRegister = () => {
    // You can add your registration logic here
    setShowToast(true); // Just a placeholder for successful registration
  }

  const closeModal = () => {
    setShowModal(false);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>

        <IonAvatar style={{margin: 'auto', alignItems: 'center', width: '200px', height: '150px'}}>
          <IonIcon 
            icon={cash}
            style={{fontSize: '125px', color: 'var(--ion-color-primary)'}} 
            />
        </IonAvatar>
        
        <IonInput 
        className="ion-margin-bottom"
        label="Email" 
        labelPlacement="floating" 
        fill="outline"
        type="email"
        placeholder="Enter Email"
        value={email}
        onIonChange={e => setEmail(e.detail.value!)}
        />
        <IonInput 
        className="ion-margin-bottom"
        fill="outline"
        type="password"
        placeholder="Password"
        value={password}
        onIonChange={e => setPassword(e.detail.value!)}
        >
          <IonInputPasswordToggle slot="end" />
        </IonInput>



        <IonButton onClick={() => doLogin()} expand="full"
          shape='round'>
          Login
        </IonButton>

        <IonButton  routerLink="/it35-lab/register" onClick={() => setShowModal(true)} expand="full" fill='clear'>
          Register
        </IonButton>

      </IonContent>
    </IonPage>
  );
};

export default Login;