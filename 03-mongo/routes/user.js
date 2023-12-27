const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const {User, Course} = require("../db")
// User Routes
router.post('/signup', async(req, res) => {
    const username = req.headers.username;
    const password =  req.headers.password;

    const existingUser = await User.findOne({username: username})
    if(existingUser){
        res.status(400).json({
            message: "An User already exists with above username"
        })
    }else{
        User.create({
            username: username,
            password: password,
        })
        res.status(201).json({message: 'User created successfully'})
    }
});

router.get('/courses', async (req, res) => {
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

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    const courseId = req.params.courseId;
    const purchase = await Course.find({id:courseId})
    if(purchase.length > 0){
        const username = req.headers.username;
        const updatedUser = await User.findOneAndUpdate(
            { username: username },
            {
              $addToSet: {
                courses: { $each: purchase },
              },
            },
            { new: true }
          );
        res.status(200).json(updatedUser);
    }else{
        res.status(400).json({
            message: 'Cannot find course, enter a valid course Id'
        })
    }
    
});

router.get('/purchasedCourses', userMiddleware, async(req, res) => {
    const username = req.headers.username
    const purchased = await User.findOne({username: username})
    res.status(200).json(purchased.courses)
});

module.exports = router