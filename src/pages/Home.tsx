import { 
  IonButton,
    IonButtons,
      IonContent, 
      IonHeader, 
      IonIcon, 
      IonLabel, 
      IonMenuButton, 
      IonPage, 
      IonRouterOutlet, 
      IonTabBar, 
      IonTabButton, 
      IonTabs, 
      IonTitle, 
      IonToolbar 
  } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { bookOutline, mapOutline, star } from 'ionicons/icons';
import { Route, Redirect } from 'react-router';

import Dashboard from './home-tabs/Dashboard';
import Feed from './home-tabs/Feed';
import Maps from './home-tabs/Maps';
  
  const Home: React.FC = () => {

    const tabs = [
      {name:'Dashboard',tab:'dashboard', url: '/it35-lab/app/home/dashboard', icon: star},
      {name:'Feed', tab:'feed',url: '/it35-lab/app/home/feed', icon: bookOutline},
      {name:'Maps', tab:'maps', url: '/it35-lab/app/home/map', icon: mapOutline},
      
    ]
    
    return (
      <IonReactRouter>
        <IonTabs>
          <IonTabBar slot="bottom">

            {tabs.map((item, index) => (
              <IonTabButton key={index} tab={item.tab} href={item.url}>
                <IonIcon icon={item.icon} />
                <IonLabel>{item.name}</IonLabel>
              </IonTabButton>
            ))}
            
          </IonTabBar>
        <IonRouterOutlet>

          <Route exact path="/it35-lab/app/home/dashboard" render={Dashboard} />
          <Route exact path="/it35-lab/app/home/feed" component={Feed} />
          <Route exact path="/it35-lab/app/home/map" render={Maps} />
          

          <Route exact path="/it35-lab/app/home">
            <Redirect to="/it35-lab/app/home/dashboard" />
          </Route>

        </IonRouterOutlet>
        </IonTabs>
      </IonReactRouter>
    );
  };
  
  export default Home;