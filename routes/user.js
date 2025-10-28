let express= require('express');

let router = express.Router();

let {login, signup} = require('../controllers/Auth');

// router.post('/login', login);
router.post('/signup', signup);


module.exports= router;