import { 
    IonButtons,
    IonContent, 
    IonHeader, 
    IonMenuButton, 
    IonPage, 
    IonTitle, 
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonText
} from '@ionic/react';
import { locationOutline, imageOutline, timeOutline, shieldOutline } from 'ionicons/icons';

const About: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>About</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Our Mission</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText>
              <p>
                Our mission is to simplify the reporting process and empower users to make timely, informed decisions through accessible and transparent reporting tools. We believe that clear communication and fast reporting are key to solving problems, improving systems, and making informed decisions.
              </p>
              <p>
                Whether you're reporting incidents, submitting project updates, or managing field data, our platform is designed to streamline your workflow and keep everything organized in one place.
              </p>
            </IonText>
          </IonCardContent>
        </IonCard>

        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader>
                  <IonIcon icon={locationOutline} size="large" color="primary" />
                  <IonCardTitle>Geolocation</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonText>
                    <p>
                      Our integrated geolocation feature ensures faster response times by providing precise location data for each report. This helps teams quickly identify and address issues in the field.
                    </p>
                  </IonText>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader>
                  <IonIcon icon={imageOutline} size="large" color="primary" />
                  <IonCardTitle>Visual Documentation</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonText>
                    <p>
                      Capture and attach images to your reports for clear visual documentation. This feature helps provide concrete evidence and better context for each reported issue.
                    </p>
                  </IonText>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader>
                  <IonIcon icon={timeOutline} size="large" color="primary" />
                  <IonCardTitle>Real-time Updates</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonText>
                    <p>
                      Stay informed with real-time updates and status changes. Our platform ensures that all stakeholders are kept in the loop with the latest information.
                    </p>
                  </IonText>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader>
                  <IonIcon icon={shieldOutline} size="large" color="primary" />
                  <IonCardTitle>Secure & Reliable</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonText>
                    <p>
                      Your data security is our priority. We implement robust security measures to ensure that all reports and sensitive information are protected.
                    </p>
                  </IonText>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Why?</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText>
              <p>
                The platform combines powerful features with user-friendly design to create an efficient reporting system. With integrated geolocation, image uploads, and real-time updates, we provide a comprehensive solution for all your reporting needs.
              </p>
              <p>
                Join us in our mission to make reporting more efficient, transparent, and effective. Together, we can create a better system for managing and responding to reports.
              </p>
            </IonText>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default About;