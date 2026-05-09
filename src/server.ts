import app from './app';
import { envConfig } from './config';
import { prisma } from './lib/prisma';
import { initCronJobs } from './app/helpers/cronJobs';

async function main() {
  try {
    // Check database connection
    await prisma.$connect();
    console.log('Database connected successfully');

    app.listen(envConfig.PORT, () => {
      console.log(`Server is running on http://localhost:${envConfig.PORT}`);
    });

    // Start scheduled cron jobs
    initCronJobs();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
