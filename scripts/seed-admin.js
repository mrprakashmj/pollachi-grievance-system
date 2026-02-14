
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

async function seedAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'admin@gmail.com';
        const password = 'admin';
        const name = 'System Administrator';

        // 1. Remove from generic users collection if exists (cleanup)
        const existingGenericUser = await mongoose.connection.db.collection('users').findOne({ email });
        if (existingGenericUser) {
            console.log('Found admin email in generic users collection. Removing...');
            await mongoose.connection.db.collection('users').deleteOne({ email });
            console.log('Removed from users collection.');
        }

        // 2. Add to admins collection
        const passwordHash = await bcrypt.hash(password, 10);
        const existingAdmin = await mongoose.connection.db.collection('admins').findOne({ email });

        if (existingAdmin) {
            console.log('Admin already exists in admins collection. Updating password...');
            await mongoose.connection.db.collection('admins').updateOne(
                { email },
                {
                    $set: {
                        role: 'admin',
                        passwordHash: passwordHash,
                        name: name,
                        updatedAt: new Date()
                    }
                }
            );
            console.log('Admin updated successfully.');
        } else {
            console.log('Creating new admin user in admins collection...');
            await mongoose.connection.db.collection('admins').insertOne({
                name,
                email,
                passwordHash,
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log('Admin created successfully.');
        }

        console.log(`\ncredentials:\nEmail: ${email}\nPassword: ${password}\n`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
