import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://usdftdymaiyddgmlaaqm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzZGZ0ZHltYWl5ZGRnbWxhYXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNDUzNzcsImV4cCI6MjA3ODYyMTM3N30.AE_EPYbDNWomWN_3HQLK63MIktlKAKSXo3yNPARBoVs';

const supabase = createClient(supabaseUrl, supabaseKey);

const userId = '3a63cdd3-7d40-4a85-b223-af0feeb6e9d3';
const email = 'divineokonitu01@gmail.com';

async function fixUser() {
  // Insert profile
  const { data: profile, error: pError } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      full_name: 'Divine Okonitu',
      phone: '1234567890'
    })
    .select();

  console.log('Profile created:', profile);
  console.log('Profile error:', pError);

  // Insert admin role
  const { data: role, error: rError } = await supabase
    .from('user_roles')
    .insert({
      user_id: userId,
      role: 'admin'
    })
    .select();

  console.log('Role created:', role);
  console.log('Role error:', rError);

  console.log('\nNow try logging in at http://localhost:8080/login');
  console.log('Email: divineokonitu01@gmail.com');
  console.log('Password: (whatever you used when signing up)');
}

fixUser();
