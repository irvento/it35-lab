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
import { bookOutline, fileTrayFullOutline, flameOutline} from 'ionicons/icons';
import { Route, Redirect } from 'react-router';

import Reports from './home-tabs/Reports';
import Feed from './home-tabs/Feed';
import Dashboard from './home-tabs/Dashboard';
  
  const Home: React.FC = () => {

    const tabs = [
      {name:'Feed', tab:'feed',url: '/it35-lab/app/home/feed', icon: bookOutline},
      {name:'Dashboard', tab:'dashboard', url: '/it35-lab/app/home/dashboard', icon: fileTrayFullOutline},
      {name:'Reports',tab:'reports', url: '/it35-lab/app/home/reports', icon: flameOutline},
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

          <Route exact path="/it35-lab/app/home/feed" component={Feed} />
          <Route exact path="/it35-lab/app/home/dashboard" component={Dashboard} />
          <Route exact path="/it35-lab/app/home/reports" component={Reports} />

          <Route exact path="/it35-lab/app/home">
            <Redirect to="/it35-lab/app/home/feed" />
          </Route>

        </IonRouterOutlet>
        </IonTabs>
      </IonReactRouter>
    );
  };
  
  export default Home;