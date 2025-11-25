import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://usdftdymaiyddgmlaaqm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzZGZ0ZHltYWl5ZGRnbWxhYXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNDUzNzcsImV4cCI6MjA3ODYyMTM3N30.AE_EPYbDNWomWN_3HQLK63MIktlKAKSXo3yNPARBoVs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteUser() {
  console.log('Attempting to delete user via admin API...');
  
  // This won't work with anon key, but let's check what users exist
  const { data: signupData } = await supabase.auth.signUp({
    email: 'd.itu@alustudent.com',
    password: 'TestPassword123!'
  });

  if (signupData.user) {
    console.log('User exists with ID:', signupData.user.id);
    console.log('Email confirmed:', signupData.user.email_confirmed_at);
    console.log('\nThe user exists but cannot be deleted with the anon key.');
    console.log('\nYou MUST delete it from Supabase Dashboard:');
    console.log('1. Go to: https://supabase.com/dashboard/project/usdftdymaiyddgmlaaqm/auth/users');
    console.log('2. Look for: d.itu@alustudent.com');
    console.log('3. Click the ... menu → Delete user');
  }
}

deleteUser();
