import cron from 'node-cron';
import { prisma } from '../../lib/prisma';
import { sendEmail } from '../utils/sendEmail';
import { envConfig } from '../../config';

/**
 * Trip Reminder Cron Job
 * Runs every day at 9:00 AM and sends email reminders
 * for itineraries starting in 3 days that haven't been reminded yet.
 */
const sendTripReminders = async () => {
    console.log('[Cron] 🔍 Checking for upcoming trip reminders...');

    try {
        const now = new Date();
        const threeDaysFromNow = new Date(now);
        threeDaysFromNow.setDate(now.getDate() + 3);

        // Set time boundaries for the target day (3 days from now)
        const startOfDay = new Date(threeDaysFromNow);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(threeDaysFromNow);
        endOfDay.setHours(23, 59, 59, 999);

        // Find itineraries starting in 3 days that haven't been reminded
        const upcomingItineraries = await prisma.itinerary.findMany({
            where: {
                startDate: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                reminderSent: false,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                destination: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        if (upcomingItineraries.length === 0) {
            console.log('[Cron] ✅ No upcoming trip reminders to send.');
            return;
        }

        console.log(`[Cron] 📧 Found ${upcomingItineraries.length} trips to remind about.`);

        for (const itinerary of upcomingItineraries) {
            try {
                const daysUntilTrip = Math.ceil(
                    (itinerary.startDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                );

                await sendEmail({
                    to: itinerary.user.email,
                    subject: `✈️ Your trip "${itinerary.title}" is in ${daysUntilTrip} days!`,
                    templateName: 'tripReminder',
                    templateData: {
                        subject: `Trip Reminder - ${itinerary.title}`,
                        userName: itinerary.user.name,
                        itineraryTitle: itinerary.title,
                        destinationName: itinerary.destination.name,
                        startDate: itinerary.startDate!.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        }),
                        totalDays: itinerary.totalDays,
                        budgetEstimate: itinerary.budgetEstimate.toString(),
                        daysUntilTrip,
                        itineraryId: itinerary.id,
                        frontendUrl: envConfig.FRONTEND_URL,
                    },
                });

                // Mark as reminded so we don't send again
                await prisma.itinerary.update({
                    where: { id: itinerary.id },
                    data: { reminderSent: true },
                });

                console.log(`[Cron] ✅ Reminder sent to ${itinerary.user.email} for "${itinerary.title}"`);
            } catch (error) {
                console.error(`[Cron] ❌ Failed to send reminder for itinerary ${itinerary.id}:`, error);
            }
        }
    } catch (error) {
        console.error('[Cron] ❌ Trip reminder cron job failed:', error);
    }
};

export const initCronJobs = () => {
    // Run every day at 9:00 AM
    cron.schedule('0 9 * * *', () => {
        sendTripReminders();
    });

    console.log('[Cron] ⏰ Trip reminder cron job scheduled (daily at 9:00 AM)');
};
