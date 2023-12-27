const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const {Course} = require("../db")
const {Admin} = require("../db")

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.headers.username;
    const password =  req.headers.password;

    const existingAdmin = await Admin.findOne({username: username})
    console.log(existingAdmin)
    if(existingAdmin){
        res.status(400).json({
            message: "An admin already exists with above username"
        })
    }else{
        Admin.create({
            username: username,
            password: password
        })
        res.status(201).json({message: 'Admin created successfully'})
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
     const title = req.body.title;
     const description = req.body.description;
     const price = req.body.price;
     const imageLink = req.body.imageLink;

     try {
        const count = await Course.countDocuments();

        const newCourse = await Course.create({
            id: count + 1, // Assign id based on the count
            title: title,
            description: description,
            price: price,
            imageLink: imageLink
        });

        res.status(201).json({ message: 'Course created successfully', courseId: count+1 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

router.get('/courses', adminMiddleware, async(req, res) => {
    // Implement fetching all courses logic
    try{
      const allCourses = await Course.find({});
      res.status(200).json(allCourses)
    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "error in fetching courses"
        })
    }
});

module.exports = router;