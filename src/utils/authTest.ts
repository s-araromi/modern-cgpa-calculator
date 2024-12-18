import { supabase } from '../config/supabase';

async function runAuthenticationTest() {
  console.group('🔐 Comprehensive Authentication Test');
  
  try {
    // 1. Check Supabase Client Initialization
    console.log('1. Checking Supabase Client Initialization');
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    console.log('✅ Supabase client initialized successfully');

    // 2. Test Session Retrieval
    console.log('2. Checking Current Session');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session retrieval error:', sessionError);
    } else if (session) {
      console.log('✅ Active session found');
      console.log('User Email:', session.user?.email);
      console.log('Session Expires At:', new Date(session.expires_at! * 1000).toLocaleString());
    } else {
      console.log('ℹ️ No active session');
    }

    // 3. Test Authentication Methods
    console.log('3. Testing Authentication Methods');
    
    // Test Sign Up (with a dummy email)
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'StrongTestPassword123!';
    
    console.log('   a. Sign Up Test');
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword
      });

      if (signUpError) {
        console.error('❌ Sign Up Test Failed:', signUpError);
      } else {
        console.log('✅ Sign Up Test Successful');
        console.log('   Registered User:', signUpData.user?.email);
      }
    } catch (signUpError) {
      console.error('❌ Sign Up Test Failed:', signUpError);
    }

    // 4. Check Authentication Listeners
    console.log('4. Checking Authentication Listeners');
    try {
      const authListener = supabase.auth.onAuthStateChange((event, session) => {
        console.log(`🔔 Auth State Changed: ${event}`);
        console.log('Session Details:', session);
      });
    } catch (authListenerError) {
      console.error('❌ Authentication Listener Test Failed:', authListenerError);
    }

    // 5. Environment and Configuration Check
    console.log('5. Environment Configuration');
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('Anon Key Present:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

  } catch (error) {
    console.error('❌ Authentication Test Failed:', error);
  } finally {
    console.groupEnd();
  }
}

// Expose the test function globally for manual testing
(window as any).runAuthenticationTest = runAuthenticationTest;

// Automatically run the test
runAuthenticationTest();
