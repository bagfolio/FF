// Test script to verify trust pyramid integration

async function testTrustPyramidIntegration() {
  const baseUrl = 'http://localhost:5000';
  
  console.log('🧪 Testing Trust Pyramid Integration...\n');
  
  // Test 1: Check if athlete has skills in database
  console.log('1️⃣ Checking athlete skills...');
  try {
    const athleteRes = await fetch(`${baseUrl}/api/athletes/me`, {
      credentials: 'include'
    });
    const athlete = await athleteRes.json();
    
    console.log('✅ Athlete data:', {
      id: athlete.id,
      name: athlete.fullName,
      hasSkills: !!athlete.skillsAssessment,
      skillsCount: athlete.skillsAssessment ? athlete.skillsAssessment.length : 0
    });
  } catch (error) {
    console.error('❌ Error fetching athlete:', error);
  }
  
  // Test 2: Check dashboard data includes skills
  console.log('\n2️⃣ Checking dashboard data...');
  try {
    const dashboardRes = await fetch(`${baseUrl}/api/dashboard/athlete`, {
      credentials: 'include'
    });
    const dashboard = await dashboardRes.json();
    
    console.log('✅ Dashboard data:', {
      athleteId: dashboard.athlete?.id,
      hasSkills: !!dashboard.athlete?.skillsAssessment,
      profileCompletion: dashboard.stats?.profileCompletion,
      verificationLevel: dashboard.athlete?.verificationLevel
    });
  } catch (error) {
    console.error('❌ Error fetching dashboard:', error);
  }
  
  // Test 3: Simulate skills save and check invalidation
  console.log('\n3️⃣ Testing skills save...');
  try {
    const testSkills = [
      { id: 'speed', name: 'Velocidade', data: { sliderValue: 8, selfRating: 'above_average' } },
      { id: 'strength', name: 'Força', data: { sliderValue: 7, comparison: 'win_most' } },
      { id: 'technique', name: 'Técnica', data: { skills: { ballControl: 4, passing: 5, dribbling: 4 } } },
      { id: 'stamina', name: 'Resistência', data: { duration: '90+', recovery: 'fast' } }
    ];
    
    // Assuming athlete ID 1 for testing
    const saveRes = await fetch(`${baseUrl}/api/athletes/1/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testSkills),
      credentials: 'include'
    });
    
    if (saveRes.ok) {
      console.log('✅ Skills saved successfully');
      
      // Check if skills are returned
      const skillsRes = await fetch(`${baseUrl}/api/athletes/1/skills`, {
        credentials: 'include'
      });
      const skillsData = await skillsRes.json();
      console.log('✅ Skills retrieved:', {
        hasSkills: !!skillsData.skills,
        skillsCount: skillsData.skills ? skillsData.skills.length : 0
      });
    } else {
      console.error('❌ Failed to save skills:', saveRes.status);
    }
  } catch (error) {
    console.error('❌ Error saving skills:', error);
  }
  
  // Test 4: Check trust score calculation
  console.log('\n4️⃣ Checking trust score...');
  try {
    const trustRes = await fetch(`${baseUrl}/api/athletes/1/trust-score`, {
      credentials: 'include'
    });
    const trustData = await trustRes.json();
    
    console.log('✅ Trust score:', {
      overall: trustData.trustScore?.overall,
      level: trustData.trustScore?.level,
      breakdown: trustData.trustScore?.breakdown
    });
  } catch (error) {
    console.error('❌ Error fetching trust score:', error);
  }
  
  console.log('\n✅ Integration test completed!');
}

// Run the test
testTrustPyramidIntegration().catch(console.error);