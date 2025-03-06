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
  
  const Dashboard: React.FC = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot='start'>
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Dashboard</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
        <IonGrid>
        <IonRow>
          <IonCol><IonCard>
      <IonCardHeader>
        <IonCardTitle>Card Title</IonCardTitle>
        <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>Here's a small text description for the card content. Nothing more, nothing less.</IonCardContent>
    </IonCard></IonCol>
          <IonCol>2</IonCol>
          <IonCol>3</IonCol>
        </IonRow>
      </IonGrid>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Dashboard;