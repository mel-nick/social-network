const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator')

const User = require('../../dbmodels/User')

//@route POST api/users
//@desc Register user
//@access public
router.post('/',[
    check('name', 'Name is required')
    .not()
    .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with atleast 6 charackters').isLength({min:6})
],(req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }    
const { name, email, password} = req.body
//see if the user exists

//get users gravatar

//encrypt password bcrypt

//Return jwt

    res.send('User route');
    })

module.exports = router;