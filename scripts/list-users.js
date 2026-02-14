
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/pollachi_grievance_system';

async function listUsers() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const users = await mongoose.connection.db.collection('users').find({}).toArray();

        console.log(`Found ${users.length} users:`);
        users.forEach(user => {
            console.log('------------------------------------------------');
            console.log(`ID:       ${user._id}`);
            console.log(`Name:     ${user.name}`);
            console.log(`Email:    ${user.email}`);
            console.log(`Role:     ${user.role}`);
            console.log(`HasPass:  ${!!user.passwordHash}`);
        });
        console.log('------------------------------------------------');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

listUsers();
