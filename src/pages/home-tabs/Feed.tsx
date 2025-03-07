import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from "@ionic/react";
import { heartOutline } from "ionicons/icons";
import { useState, useEffect } from "react";

const Feed: React.FC = () => {
  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      initializeItems();
      event.detail.complete();
    }, 2000);
  }

  const [items, setItems] = useState<string[]>([]);

  const generateItems = () => {
    const newItems = [];
    for (let i = 0; i < 10; i++) {
      newItems.push(`Post ${1 + items.length + i}`);
    }
    setItems([...items, ...newItems]);
  };

  const initializeItems = () => {
    const newItems = [];
    for (let i = 0; i < 10; i++) {
      newItems.push(`Post ${i + 1}`);
    }
    setItems(newItems);
  };

  useEffect(() => {
    generateItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Social Feed</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonList>
          {items.map((item, index) => (
            <IonCard key={item} color="light" className="ion-padding">
              <IonCardHeader>
                <IonCardTitle>{item}</IonCardTitle>
                <IonCardSubtitle>Posted by User {index + 1}</IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>
                <IonItem lines="none">
                  <IonAvatar slot="start">
                    <img
                      src={"https://picsum.photos/50/50?random=" + index}
                      alt="avatar"
                    />
                  </IonAvatar>
                  <IonLabel>
                    <h2>{item}</h2>
                    <p>Here's a short and engaging description of the post.</p>
                  </IonLabel>
                  <IonButton fill="clear" slot="end">
                    <IonIcon icon={heartOutline} />
                  </IonButton>
                </IonItem>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>

        <IonInfiniteScroll
          onIonInfinite={(event) => {
            generateItems();
            setTimeout(() => event.target.complete(), 500);
          }}
        >
          <IonInfiniteScrollContent
            loadingText="Loading more posts..."
            loadingSpinner="crescent"
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default Feed;
