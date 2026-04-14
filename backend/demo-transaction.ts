import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './src/db/db';
import Food from './src/models/food.model';
import Like from './src/models/like.model';
import actionService from './src/services/action.service';

dotenv.config();

const runSimulation = async () => {
  try {
    await connectDB();

    console.log('\n======================================');
    console.log('🚀 Starting Transaction Concurrency Test');
    console.log('======================================\n');

    // 0. Clean up any leftover data from previous failed runs
    await Food.deleteMany({ name: 'Transaction Pizza' });

    // 1. Create a dummy food item
    const dummyFood = await Food.create({
      foodPartner: new mongoose.Types.ObjectId(),
      name: 'Transaction Pizza',
      video: 'pizza.mp4',
      videoPublicId: 'pizza123',
      description: 'Testing concurrency',
      price: 15,
      likeCount: 0,
      saveCount: 0,
    });

    const foodId = dummyFood._id.toString();
    console.log(`[Setup] Created dummy food item: ${foodId}`);

    // 2. Generate 50 fake users hitting 'Like' at the exact same millisecond
    const CONCURRENT_USERS = 50;
    console.log(`[Test] ${CONCURRENT_USERS} users simultaneously clicking 'Like'...`);
    
    const userIds = Array.from({ length: CONCURRENT_USERS }).map(
      () => new mongoose.Types.ObjectId().toString()
    );

    // Call the toggleLike service concurrently in a single Promise.all
    const start = Date.now();
    let successCount = 0;
    let conflictCount = 0;

    const promises = userIds.map(async (userId) => {
      try {
        await actionService.toggleLike(userId, foodId);
        successCount++;
      } catch (err: any) {
        if (err.codeName === 'WriteConflict') {
          conflictCount++;
        } else {
          throw err; // Other unforeseen errors
        }
      }
    });

    await Promise.all(promises);
    const end = Date.now();

    console.log(`[Test] Completed all ${CONCURRENT_USERS} requests in ${end - start}ms`);

    // 3. Verify results
    const updatedFood = await Food.findById(foodId);
    const actualLikeCount = await Like.countDocuments({ food: foodId });

    console.log('\n======================================');
    console.log('📊 RESULTS');
    console.log('======================================');
    console.log(`Total Requests Sent         : ${CONCURRENT_USERS}`);
    console.log(`Successfully Committed      : ${successCount}`);
    console.log(`Blocked due to Concurrency  : ${conflictCount} (WriteConflicts caught)`);
    console.log('--------------------------------------');
    console.log(`Expected Like Count         : ${successCount}`);
    console.log(`Actual Food Like Count      : ${updatedFood?.likeCount}`);
    console.log(`Actual Like Documents       : ${actualLikeCount}`);

    if (updatedFood?.likeCount === actualLikeCount && actualLikeCount === successCount) {
      console.log('\n✅ TEST PASSED! Transactions gracefully aborted write-conflicts.');
      console.log('Data is perfectly consistent. No ghost likes!');
    } else {
      console.log('\n❌ TEST FAILED! Race conditions detected.');
    }

    // Cleanup
    await Food.deleteOne({ _id: dummyFood._id });
    await Like.deleteMany({ food: foodId });

  } catch (error) {
    console.error('Simulation Failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

runSimulation();
