import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pgfinder';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: { type: String, select: true },
  role: { type: String, default: 'user' },
  avatar: String,
}, { timestamps: true });

const PropertySchema = new mongoose.Schema({
  title: String,
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  propertyType: String,
  gender: String,
  address: String,
  city: String,
  locality: String,
  rent: Number,
  securityDeposit: Number,
  roomType: String,
  availableRooms: Number,
  amenities: [String],
  images: [String],
  rating: Number,
  reviewsCount: Number,
  isVerified: Boolean,
  status: String,
  houseRules: [String],
  nearbyPlaces: [{ name: String, distance: String }],
  coordinates: { lat: Number, lng: Number },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

async function seed() {
  console.log('🌱 Connecting to MongoDB at:', MONGODB_URI);
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB successfully.');

    // Clear existing
    await User.deleteMany({});
    await Property.deleteMany({});
    console.log('🧹 Cleared old records.');

    // Seed users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminHashedPassword = await bcrypt.hash('adminpassword', 10);

    const userDocs = await User.insertMany([
      {
        name: 'Aarav Sharma',
        email: 'user@pgfinder.com',
        phone: '+91 98765 43210',
        password: hashedPassword,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      },
      {
        name: 'Vikramaditya Rao',
        email: 'owner@pgfinder.com',
        phone: '+91 98112 34567',
        password: hashedPassword,
        role: 'owner',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
      },
      {
        name: 'Priya Mehra',
        email: 'priya.owner@pgfinder.com',
        phone: '+91 97223 88990',
        password: hashedPassword,
        role: 'owner',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      },
      {
        name: 'Super Admin',
        email: 'admin@pgfinder.com',
        phone: '+91 99999 00000',
        password: adminHashedPassword,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      },
    ]);

    const owner1 = userDocs[1]._id;
    const owner2 = userDocs[2]._id;

    // Seed 12 properties
    const propertiesData = [
      {
        title: 'UrbanNest Luxury PG for Gents',
        description: 'Ultra-modern living space designed for tech professionals and students in Koramangala. High-speed 300 Mbps fiber internet, ergonomic study desks, daily nutritious North & South Indian meals, biometric access security, and an open terrace lounge.',
        owner: owner1,
        propertyType: 'PG',
        gender: 'Boys',
        address: '4th Block, 100 Feet Road, Near Sony World Signal',
        city: 'Bangalore',
        locality: 'Koramangala',
        rent: 11500,
        securityDeposit: 15000,
        roomType: 'Single',
        availableRooms: 3,
        amenities: ['WiFi', 'AC', 'Food', 'Laundry', 'Parking', 'CCTV', 'Power Backup', 'Housekeeping', 'Gym'],
        images: [
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
        ],
        rating: 4.8,
        reviewsCount: 34,
        isVerified: true,
        status: 'Active',
      },
      {
        title: 'StaySphere Premium Co-Living',
        description: 'Vibrant co-living community in HSR Layout Sector 2. Fully furnished with modular wardrobes, dedicated gaming zone, soundproof meeting booths for remote work, and community weekend events.',
        owner: owner1,
        propertyType: 'PG',
        gender: 'Co-Living',
        address: 'Sector 2, 27th Main Road, Opposite NIFT College',
        city: 'Bangalore',
        locality: 'HSR Layout',
        rent: 14000,
        securityDeposit: 20000,
        roomType: 'Double',
        availableRooms: 5,
        amenities: ['WiFi', 'AC', 'Food', 'Laundry', 'Parking', 'Gym', 'CCTV', 'Power Backup', 'Housekeeping'],
        images: [
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
        ],
        rating: 4.9,
        reviewsCount: 42,
        isVerified: true,
        status: 'Active',
      },
      {
        title: 'HomeHive Executive Ladies PG',
        description: 'Safe, premium ladies PG situated in DLF Phase 3 near Cyber City Gurgaon. 3-tier female security guards, biometric access, fresh organic 3-course homestyle meals, and free laundry service.',
        owner: owner2,
        propertyType: 'PG',
        gender: 'Girls',
        address: 'U-Block, DLF Phase 3, Near Moulsari Avenue Metro',
        city: 'Gurgaon',
        locality: 'Cyber City',
        rent: 12500,
        securityDeposit: 15000,
        roomType: 'Single',
        availableRooms: 2,
        amenities: ['WiFi', 'AC', 'Food', 'Laundry', 'Parking', 'CCTV', 'Power Backup', 'Housekeeping'],
        images: [
          'https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1000&q=80',
        ],
        rating: 4.7,
        reviewsCount: 29,
        isVerified: true,
        status: 'Active',
      },
      {
        title: 'CampusNest Student Living',
        description: 'Specially crafted for North Campus Delhi University students. Large study halls, library access, nutritious multi-cuisine mess, solar water heating, and high-speed Wi-Fi across all floors.',
        owner: owner1,
        propertyType: 'Hostel',
        gender: 'Boys',
        address: 'Bungalow Road, Kamla Nagar, Near Hansraj College',
        city: 'Delhi',
        locality: 'Kamla Nagar',
        rent: 8500,
        securityDeposit: 10000,
        roomType: 'Double',
        availableRooms: 6,
        amenities: ['WiFi', 'Food', 'Laundry', 'CCTV', 'Power Backup', 'Housekeeping'],
        images: [
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80',
        ],
        rating: 4.6,
        reviewsCount: 19,
        isVerified: true,
        status: 'Active',
      },
      {
        title: 'MetroHomes Studio PG',
        description: 'Designer rooms for young professionals working in Hinjewadi IT Park Phase 1. Features private attached balconies, kitchenette, smart Android LED TVs, and on-demand weekend housekeeping.',
        owner: owner1,
        propertyType: 'PG',
        gender: 'Co-Living',
        address: 'Maan Road, Near Infosys Circle, Hinjewadi Phase 1',
        city: 'Pune',
        locality: 'Hinjewadi',
        rent: 9800,
        securityDeposit: 12000,
        roomType: 'Single',
        availableRooms: 4,
        amenities: ['WiFi', 'AC', 'Food', 'Parking', 'Gym', 'CCTV', 'Power Backup', 'Housekeeping'],
        images: [
          'https://images.unsplash.com/photo-1502005229762-ee1b2da97a06?auto=format&fit=crop&w=1000&q=80',
        ],
        rating: 4.5,
        reviewsCount: 22,
        isVerified: true,
        status: 'Active',
      },
      {
        title: 'CozyCorner Women Residency',
        description: 'Sophisticated women accommodation situated in Viman Nagar near Symbiosis. Includes daily healthy breakfast and dinner, RO purified water on every floor, gym access, and lift facility.',
        owner: owner2,
        propertyType: 'PG',
        gender: 'Girls',
        address: 'Near Symbiosis International School, Viman Nagar',
        city: 'Pune',
        locality: 'Viman Nagar',
        rent: 10500,
        securityDeposit: 15000,
        roomType: 'Double',
        availableRooms: 3,
        amenities: ['WiFi', 'AC', 'Food', 'Laundry', 'Gym', 'CCTV', 'Power Backup', 'Housekeeping'],
        images: [
          'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1000&q=80',
        ],
        rating: 4.8,
        reviewsCount: 31,
        isVerified: true,
        status: 'Active',
      },
      {
        title: 'CyberStay Co-Living Suites',
        description: 'Premium tech-enabled co-living space in Gachibowli Financial District. Coworking desk in each room, high-speed mesh WiFi, weekly movie screenings on the rooftop projector, and cafeteria.',
        owner: owner1,
        propertyType: 'PG',
        gender: 'Co-Living',
        address: 'Telecom Nagar, Gachibowli, Near Bio-Diversity Park',
        city: 'Hyderabad',
        locality: 'Gachibowli',
        rent: 13000,
        securityDeposit: 18000,
        roomType: 'Single',
        availableRooms: 3,
        amenities: ['WiFi', 'AC', 'Food', 'Laundry', 'Parking', 'Gym', 'CCTV', 'Power Backup', 'Housekeeping'],
        images: [
          'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
        ],
        rating: 4.7,
        reviewsCount: 26,
        isVerified: true,
        status: 'Active',
      },
      {
        title: 'Hitec City Comfort PG for Men',
        description: 'Clean, budget-friendly men PG right at Madhapur Metro Station. 3 times buffet meals, washing machines, daily housekeeping, and 24-hour power backup.',
        owner: owner1,
        propertyType: 'PG',
        gender: 'Boys',
        address: 'Plot 45, Ayyappa Society, Madhapur, Near Metro Pillar 18',
        city: 'Hyderabad',
        locality: 'Madhapur',
        rent: 7500,
        securityDeposit: 10000,
        roomType: 'Triple',
        availableRooms: 8,
        amenities: ['WiFi', 'Food', 'Laundry', 'Parking', 'CCTV', 'Power Backup', 'Housekeeping'],
        images: [
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
        ],
        rating: 4.4,
        reviewsCount: 15,
        isVerified: true,
        status: 'Active',
      },
      {
        title: 'Bandra Bayview Boutique Rooms',
        description: 'Chic, premium studio rooms located in Bandra West near Pali Hill. Walking distance to Carter Road promenade, cafes, and creative studios. Features air conditioning, designer bathroom, and high-speed Wi-Fi.',
        owner: owner2,
        propertyType: 'Room',
        gender: 'Co-Living',
        address: 'Pali Naka, Bandra West, Mumbai',
        city: 'Mumbai',
        locality: 'Bandra West',
        rent: 22000,
        securityDeposit: 35000,
        roomType: 'Single',
        availableRooms: 2,
        amenities: ['WiFi', 'AC', 'Laundry', 'CCTV', 'Power Backup', 'Housekeeping'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
        ],
        rating: 4.9,
        reviewsCount: 48,
        isVerified: true,
        status: 'Active',
      },
      {
        title: 'Andheri East Corporate PG',
        description: 'Ideal for professionals working in MIDC, SEEPZ, and BKC connector. Modern air-conditioned double rooms, delicious hot meals, covered bike parking, and reliable power backup.',
        owner: owner1,
        propertyType: 'PG',
        gender: 'Boys',
        address: 'Near Chakala Metro Station, Andheri-Kurla Road',
        city: 'Mumbai',
        locality: 'Andheri East',
        rent: 11000,
        securityDeposit: 15000,
        roomType: 'Double',
        availableRooms: 5,
        amenities: ['WiFi', 'AC', 'Food', 'Laundry', 'Parking', 'CCTV', 'Power Backup', 'Housekeeping'],
        images: [
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
        ],
        rating: 4.5,
        reviewsCount: 18,
        isVerified: true,
        status: 'Active',
      },
      {
        title: 'Noida Sector 62 Smart Stay PG',
        description: 'Walkable from major IT campuses (TCS, Samsung, HCL) and Jaypee Institute. High speed internet, daily hot meals, gaming lounge with table tennis, and dedicated study desks in every room.',
        owner: owner1,
        propertyType: 'PG',
        gender: 'Co-Living',
        address: 'Sector 62, Near Electronic City Metro Station',
        city: 'Noida',
        locality: 'Sector 62',
        rent: 8900,
        securityDeposit: 10000,
        roomType: 'Double',
        availableRooms: 6,
        amenities: ['WiFi', 'AC', 'Food', 'Laundry', 'Parking', 'Gym', 'CCTV', 'Power Backup', 'Housekeeping'],
        images: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
        ],
        rating: 4.6,
        reviewsCount: 24,
        isVerified: true,
        status: 'Active',
      },
      {
        title: 'Saket Elite Women Hostels & PG',
        description: 'Secure, modern girls residence in South Delhi near Select Citywalk Mall and Saket Metro. 24x7 security guard, CCTV cameras, hot geysers, air-conditioner, and nutritious home-style Indian food.',
        owner: owner2,
        propertyType: 'Hostel',
        gender: 'Girls',
        address: 'J-Block, Saket, Opposite Garden of Five Senses Road',
        city: 'Delhi',
        locality: 'Saket',
        rent: 10800,
        securityDeposit: 14000,
        roomType: 'Single',
        availableRooms: 3,
        amenities: ['WiFi', 'AC', 'Food', 'Laundry', 'CCTV', 'Power Backup', 'Housekeeping'],
        images: [
          'https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=1000&q=80',
        ],
        rating: 4.8,
        reviewsCount: 38,
        isVerified: true,
        status: 'Active',
      },
    ];

    await Property.insertMany(propertiesData);
    console.log(`🎉 Successfully seeded ${userDocs.length} users and ${propertiesData.length} properties!`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed script error (If MongoDB is offline, in-memory store handles everything automatically):', err.message);
    process.exit(0);
  }
}

seed();
