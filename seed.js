const mongoose = require('mongoose');
const User = require('./models/user.js');
const Thought = require('./models/thought.js')
const userData = require('./seedData/users.json');
const thoughtData = require('./seedData/thoughts.json')

mongoose.connect('mongodb://localhost:27017/SocialNetwork', { useNewUrlParser: true, useUnifiedTopology: true });


async function seedUsers() {
    try {
        await User.deleteMany(); 
        await User.insertMany(userData); 
        console.log('Users seeded successfully');
    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        mongoose.disconnect(); 
    }
}

async function seedThoughts() {
    try {
        await Thought.deleteMany(); 
        await Thought.insertMany(thoughtData); 
        console.log('Thoughts seeded successfully');
    } catch (error) {
        console.error('Error seeding thoughts:', error);
    } finally {
        mongoose.disconnect(); 
    }
}

seedUsers();
seedThoughts();
