// Test script to verify dashboard functionality
import { storage } from "./server/storage";

async function testDashboardMethods() {
  console.log("Testing Dashboard Storage Methods...\n");
  
  try {
    // Test with a mock athlete ID
    const athleteId = 1;
    
    // Test getAthleteViewCount
    console.log("1. Testing getAthleteViewCount:");
    const viewCount = await storage.getAthleteViewCount(athleteId);
    console.log(`   View count for athlete ${athleteId}: ${viewCount}`);
    
    // Test getRecentAthleteViews
    console.log("\n2. Testing getRecentAthleteViews:");
    const recentViews = await storage.getRecentAthleteViews(athleteId, 7);
    console.log(`   Recent views (last 7 days): ${recentViews.length} views`);
    
    // Test getAthleteAchievements
    console.log("\n3. Testing getAthleteAchievements:");
    const achievements = await storage.getAthleteAchievements(athleteId);
    console.log(`   Achievements: ${achievements.length} unlocked`);
    
    // Test getAthleteStreak
    console.log("\n4. Testing getAthleteStreak:");
    const streak = await storage.getAthleteStreak(athleteId);
    console.log(`   Current streak: ${streak} days`);
    
    // Test getAthletePercentile
    console.log("\n5. Testing getAthletePercentile:");
    const percentile = await storage.getAthletePercentile(athleteId);
    console.log(`   Percentile ranking: ${percentile}%`);
    
    console.log("\n✅ All tests completed successfully!");
  } catch (error) {
    console.error("\n❌ Error during testing:", error);
  }
}

// Run the test
testDashboardMethods().then(() => process.exit(0));