// src/server.ts

import app from './app'; // Import the Express app instance
import { PORT } from './config/environment'; // Import environment variables

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
