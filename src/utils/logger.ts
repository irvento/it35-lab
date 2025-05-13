import { supabase } from './supabaseClient';

export const logActivity = async (
  userId: string,
  action: string,
  details: string
) => {
  try {
    const { error } = await supabase
      .from('logs')
      .insert([
        {
          user_id: userId,
          action,
          log_details: details
        }
      ]);

    if (error) {
      console.error('Error logging activity:', error);
    }
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}; 