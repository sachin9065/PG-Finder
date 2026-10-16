async function testEndpoints() {
  const base = 'http://localhost:3000';
  const endpoints = [
    { method: 'GET', url: '/' },
    { method: 'GET', url: '/explore' },
    { method: 'GET', url: '/explore?city=Bangalore&gender=Boys' },
    { method: 'GET', url: '/pg/prop-1' },
    { method: 'GET', url: '/login' },
    { method: 'GET', url: '/register' },
    { method: 'GET', url: '/about' },
    { method: 'GET', url: '/api/properties' },
    { method: 'GET', url: '/api/properties?city=Delhi' },
    { method: 'GET', url: '/api/properties/prop-1' },
    { method: 'GET', url: '/api/reviews?propertyId=prop-1' },
  ];

  console.log('🔍 Testing PGFinder Endpoints...');
  for (const ep of endpoints) {
    try {
      const res = await fetch(`${base}${ep.url}`);
      console.log(`✅ [${res.status}] ${ep.method} ${ep.url}`);
    } catch (e) {
      console.error(`❌ ${ep.method} ${ep.url}:`, e.message);
    }
  }

  // Test Login API
  try {
    const res = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@pgfinder.com', password: 'password123' }),
    });
    const data = await res.json();
    console.log(`✅ [${res.status}] POST /api/auth/login -> User: ${data.user?.name} (${data.user?.role})`);
  } catch (e) {
    console.error('❌ POST /api/auth/login error:', e.message);
  }

  // Test Owner Login API
  try {
    const res = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'owner@pgfinder.com', password: 'password123' }),
    });
    const data = await res.json();
    console.log(`✅ [${res.status}] POST /api/auth/login -> Owner: ${data.user?.name} (${data.user?.role})`);
  } catch (e) {
    console.error('❌ POST /api/auth/login (owner) error:', e.message);
  }
}

testEndpoints();
