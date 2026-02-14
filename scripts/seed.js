const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Database Connection String
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pollachi-grievance-system';

async function seed() {
    console.log('🌱 Seeding Database...');
    console.log(`📡 Connecting to: ${MONGODB_URI}`);

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // --- 1. Define Schemas (Simplified for Seeding) ---
        const userSchema = new mongoose.Schema({
            email: { type: String, required: true, unique: true },
            passwordHash: { type: String, required: true },
            name: { type: String, required: true },
            role: { type: String, default: 'public' },
            phone: String,
            address: String,
            pinCode: String,
        }, { timestamps: true });

        // Explicitly for 'admins' collection
        const adminCollectionSchema = new mongoose.Schema({
            email: { type: String, required: true, unique: true },
            passwordHash: { type: String, required: true },
            name: { type: String, required: true },
            role: { type: String, default: 'admin' },
        }, { timestamps: true });

        const complaintSchema = new mongoose.Schema({
            complaintId: { type: String, required: true, unique: true },
            userId: { type: String, required: true },
            userName: { type: String, required: true },
            title: { type: String, required: true },
            description: { type: String, required: true },
            category: { type: String, required: true }, // department ID
            status: { type: String, default: 'submitted' },
            urgency: { type: String, default: 'low' },
            location: { type: String, required: true },
            department: { type: String },
            timeline: Array,
        }, { timestamps: true });

        const User = mongoose.models.User || mongoose.model('User', userSchema);
        const AdminCollection = mongoose.models.Admin || mongoose.model('Admin', adminCollectionSchema, 'admins');

        // --- 2. Seed Users & Admins ---
        const users = [
            {
                email: 'admin@pollachi.com',
                password: 'admin123',
                name: 'Super Admin',
                role: 'admin',
                phone: '9999999999'
            },
            {
                email: 'priya@gmail.com',
                password: 'user123',
                name: 'Priya Sharma',
                role: 'public',
                phone: '9876543210',
                address: '12 Gandhi Nagar',
                pinCode: '642001'
            },
            {
                email: 'kumar@pollachi.com',
                password: 'user123',
                name: 'Kumar Vel',
                role: 'public',
                phone: '8765432109',
                address: '45 Market Road',
                pinCode: '642002'
            },
            {
                email: 'department@pollachi.com',
                password: 'admin123',
                name: 'Department Head',
                role: 'department_head',
                phone: '9999999999'
            }
        ];

        for (const u of users) {
            // 1. Add to USERS collection (Required for Login)
            const existing = await User.findOne({ email: u.email });
            let userId = existing?._id;

            if (!existing) {
                const passwordHash = await bcrypt.hash(u.password, 10);
                const newUser = await User.create({ ...u, passwordHash });
                userId = newUser._id;
                console.log(`👤 Created User: ${u.email} (${u.role}) in 'users'`);
            } else {
                console.log(`⚠️ User exists in 'users': ${u.email}`);
            }

            // Store ID for complaints
            if (u.email === 'priya@gmail.com') global.priyaId = userId;
            if (u.email === 'kumar@pollachi.com') global.kumarId = userId;

            // 2. Add to ADMINS collection (Only if role is admin)
            if (u.role === 'admin') {
                const existingAdmin = await AdminCollection.findOne({ email: u.email });
                if (!existingAdmin) {
                    const passwordHash = await bcrypt.hash(u.password, 10);
                    await AdminCollection.create({
                        email: u.email,
                        passwordHash,
                        name: u.name,
                        role: 'admin'
                    });
                    console.log(`🛡️ Created Admin: ${u.email} in 'admins' collection`);
                } else {
                    console.log(`⚠️ Admin exists in 'admins': ${u.email}`);
                }
            }
        }

        // --- 3. Seed Complaints ---
        // Helper to get Department Model
        const getComplaintModel = (deptId) => {
            const collectionName = `complaints_${deptId}`;
            if (mongoose.models[`Complaint_${deptId}`]) return mongoose.models[`Complaint_${deptId}`];
            return mongoose.model(`Complaint_${deptId}`, complaintSchema, collectionName);
        };

        const complaints = [
            {
                deptId: 'water_supply',
                data: {
                    complaintId: 'CMP-2026-001',
                    userId: global.priyaId,
                    userName: 'Priya Sharma',
                    title: 'Low Water Pressure',
                    description: 'Water pressure is very low in the morning for the last 3 days.',
                    category: 'water_supply',
                    urgency: 'medium',
                    status: 'submitted',
                    location: 'Gandhi Nagar, Pollachi',
                    department: 'water_supply'
                }
            },
            {
                deptId: 'electricity',
                data: {
                    complaintId: 'CMP-2026-002',
                    userId: global.kumarId,
                    userName: 'Kumar Vel',
                    title: 'Street Light Not Working',
                    description: 'The street light near Market Road junction is flickering.',
                    category: 'electricity',
                    urgency: 'low',
                    status: 'in_progress',
                    location: 'Market Road, Pollachi',
                    department: 'electricity'
                }
            },
            {
                deptId: 'roads',
                data: {
                    complaintId: 'CMP-2026-003',
                    userId: global.priyaId,
                    userName: 'Priya Sharma',
                    title: 'Large Pothole near School',
                    description: 'Dangerous pothole near Govt High School main gate.',
                    category: 'roads',
                    urgency: 'high',
                    status: 'resolved',
                    location: 'Station Road',
                    department: 'roads'
                }
            },
            {
                deptId: 'sanitation',
                data: {
                    complaintId: 'CMP-2026-004',
                    userId: global.kumarId,
                    userName: 'Kumar Vel',
                    title: 'Garbage Dump Overflow',
                    description: 'Garbage bin overflowing for 2 days.',
                    category: 'sanitation',
                    urgency: 'medium',
                    status: 'submitted',
                    location: 'North Street',
                    department: 'sanitation'
                }
            }
        ];

        for (const c of complaints) {
            if (!c.data.userId) continue; // Skip if user creation failed

            const Model = getComplaintModel(c.deptId);
            const existing = await Model.findOne({ complaintId: c.data.complaintId });
            if (!existing) {
                await Model.create(c.data);
                console.log(`📝 Created Complaint: ${c.data.complaintId} in ${c.deptId}`);
            } else {
                console.log(`⚠️ Complaint exists: ${c.data.complaintId}`);
            }
        }

        console.log('🎉 Seeding Complete!');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected');
    }
}

seed();
