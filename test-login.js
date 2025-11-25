import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://usdftdymaiyddgmlaaqm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzZGZ0ZHltYWl5ZGRnbWxhYXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNDUzNzcsImV4cCI6MjA3ODYyMTM3N30.AE_EPYbDNWomWN_3HQLK63MIktlKAKSXo3yNPARBoVs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  console.log('Attempting login with d.itu@alustudent.com...\n');

  // Try different common passwords
  const passwordsToTry = ['password', 'Password123', 'Password123!', 'test123', 'Test123!'];
  
  for (const pwd of passwordsToTry) {
    console.log(`Trying password: ${pwd}`);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'd.itu@alustudent.com',
      password: pwd
    });

    if (error) {
      console.log(`  ❌ Error: ${error.message}\n`);
    } else if (data.user) {
      console.log(`  ✅ SUCCESS! User ID: ${data.user.id}\n`);
      
      // Try to fetch role
      const { data: roles, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id);
      
      console.log('Roles query result:', roles);
      console.log('Roles query error:', roleError);
      return;
    }
  }

  console.log('\n❌ None of the common passwords worked.');
  console.log('\nWhat password did you use when signing up?');
}

testLogin();
