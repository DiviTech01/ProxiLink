import { supabase } from './src/integrations/supabase/client.js';

console.log('🔍 Testing Supabase Connection...\n');

// Test 1: Check environment variables
console.log('📋 Environment Check:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_PUBLISHABLE_KEY:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? '✓ Set' : '❌ Missing');
console.log('');

// Test 2: Test auth connection
async function testAuth() {
  console.log('🔐 Testing Auth Connection...');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('❌ Auth Error:', error.message);
    } else {
      console.log('✓ Auth connection successful');
      console.log('Current session:', data.session ? 'Active' : 'None');
    }
  } catch (err) {
    console.error('❌ Auth Exception:', err.message);
  }
  console.log('');
}

// Test 3: Query profiles table
async function testDatabase() {
  console.log('💾 Testing Database Query...');
  try {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Database Error:', error.message);
    } else {
      console.log('✓ Database query successful');
      console.log('Total profiles in database:', count);
    }

    // Try to fetch actual data
    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id, full_name, phone, created_at')
      .limit(5);
    
    if (fetchError) {
      console.error('❌ Fetch Error:', fetchError.message);
    } else {
      console.log('Sample profiles:', profiles);
    }
  } catch (err) {
    console.error('❌ Database Exception:', err.message);
  }
  console.log('');
}

// Test 4: Check auth.users (via RPC if available)
async function testAuthUsers() {
  console.log('👥 Checking Auth Users...');
  try {
    // This will only work if you have a function to query auth.users
    // For now, just show that we're connected
    console.log('Note: Auth users are in auth.users table (not directly queryable)');
    console.log('You can check this in Supabase Dashboard > Authentication > Users');
  } catch (err) {
    console.error('❌ Exception:', err.message);
  }
  console.log('');
}

// Run all tests
async function runTests() {
  await testAuth();
  await testDatabase();
  await testAuthUsers();
  
  console.log('✅ Connection test complete!');
  console.log('\n📝 Next Steps:');
  console.log('1. Check the test-supabase-connection.html page that opened in your browser');
  console.log('2. Try creating a test account using the form');
  console.log('3. Check Supabase Dashboard > Authentication > Users to see if accounts are there');
  console.log('4. Run the SQL script in supabase/check_and_fix_users.sql to fix missing profiles');
}

runTests().catch(console.error);
