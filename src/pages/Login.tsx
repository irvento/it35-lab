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
import { transgender } from 'ionicons/icons';
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

        <IonAvatar style={{margin: 'auto', display: 'flex', alignItems: 'center', marginTop: '50px', marginBottom: '50px', width: '200px', height: '200px'}}>
          <IonIcon 
            icon={finger-print}
            style={{fontSize: '200px', color: 'var(--ion-color-primary)'}} 
            />
        </IonAvatar>
        
        <IonInput 
        className="ion-margin-bottom"
          label="Username" 
          value={username}
          fill='outline'
          onIonChange={(e) => setUsername(e.detail.value!)}
        />
        <IonInput 
        className="ion-margin-bottom"
          type="password" 
          label="Password" 
          value={password}
          fill='outline'

          onIonChange={(e) => setPassword(e.detail.value!)}
        >
          <IonInputPasswordToggle slot="end" />
        </IonInput>

        <IonGrid> 
          <IonRow>
          <IonCol>
            <IonButton expand="full" fill='clear'>
          Register
        </IonButton>
          </IonCol>
          <IonCol>
          <IonButton expand="full" fill='clear'>
          Forgot Password?
        </IonButton>
          </IonCol>
          </IonRow>
        </IonGrid>

        <IonButton onClick={() => doLogin()} expand="full"
          shape='round'>
          Login
        </IonButton>

        

      </IonContent>
    </IonPage>
  );
};

export default Login;