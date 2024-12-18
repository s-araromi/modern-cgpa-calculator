// Dynamically inject authentication test script
export function injectAuthTestScript() {
  if (import.meta.env.DEV) {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/src/utils/authTest.ts';
    script.setAttribute('data-auth-test', 'true');
    document.body.appendChild(script);
    
    console.log('🔍 Authentication Test Script Injected');
  }
}
