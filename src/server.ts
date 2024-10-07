// src/server.ts

import app from './app'; // Import the Express app instance
import { PORT } from './config/environment'; // Import environment variables
import { connectRedis } from './utils/redis';

// Start the Express server
app.listen(PORT, async () => {
  await connectRedis();
  console.log(`Server is running on port ${PORT}`);
});
