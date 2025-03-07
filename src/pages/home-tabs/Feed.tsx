import React, { useState } from 'react';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/react';

const Feed: React.FC = () => {
  const posts = [
    { id: 1, user: 'Lawrence', content: 'Had a great day hiking today!', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, user: 'Acer', content: 'Just tried the best pizza ever!', avatar: 'https://scontent.fcgy1-3.fna.fbcdn.net/v/t39.30808-1/472908317_1942152872943037_6454809370600299567_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=101&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeGbFjGNoab4g_WdMy4BdTEnIe7711lYOosh7vvXWVg6i7nzj5_i2fsdi-zYP-UDOAMxv9TbzSqR39Vwf2cQKmqm&_nc_ohc=ATZFAcU0lKQQ7kNvgGzkJfn&_nc_oc=AdhPb0a__XTJBXZNq_-71pmCYkhkPdKATKgY2a2ukurgElLSGoi1olt5bbZi6RZ5LQc&_nc_zt=24&_nc_ht=scontent.fcgy1-3.fna&_nc_gid=ARV5HjiTxTnrST5UGpCYCfD&oh=00_AYEC5DhIazdkjJsh8DuPZSta3A6qa3Ghk5qMJM1C0TD1tg&oe=67D0D8E2' },
    { id: 3, user: 'maJ', content: 'Loving the Ionic framework!', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: 4, user: 'Joas', content: 'Just got a new puppy!', avatar: 'https://scontent.fcgy1-3.fna.fbcdn.net/v/t39.30808-1/464378467_512242568478472_6334836110421207698_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=101&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeHHdJX6vD8Hv40shYjUX2N2TpTcAARVRZVOlNwABFVFlZvglKJHEPMI7ns_qeOhjGMowU1cASMlerVKLg49-Ah5&_nc_ohc=16FVzH8KVN0Q7kNvgGItyu3&_nc_oc=AdjsG-aSH6sUuiJXYJlJ3wL3VfKouKRpel3CbngSyUDURMrxBr5E0hPqgkwD9qIbLeI&_nc_zt=24&_nc_ht=scontent.fcgy1-3.fna&_nc_gid=AS0jtHa1Q7wb1ERNtic5uCA&oh=00_AYGgu4JpGKi5pffbmKkWk1-WLRmCeFdXFnajo1ELCTfYag&oe=67D0B3DE' },
];

return (
    <IonPage>
        <IonHeader>
        <IonToolbar color="primary">

                <IonTitle>Feed</IonTitle>
            </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
            <IonList>
                {posts.map(post => (
                    <IonItem key={post.id}>
                        <IonAvatar slot="start">
                            <img src={post.avatar} alt={`${post.user}'s avatar`} />
                        </IonAvatar>
                        <IonLabel>
                            <h2>{post.user}</h2>
                            <p>{post.content}</p>
                        </IonLabel>
                    </IonItem>
                ))}
            </IonList>
        </IonContent>

    </IonPage>
);

};

export default Feed;