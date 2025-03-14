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

        <IonAvatar style={{margin: 'auto', display: 'flex', alignItems: 'center', marginTop: '50px', marginBottom: '50px', width: '200px', height: '200px'}}>
          <IonIcon 
            icon={cash}
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
            <IonButton onClick={() => setShowModal(true)} expand="full" fill='clear'>
          Register
        </IonButton>
          </IonCol>
          <IonCol>
          <IonButton onClick={() => setShowModal(true)} expand="full" fill='clear'>
          Forgot Password?
        </IonButton>
          </IonCol>
          </IonRow>
        </IonGrid>

        <IonButton onClick={() => doLogin()} expand="full"
          shape='round'>
          Login
        </IonButton>

        

        {/* IonToast for successful registration */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Registration Successful!"
          duration={2000}
        />

        {/* IonModal for registration form */}
        <IonModal isOpen={showModal} onDidDismiss={() => closeModal()}>
          <IonContent className="ion-padding">
            <IonHeader>
              <IonToolbar>
                <IonTitle>Register</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={closeModal}>Close</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonList>
              <IonItem>
                <IonLabel position="floating">Username</IonLabel>
                <IonInput 
                  value={username}
                  onIonChange={(e) => setUsername(e.detail.value!)} 
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput 
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value!)} 
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Password</IonLabel>
                <IonInput 
                  type="password"
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value!)} 
                >
                  <IonInputPasswordToggle slot="end" />
                </IonInput>
              </IonItem>
            </IonList>
            <IonButton expand="full" onClick={doRegister} shape='round'>
              Register
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Login;