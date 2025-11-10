let express= require('express');

let router = express.Router();

let {login, signup} = require('../controllers/Auth');
let {auth, isAdmin, isStudent} = require('../middleware/auth');


router.post('/login', login);
router.post('/signup', signup);

// testing routes for admin
router.get('/test', auth, (req,res)=> {
    res.json({
        success: true,
        message: 'Welcome Testing the auth route'
    });
});

// yahan hm ek route banaye h... isme phele authentication hoga, isme fir authorization hoga ki student h ya nahi h
router.get('/student', auth,isStudent, (req,res)=> {
    return res.json({
        success: true,
        message: 'Welcome Student'
    });
});


module.exports= router;