const express = require('express');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const router = express.Router();
const { check, validationResult } = require('express-validator')

const User = require('../../dbmodels/User')

//@route POST api/users
//@desc Register user
//@access public
router.post('/', [
    check('name', 'Name is required')
    .not()
    .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with atleast 6 charackters').isLength({
        min: 6
    })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    const {
        name,
        email,
        password
    } = req.body
    try {
        //see if the user exists
        let user = await User.findOne({
            email
        })
        if (user) {
            return res.status(400).json({
                errors: [{
                    msg: 'User already exists'
                }]
            });
        }
        //get users gravatar

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            name,
            email,
            password,
            avatar
        });

        //encrypt password bcrypt
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save()

        //Return jwt
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload,
            process.env.JWT_SECRET, {
                expiresIn: 360000
            },
            (err, token) => {
                if (err) throw err;
              res.json({
                    token
                })
            });
      
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

module.exports = router;