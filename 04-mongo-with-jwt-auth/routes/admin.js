const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const {Admin, Course} = require("../db")
const jwt = require("jsonwebtoken")
const jwtPass = "vicky"
// Admin Routes
router.post('/signup', async (req, res) => {
    const username = req.headers.username;
    const password =  req.headers.password;

    const existingAdmin = await Admin.findOne({username: username})

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

router.post('/signin', async(req, res) => {
    const username = req.headers.username;
    const password =  req.headers.password;
    const existingAdmin = await Admin.findOne({username: username, password: password})

    if(existingAdmin){
        const token = jwt.sign({username:username},jwtPass)
        res.status(200).json({token: token});
    }else{
        res.status(403).json({message: 'Admin does not exist, sign up'})
    }
});

router.post('/courses', adminMiddleware, async(req, res) => {
    const  title = req.body.title;
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

router.get('/courses', adminMiddleware, async (req, res) => {
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