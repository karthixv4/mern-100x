const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:admin123@100xdevs.lwxtbwk.mongodb.net/100xdevs01?retryWrites=true&w=majority');

// Define schemas
const AdminSchema = new mongoose.Schema({
   username: String,
   password: String
});

const UserSchema = new mongoose.Schema({
   username: String,
   password: String,
   courses: Object
});

const CourseSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    price: Number,
    imageLink: String
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);


module.exports = {
    Admin,
    User,
    Course
}