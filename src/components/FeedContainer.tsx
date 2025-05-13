import { useState, useEffect, useRef } from 'react';
import { IonApp, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonInput, IonLabel, IonModal, IonFooter, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonAlert, IonText, IonAvatar, IonCol, IonGrid, IonRow, IonIcon, IonPopover, IonSelect, IonSelectOption, IonList, IonItem, IonChip } from '@ionic/react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';
import { colorFill, pencil, trash, location } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import MapPreview from './MapPreview';

interface Reply {
  id: string;
  comment_id: string;
  user_id: string;
  reply: string;
  created_at: string;
  username?: string;
  avatar_url?: string;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  username?: string;
  avatar_url?: string;
  replies?: Reply[];
}

interface Post {
  post_id: string;
  user_id: number;
  username: string;
  avatar_url: string;
  post_content: string;
  status: string;
  priority: string;
  latitude: number;
  longitude: number;
  post_created_at: string;
  post_updated_at: string;
  photo_url?: string;
  comments?: Comment[];
}

const FeedContainer = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [popoverState, setPopoverState] = useState<{ open: boolean; event: Event | null; postId: string | null }>({ open: false, event: null, postId: null });
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const history = useHistory();
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState('');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [replies, setReplies] = useState<{ [key: string]: Reply[] }>({});
  const [newReply, setNewReply] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [priority, setPriority] = useState<string>('medium');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user?.email?.endsWith('@nbsc.edu.ph')) {
        setUser(authData.user);
        const { data: userData, error } = await supabase
          .from('users')
          .select('user_id, username, user_avatar_url')
          .eq('user_email', authData.user.email)
          .single();
        if (!error && userData) {
          setUser({ ...authData.user, id: userData.user_id });
          setUsername(userData.username);
        }
      }
    };

    const fetchPosts = async () => {
      const { data, error } = await supabase.from('posts').select('*').order('post_created_at', { ascending: false });
      if (!error) setPosts(data as Post[]);
    };

    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      }
    };

    // Subscribe to post updates
    const postsSubscription = supabase
      .channel('posts_changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'posts' 
        }, 
        (payload) => {
          const updatedPost = payload.new as Post;
          setPosts(currentPosts => 
            currentPosts.map(post => 
              post.post_id === updatedPost.post_id ? updatedPost : post
            )
          );
        }
      )
      .subscribe();

    fetchUser();
    fetchPosts();
    getCurrentLocation();

    // Cleanup subscription
    return () => {
      postsSubscription.unsubscribe();
    };
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoPreview(null);
    }
  };

  const createPost = async () => {
    if (!postContent || !user || !username || !currentLocation) return;
  
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('user_avatar_url')
      .eq('user_id', user.id)
      .single();
  
    if (userError) {
      console.error('Error fetching user avatar:', userError);
      return;
    }
  
    const avatarUrl = userData?.user_avatar_url || 'https://ionicframework.com/docs/img/demos/avatar.svg';

    // Photo upload logic
    let photoUrl = null;
    if (photoFile) {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `images/${fileName}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photo-images')
        .upload(filePath, photoFile, {
          cacheControl: '3600',
          upsert: true,
        });
      if (uploadError) {
        setAlertMessage(`Photo upload failed: ${uploadError.message}`);
        setIsAlertOpen(true);
        return;
      }
      const { data: publicUrlData } = supabase.storage.from('photo-images').getPublicUrl(filePath);
      photoUrl = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([
        { 
          post_content: postContent, 
          user_id: user.id, 
          username, 
          avatar_url: avatarUrl,
          photo_url: photoUrl,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          status: 'pending',
          priority: priority
        }
      ])
      .select('*');
  
    if (!error && data) {
      setPosts([data[0] as Post, ...posts]);
      setPostContent('');
      setPhotoFile(null);
      setPhotoPreview(null);
      setPriority('medium');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setAlertMessage('Post created successfully!');
      setIsAlertOpen(true);
    }
  };

  const deletePost = async (post_id: string) => {
    await supabase.from('posts').delete().match({ post_id });
    setPosts(posts.filter(post => post.post_id !== post_id));
    setAlertMessage('Post deleted successfully!');
    setIsAlertOpen(true);
  };

  const startEditingPost = (post: Post) => {
    setEditingPost(post);
    setPostContent(post.post_content);
    setIsModalOpen(true);
  };

  const updatePost = async () => {
    if (!postContent || !editingPost) return;
    const { data, error } = await supabase
      .from('posts')
      .update({ 
        post_content: postContent,
        post_updated_at: new Date().toISOString()
      })
      .match({ post_id: editingPost.post_id })
      .select('*');
    if (!error && data) {
      const updatedPost = data[0] as Post;
      setPosts(posts.map(post => (post.post_id === updatedPost.post_id ? updatedPost : post)));
      setPostContent('');
      setEditingPost(null);
      setIsModalOpen(false);
      setAlertMessage('Post updated successfully!');
      setIsAlertOpen(true);
    }
  };

  const updatePostStatus = async (postId: string, newStatus: string) => {
    const { data, error } = await supabase
      .from('posts')
      .update({ 
        status: newStatus,
        post_updated_at: new Date().toISOString()
      })
      .match({ post_id: postId })
      .select('*');

    if (!error && data) {
      const updatedPost = data[0] as Post;
      setPosts(posts.map(post => (post.post_id === updatedPost.post_id ? updatedPost : post)));
      setAlertMessage('Status updated successfully!');
      setIsAlertOpen(true);
    }
  };

  const viewLocation = (latitude: number, longitude: number) => {
    history.replace(`/it35-lab/app/map?lat=${latitude}&lng=${longitude}`);
  };

  const fetchComments = async (postId: string) => {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        users:user_id (username, user_avatar_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      const formattedComments = data.map(comment => ({
        ...comment,
        username: comment.users?.username,
        avatar_url: comment.users?.user_avatar_url
      }));
      setComments(prev => ({ ...prev, [postId]: formattedComments }));
    }
  };

  const toggleComments = (postId: string) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
      if (!comments[postId]) {
        fetchComments(postId);
      }
    }
  };

  const addComment = async (postId: string) => {
    if (!newComment.trim() || !user) return;

    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          post_id: postId,
          user_id: user.id,
          comment: newComment.trim()
        }
      ])
      .select(`
        *,
        users:user_id (username, user_avatar_url)
      `);

    if (!error && data) {
      const newCommentData = {
        ...data[0],
        username: data[0].users?.username,
        avatar_url: data[0].users?.user_avatar_url
      };
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newCommentData]
      }));
      setNewComment('');
    }
  };

  const fetchReplies = async (commentId: string) => {
    const { data, error } = await supabase
      .from('comment_replies')
      .select(`
        *,
        users:user_id (username, user_avatar_url)
      `)
      .eq('comment_id', commentId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      const formattedReplies = data.map(reply => ({
        ...reply,
        username: reply.users?.username,
        avatar_url: reply.users?.user_avatar_url
      }));
      setReplies(prev => ({ ...prev, [commentId]: formattedReplies }));
    }
  };

  const toggleReplies = (commentId: string) => {
    if (!replies[commentId]) {
      fetchReplies(commentId);
    }
  };

  const addReply = async (commentId: string) => {
    if (!newReply.trim() || !user) return;

    const { data, error } = await supabase
      .from('comment_replies')
      .insert([
        {
          comment_id: commentId,
          user_id: user.id,
          reply: newReply.trim()
        }
      ])
      .select(`
        *,
        users:user_id (username, user_avatar_url)
      `);

    if (!error && data) {
      const newReplyData = {
        ...data[0],
        username: data[0].users?.username,
        avatar_url: data[0].users?.user_avatar_url
      };
      setReplies(prev => ({
        ...prev,
        [commentId]: [...(prev[commentId] || []), newReplyData]
      }));
      setNewReply('');
      setReplyingTo(null);
    }
  };

  return (
    <>
      {user ? (
        <>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Create Report</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonInput 
                value={postContent} 
                onIonChange={e => setPostContent(e.detail.value!)} 
                placeholder="Write a post..." 
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                style={{ marginTop: '10px', marginBottom: '10px' }}
              />
              {photoPreview && (
                <img src={photoPreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, marginBottom: 10 }} />
              )}
              <IonSelect
                value={priority}
                onIonChange={e => setPriority(e.detail.value)}
                placeholder="Select Priority"
                style={{ marginTop: '10px', marginBottom: '10px' }}
              >
                <IonSelectOption value="low">Low Priority</IonSelectOption>
                <IonSelectOption value="medium">Medium Priority</IonSelectOption>
                <IonSelectOption value="high">High Priority</IonSelectOption>
                <IonSelectOption value="urgent">Urgent</IonSelectOption>
              </IonSelect>
              {currentLocation && (
                <IonText color="medium">
                  <p>Location will be included with your post</p>
                </IonText>
              )}
            </IonCardContent>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.5rem' }}>
              <IonButton onClick={createPost}>Post</IonButton>
            </div>
          </IonCard>

          {posts.map(post => (
            <IonCard key={post.post_id} style={{ marginTop: '2rem' }}>
              <IonCardHeader>
                <IonRow>
                  <IonCol size="1.85">
                    <IonAvatar>
                      <img alt={post.username} src={post.avatar_url} />
                    </IonAvatar>
                  </IonCol>
                  <IonCol>
                    <IonCardTitle style={{ marginTop: '10px' }}>{post.username}</IonCardTitle>
                    <IonCardSubtitle>{new Date(post.post_created_at).toLocaleString()}</IonCardSubtitle>
                  </IonCol>
                  <IonCol size="auto">
                    <IonButton
                      fill="clear"
                      onClick={(e) => setPopoverState({ open: true, event: e.nativeEvent, postId: post.post_id })}
                    >
                      <IonIcon color="secondary" icon={pencil} />
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonCardHeader>
            
              <IonCardContent>
                <IonText style={{ color: 'black' }}>
                  <h1>{post.post_content}</h1>
                </IonText>
                {post.photo_url && (
                  <img src={post.photo_url} alt="Post" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, margin: '10px 0' }} />
                )}
                <IonRow>
                  <IonCol>
                    <IonChip color={
                      post.status === 'resolved' ? 'success' :
                      post.status === 'in_progress' ? 'warning' :
                      'danger'
                    }>
                      {post.status.replace('_', ' ').charAt(0).toUpperCase() + post.status.slice(1)}
                    </IonChip>
                  </IonCol>
                  <IonCol>
                    <IonChip color={
                      post.priority === 'urgent' ? 'danger' :
                      post.priority === 'high' ? 'warning' :
                      post.priority === 'medium' ? 'primary' :
                      'success'
                    }>
                      {post.priority.charAt(0).toUpperCase() + post.priority.slice(1)} Priority
                    </IonChip>
                  </IonCol>
                  <IonCol size="auto">
                    <IonButton
                      fill="clear"
                      onClick={() => viewLocation(post.latitude, post.longitude)}
                    >
                      <IonIcon icon={location} />
                      View Location
                    </IonButton>
                  </IonCol>
                </IonRow>
                {post.latitude && post.longitude && (
                  <MapPreview 
                    latitude={post.latitude} 
                    longitude={post.longitude} 
                  />
                )}
                <IonRow>
                  <IonCol>
                    <IonButton
                      fill="clear"
                      onClick={() => toggleComments(post.post_id)}
                    >
                      {comments[post.post_id]?.length || 0} Comments
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonCardContent>
            
              <IonPopover
                isOpen={popoverState.open && popoverState.postId === post.post_id}
                event={popoverState.event}
                onDidDismiss={() => setPopoverState({ open: false, event: null, postId: null })}
              >
                <IonButton fill="clear" onClick={() => { startEditingPost(post); setPopoverState({ open: false, event: null, postId: null }); }}>
                  Edit
                </IonButton>
                <IonButton fill="clear" color="danger" onClick={() => { deletePost(post.post_id); setPopoverState({ open: false, event: null, postId: null }); }}>
                  Delete
                </IonButton>
              </IonPopover>

              {expandedPostId === post.post_id && (
                <div style={{ marginTop: '1rem' }}>
                  <IonList>
                    {comments[post.post_id]?.map(comment => (
                      <div key={comment.id}>
                        <IonItem>
                          <IonAvatar slot="start">
                            <img src={comment.avatar_url || 'https://ionicframework.com/docs/img/demos/avatar.svg'} alt={comment.username} />
                          </IonAvatar>
                          <IonLabel>
                            <h2>{comment.username}</h2>
                            <p>{comment.comment}</p>
                            <p style={{ fontSize: '0.8em', color: 'gray' }}>
                              {new Date(comment.created_at).toLocaleString()}
                            </p>
                            <div style={{ marginTop: '0.5rem' }}>
                              <IonButton
                                fill="clear"
                                size="small"
                                onClick={() => {
                                  setReplyingTo(replyingTo === comment.id ? null : comment.id);
                                  toggleReplies(comment.id);
                                }}
                              >
                                {replies[comment.id]?.length || 0} Replies
                              </IonButton>
                            </div>
                          </IonLabel>
                        </IonItem>

                        {replyingTo === comment.id && (
                          <div style={{ marginLeft: '3rem', marginTop: '0.5rem' }}>
                            <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
                              <IonInput
                                value={newReply}
                                onIonChange={e => setNewReply(e.detail.value!)}
                                placeholder="Write a reply..."
                                style={{ flex: 1, marginRight: '0.5rem' }}
                              />
                              <IonButton onClick={() => addReply(comment.id)}>
                                Reply
                              </IonButton>
                            </div>

                            {replies[comment.id]?.map(reply => (
                              <IonItem key={reply.id} style={{ marginLeft: '1rem' }}>
                                <IonAvatar slot="start">
                                  <img src={reply.avatar_url || 'https://ionicframework.com/docs/img/demos/avatar.svg'} alt={reply.username} />
                                </IonAvatar>
                                <IonLabel>
                                  <h2>{reply.username}</h2>
                                  <p>{reply.reply}</p>
                                  <p style={{ fontSize: '0.8em', color: 'gray' }}>
                                    {new Date(reply.created_at).toLocaleString()}
                                  </p>
                                </IonLabel>
                              </IonItem>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </IonList>

                  <div style={{ display: 'flex', marginTop: '1rem' }}>
                    <IonInput
                      value={newComment}
                      onIonChange={e => setNewComment(e.detail.value!)}
                      placeholder="Write a comment..."
                      style={{ flex: 1, marginRight: '0.5rem' }}
                    />
                    <IonButton onClick={() => addComment(post.post_id)}>
                      Comment
                    </IonButton>
                  </div>
                </div>
              )}
            </IonCard>
          ))}
        </>
      ) : (
        <IonLabel>Loading...</IonLabel>
      )}

      <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Post</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonInput value={postContent} onIonChange={e => setPostContent(e.detail.value!)} placeholder="Edit your post..." />
        </IonContent>
        <IonFooter>
          <IonButton onClick={updatePost}>Save</IonButton>
          <IonButton onClick={() => setIsModalOpen(false)}>Cancel</IonButton>
        </IonFooter>
      </IonModal>

      <IonAlert
        isOpen={isAlertOpen}
        onDidDismiss={() => setIsAlertOpen(false)}
        header="Success"
        message={alertMessage}
        buttons={['OK']}
      />
    </>
  );
};

export default FeedContainer;