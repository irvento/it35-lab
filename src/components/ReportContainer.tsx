import { useState, useEffect } from 'react';
import { 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent,
  IonButton,
  IonInput,
  IonModal,
  IonAlert,
  IonPopover,
  IonIcon,
  IonLabel,
  IonText
} from '@ionic/react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';
import { pencil, trash } from 'ionicons/icons';

interface Report {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  reported_at: string;
  created_at: string;
  updated_at: string;
}

const ReportContainer: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [popoverState, setPopoverState] = useState<{ open: boolean; event: Event | null; reportId: string | null }>({ open: false, event: null, reportId: null });

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [editingReport, setEditingReport] = useState<Report | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        setUser(authData.user);
      }
    };

    const fetchReports = async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setReports(data as Report[]);
      }
    };

    fetchUser();
    fetchReports();
  }, []);

  const createReport = async () => {
    if (!title || !user) return;

    const { data, error } = await supabase
      .from('reports')
      .insert([
        {
          user_id: user.id,
          title,
          description,
          category,
          status: 'pending',
          reported_at: new Date().toISOString()
        }
      ])
      .select('*');

    if (!error && data) {
      setReports([data[0] as Report, ...reports]);
      setTitle('');
      setDescription('');
      setCategory('');
      setAlertMessage('Report created successfully!');
      setIsAlertOpen(true);
    }
  };

  const deleteReport = async (reportId: string) => {
    const { error } = await supabase
      .from('reports')
      .delete()
      .match({ id: reportId });

    if (!error) {
      setReports(reports.filter(report => report.id !== reportId));
      setAlertMessage('Report deleted successfully!');
      setIsAlertOpen(true);
    }
  };

  const startEditingReport = (report: Report) => {
    setEditingReport(report);
    setTitle(report.title);
    setDescription(report.description);
    setCategory(report.category);
    setIsModalOpen(true);
  };

  const updateReport = async () => {
    if (!editingReport) return;

    const { data, error } = await supabase
      .from('reports')
      .update({
        title,
        description,
        category,
        updated_at: new Date().toISOString()
      })
      .match({ id: editingReport.id })
      .select('*');

    if (!error && data) {
      setReports(reports.map(report => 
        report.id === editingReport.id ? data[0] as Report : report
      ));
      setTitle('');
      setDescription('');
      setCategory('');
      setEditingReport(null);
      setIsModalOpen(false);
      setAlertMessage('Report updated successfully!');
      setIsAlertOpen(true);
    }
  };

  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Create Report</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonInput
                value={title}
                onIonChange={e => setTitle(e.detail.value!)}
                placeholder="Report Title"
                className="ion-margin-bottom"
              />
              <IonInput
                value={description}
                onIonChange={e => setDescription(e.detail.value!)}
                placeholder="Description"
                className="ion-margin-bottom"
              />
              <IonInput
                value={category}
                onIonChange={e => setCategory(e.detail.value!)}
                placeholder="Category"
                className="ion-margin-bottom"
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IonButton onClick={createReport}>Submit Report</IonButton>
              </div>
            </IonCardContent>
          </IonCard>

          {reports.map(report => (
            <IonCard key={report.id} style={{ marginTop: '1rem' }}>
              <IonCardHeader>
                <IonRow>
                  <IonCol>
                    <IonCardTitle>{report.title}</IonCardTitle>
                    <IonText color="medium">
                      {new Date(report.created_at).toLocaleString()}
                    </IonText>
                  </IonCol>
                  <IonCol size="auto">
                    <IonButton
                      fill="clear"
                      onClick={(e) => setPopoverState({ open: true, event: e.nativeEvent, reportId: report.id })}
                    >
                      <IonIcon color="secondary" icon={pencil} />
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonCardHeader>
              <IonCardContent>
                <IonText>
                  <p><strong>Description:</strong> {report.description}</p>
                  <p><strong>Category:</strong> {report.category}</p>
                  <p><strong>Status:</strong> {report.status}</p>
                </IonText>
              </IonCardContent>

              <IonPopover
                isOpen={popoverState.open && popoverState.reportId === report.id}
                event={popoverState.event}
                onDidDismiss={() => setPopoverState({ open: false, event: null, reportId: null })}
              >
                <IonButton
                  fill="clear"
                  onClick={() => {
                    startEditingReport(report);
                    setPopoverState({ open: false, event: null, reportId: null });
                  }}
                >
                  Edit
                </IonButton>
                <IonButton
                  fill="clear"
                  color="danger"
                  onClick={() => {
                    deleteReport(report.id);
                    setPopoverState({ open: false, event: null, reportId: null });
                  }}
                >
                  Delete
                </IonButton>
              </IonPopover>
            </IonCard>
          ))}
        </IonCol>
      </IonRow>

      <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Edit Report</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonInput
              value={title}
              onIonChange={e => setTitle(e.detail.value!)}
              placeholder="Report Title"
              className="ion-margin-bottom"
            />
            <IonInput
              value={description}
              onIonChange={e => setDescription(e.detail.value!)}
              placeholder="Description"
              className="ion-margin-bottom"
            />
            <IonInput
              value={category}
              onIonChange={e => setCategory(e.detail.value!)}
              placeholder="Category"
              className="ion-margin-bottom"
            />
          </IonCardContent>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
            <IonButton onClick={updateReport}>Save Changes</IonButton>
            <IonButton onClick={() => setIsModalOpen(false)}>Cancel</IonButton>
          </div>
        </IonCard>
      </IonModal>

      <IonAlert
        isOpen={isAlertOpen}
        onDidDismiss={() => setIsAlertOpen(false)}
        header="Success"
        message={alertMessage}
        buttons={['OK']}
      />
    </IonGrid>
  );
};

export default ReportContainer;
