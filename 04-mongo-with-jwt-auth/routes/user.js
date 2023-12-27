const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const {User, Course} = require("../db")
const jwt = require("jsonwebtoken")
const jwtPass = "vicky"
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
            password: password
        })
        res.status(201).json({message: 'User created successfully'})
    }
});

router.post('/signin', async(req, res) => {
    const username = req.headers.username;
    const password =  req.headers.password;
    const existingUser = await User.findOne({username: username, password: password})

    if(existingUser){
        const token = jwt.sign({username:username},jwtPass)
        res.status(200).json({token: token});
    }else{
        res.status(403).json({message: 'User does not exist, sign up'})
    }
});

router.get('/courses', async(req, res) => {
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

router.post('/courses/:courseId', userMiddleware, async(req, res) => {
    const courseId = req.params.courseId;
    const purchase = await Course.find({id:courseId})
    console.log("purchase: ",purchase)
    if(purchase.length > 0){
        const token = req.headers.authorization;
        const bearerToken = token.split(' ')[1];
        const user = jwt.decode(bearerToken);
        const updatedUser = await User.findOneAndUpdate(
            { username: user.username },
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