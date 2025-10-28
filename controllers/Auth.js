let bcrypt = require('bcrypt')
let User = require('../models/User')

exports.signup = async (req, res) => {
    try {

        let { name, email, password, role } = req.body;

        let existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already Exixt'
            })
        }

        // seccure password
        let hashed_password;
        try {
            // is method se hm password ko hash krte h... isme 2 argument jaynge... 1st is jo password h wo, and 2nd is number of rounds
            hashed_password = await bcrypt.hash(password, 10); // <--  yahan pr stratagy ye bhi ho sakta h.. ki hm 3 se 4 baar try karen... 
            // password ko hash krne ka , fir jaake error message show kare.
        }
        catch (err) {
            return res.status(400).json({
                success: false,
                message: `Error in hasing password`,
            });
        }

        // create entry in db
        let user = await User.create(
            {
                name,
                email,
                password: hashed_password,
                role
            }
        )

        return res.status(200).json({
            success: true,
            message: `User added successfly`
        })
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({
            success: false,
            message: `Error in registering user, try again later`,
        });
    }
    


}