import { prisma } from "../src/lib/prisma";
import { auth } from "../src/lib/auth";
import { envConfig } from "../src/config";

async function main() {
    console.log('Start seeding admin...');

    const adminEmail = envConfig.ADMIN_EMAIL
    const adminPassword = envConfig.ADMIN_PASSWORD;
    console.log(adminEmail, adminPassword);

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    });

    if (!existingAdmin) {
        try {
            await auth.api.signUpEmail({
                body: {
                    email: adminEmail,
                    password: adminPassword,
                    name: 'System Admin',
                    //@ts-ignore
                    role: 'ADMIN'
                }
            });
            console.log('Admin user created successfully');
        } catch (error) {
            console.error('Failed to create admin:', error);
        }
    } else {
        console.log('Admin user already exists');
    }

    // Ensure the admin's email is always marked as verified
    await prisma.user.update({
        where: { email: adminEmail },
        data: { emailVerified: true }
    });
    console.log('Admin email verified successfully');

    console.log('Admin seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });