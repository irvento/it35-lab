import { 
  IonButton,
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
  IonToast,
  IonAvatar,
  IonIcon,
  IonAlert
} from '@ionic/react';
import { cash } from 'ionicons/icons';
import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  const doLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setAlertMessage(error.message);
      setShowAlert(true);
      return;
    }

    setShowToast(true); 
    setTimeout(() => {
      navigation.push('/it35-lab/app', 'forward', 'replace');
    }, 300);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonAvatar style={{margin: 'auto', alignItems: 'center', width: '200px', height: '150px'}}>
          <IonIcon icon={cash} style={{fontSize: '125px', color: 'var(--ion-color-primary)'}} />
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

        <IonButton onClick={doLogin} expand="full" shape="round">
          Login
        </IonButton>

        <IonButton 
          routerLink="/it35-lab/register" 
          onClick={() => setShowModal(true)} 
          expand="full" 
          fill="clear"
        >
          Register
        </IonButton>

        {/* IonToast for success message */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Login successful! Redirecting..."
          duration={1500}
          position="top"
          color="primary"
        />

        {/* IonAlert for error message */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Error"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
