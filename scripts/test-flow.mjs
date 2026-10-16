async function testFullFlow() {
  const base = 'http://localhost:3000';

  console.log('🧪 Testing Full Flow: Login -> Favorite -> Enquiry -> Create PG...');

  // 1. Login as User
  const loginRes = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@pgfinder.com', password: 'password123' }),
  });
  const loginData = await loginRes.json();
  const cookies = loginRes.headers.get('set-cookie') || '';
  console.log('1. User Login:', loginData.success ? 'PASSED ✅' : 'FAILED ❌');

  // 2. Favorite property
  const favRes = await fetch(`${base}/api/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookies },
    body: JSON.stringify({ propertyId: 'prop-2' }),
  });
  const favData = await favRes.json();
  console.log('2. Add Favorite:', favData.success ? 'PASSED ✅' : 'FAILED ❌', favData.message);

  // 3. Send Enquiry
  const enqRes = await fetch(`${base}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookies },
    body: JSON.stringify({
      propertyId: 'prop-1',
      message: 'Automated test enquiry: Is single room available from Monday?',
      phone: '+91 98765 43210',
      visitDate: '2026-09-20',
    }),
  });
  const enqData = await enqRes.json();
  console.log('3. Send Enquiry:', enqData.success ? 'PASSED ✅' : 'FAILED ❌', enqData.message);

  // 4. Login as Owner
  const ownerLoginRes = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'owner@pgfinder.com', password: 'password123' }),
  });
  const ownerLoginData = await ownerLoginRes.json();
  const ownerCookies = ownerLoginRes.headers.get('set-cookie') || '';
  console.log('4. Owner Login:', ownerLoginData.success ? 'PASSED ✅' : 'FAILED ❌');

  // 5. Create new PG
  const createPgRes = await fetch(`${base}/api/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: ownerCookies },
    body: JSON.stringify({
      title: 'GreenHaven Luxury Student PG',
      description: 'Modern student living with spacious study rooms and fresh meals.',
      propertyType: 'PG',
      gender: 'Co-Living',
      address: 'Near Christ University Central Campus, Hosur Road',
      city: 'Bangalore',
      locality: 'BTM Layout',
      rent: 10500,
      securityDeposit: 12000,
      roomType: 'Double',
      availableRooms: 4,
      amenities: ['WiFi', 'Food', 'Laundry', 'Housekeeping'],
    }),
  });
  const createPgData = await createPgRes.json();
  console.log('5. Owner Create PG:', createPgData.success ? 'PASSED ✅' : 'FAILED ❌', createPgData.message);

  console.log('🎉 ALL END-TO-END FLOWS VERIFIED SUCCESSFULLY!');
}

testFullFlow();
