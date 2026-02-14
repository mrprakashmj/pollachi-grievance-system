
const mongoose = require('mongoose');

// We will try to list ALL databases on the local instance
const MONGO_HOST = 'mongodb://localhost:27017';

async function diagnoseDB() {
    try {
        console.log('🔌 Connecting to MongoDB Host...');
        const conn = await mongoose.connect(MONGO_HOST);
        console.log('✅ Connected to MongoDB Host');

        // Use the native admin interface to list databases
        const admin = new mongoose.mongo.Admin(mongoose.connection.db);
        const listDatabasesResult = await admin.listDatabases();

        console.log('\n📊 Available Databases:');
        console.log('=======================');

        for (const db of listDatabasesResult.databases) {
            console.log(`\n📂 Database: ${db.name} (Size: ${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);

            if (['admin', 'config', 'local'].includes(db.name)) {
                console.log('   (System DB - skipping details)');
                continue;
            }

            // Switch to this DB to count collections
            const specificDb = mongoose.connection.useDb(db.name);
            const collections = await specificDb.db.listCollections().toArray();

            if (collections.length === 0) {
                console.log('   (No collections)');
            } else {
                for (const col of collections) {
                    const count = await specificDb.db.collection(col.name).countDocuments();
                    console.log(`   - 📄 Collection: ${col.name.padEnd(20)} | Documents: ${count}`);

                    // If it's the users collection, show a sample
                    if (col.name === 'users' && count > 0) {
                        const sample = await specificDb.db.collection(col.name).findOne({});
                        console.log(`     -> Sample User Email: ${sample.email}`);
                    }
                }
            }
        }
        console.log('\n=======================');
        console.log('Diagnosis Complete.');

    } catch (error) {
        console.error('❌ Error during diagnosis:', error);
    } finally {
        await mongoose.disconnect();
    }
}

diagnoseDB();
