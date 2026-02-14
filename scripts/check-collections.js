
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

async function checkCollections() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\nCollections in database:');
        collections.forEach(c => console.log(` - ${c.name}`));

        const adminCount = await mongoose.connection.db.collection('admins').countDocuments();
        console.log(`\nDocuments in 'admins' collection: ${adminCount}`);

        if (adminCount > 0) {
            const admin = await mongoose.connection.db.collection('admins').findOne({});
            console.log(`Found admin: ${admin.email} (Role: ${admin.role})`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkCollections();
