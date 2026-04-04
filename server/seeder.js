import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();

        // Create Super Admin
        const superAdmin = await User.create({
            name: 'Super Admin',
            email: 'superadmin@example.com',
            password: 'password123',
            role: 'super_admin'
        });

        // Create Admin
        await User.create({
            name: 'Store Admin',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin'
        });

        // Create User
        await User.create({
            name: 'Regular User',
            email: 'user@example.com',
            password: 'password123',
            role: 'user'
        });

        // Seed some minimalist products
        await Product.insertMany([
            {
                user: superAdmin._id,
                name: 'Minimal Wrist Watch',
                image: '/images/wrist_watch.png',
                brand: 'TIMEPIECE',
                category: 'Accessories',
                description: 'A clean, minimalist wrist watch with a leather strap and steel case. Perfect for daily wear.',
                price: 120.00,
                countInStock: 25,
                rating: 4.8,
                numReviews: 12
            },
            {
                user: superAdmin._id,
                name: 'Leather Portfolio Case',
                image: '/images/leather_portfolio.png',
                brand: 'CRAFT',
                category: 'Leather Goods',
                description: 'Handcrafted leather portfolio for documents and a 13" laptop. Minimalist aesthetic with premium materials.',
                price: 185.00,
                countInStock: 10,
                rating: 4.9,
                numReviews: 8
            },
            {
                user: superAdmin._id,
                name: 'Brushed Aluminum Lamp',
                image: '/images/aluminum_lamp.png',
                brand: 'LUME',
                category: 'Home Decor',
                description: 'Sleek desk lamp with adjustable intensity and a brushed aluminum finish.',
                price: 95.00,
                countInStock: 15,
                rating: 4.2,
                numReviews: 5
            },
            {
                user: superAdmin._id,
                name: 'Ceramic Pour-Over Set',
                image: '/images/ceramic_pourover.png',
                brand: 'BREW',
                category: 'Kitchen',
                description: 'Single-origin coffee tastes better with this artisanal ceramic pour-over set.',
                price: 64.00,
                countInStock: 20,
                rating: 4.7,
                numReviews: 10
            }
        ]);

        console.log('Data Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error seeding data: ${error.message}`);
        process.exit(1);
    }
};

seedData();
