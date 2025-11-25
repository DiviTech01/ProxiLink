// Quick test to verify Supabase connection
const SUPABASE_URL = 'https://nuqzhlzhtzjfzpqgcogd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cXpobHpodHpqZnpwcWdjb2dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDE1MTksImV4cCI6MjA3ODAxNzUxOX0.8vD-gieU8RzALX9Mle8F-K56Fl_tAP7WUe251hi2oEw';

async function testConnection() {
  console.log('Testing Supabase connection...\n');
  
  // Test 1: Check if URL is accessible
  try {
    const response = await fetch(SUPABASE_URL);
    console.log('✓ Supabase URL is accessible');
    console.log('Status:', response.status);
  } catch (err) {
    console.error('❌ Cannot reach Supabase URL:', err.message);
  }
  
  // Test 2: Try to create an account
  try {
    const signupResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: `test${Date.now()}@test.com`,
        password: 'Test123456',
        data: {
          full_name: 'Test User'
        }
      })
    });
    
    const result = await signupResponse.json();
    console.log('\nSignup Response Status:', signupResponse.status);
    console.log('Signup Response:', JSON.stringify(result, null, 2));
    
    if (signupResponse.status === 200) {
      console.log('✓ Signup works! Check Supabase dashboard now.');
    } else {
      console.log('❌ Signup failed:', result.msg || result.message || 'Unknown error');
    }
  } catch (err) {
    console.error('❌ Signup error:', err.message);
  }
}

testConnection();
