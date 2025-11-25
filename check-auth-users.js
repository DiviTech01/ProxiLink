import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://usdftdymaiyddgmlaaqm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzZGZ0ZHltYWl5ZGRnbWxhYXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNDUzNzcsImV4cCI6MjA3ODYyMTM3N30.AE_EPYbDNWomWN_3HQLK63MIktlKAKSXo3yNPARBoVs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  try {
    // Try to get auth users via query (anon key won't work for admin.listUsers)
    // Instead, check if we can query the auth schema directly
    const { data: profiles, error: pError } = await supabase
      .from('profiles')
      .select('*');
    
    console.log('Profiles in database:', profiles);
    console.log('Profile error:', pError);

    const { data: roles, error: rError } = await supabase
      .from('user_roles')
      .select('*');
    
    console.log('\nRoles in database:', roles);
    console.log('Role error:', rError);

    // Try signing up to see what error we get
    console.log('\nAttempting signup with divineokonitu01@gmail.com...');
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: 'divineokonitu01@gmail.com',
      password: 'TempPassword123!',
      options: {
        data: {
          full_name: 'Divine Okonitu',
          phone: '1234567890'
        }
      }
    });

    console.log('Signup response:', signupData);
    console.log('Signup error:', signupError);

  } catch (error) {
    console.error('Error:', error);
  }
}

checkUsers();
