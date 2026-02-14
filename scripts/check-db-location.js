
const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/pollachi-grievance-system';

async function checkSpecificDB() {
    try {
        await mongoose.connect(uri);
        const count = await mongoose.connection.db.collection('users').countDocuments();
        console.log(`\n\nCHECK RESULT:`);
        console.log(`Database: pollachi-grievance-system`);
        console.log(`Collection: users`);
        console.log(`Document Count: ${count}`);

        if (count > 0) {
            const user = await mongoose.connection.db.collection('users').findOne({});
            console.log(`Sample User: ${user.email}`);
        }
        console.log('--------------------------------------------------\n');

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

checkSpecificDB();
