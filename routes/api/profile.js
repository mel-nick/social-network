const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const request = require('request')
const config = require('../../dbconfig/database')

const {
    check,
    validationResult
} = require('express-validator')

const Profile = require('../../dbmodels/Profile')
const User = require('../../dbmodels/User')

//@route GET api/profile/me
//@desc get current users profile
//@ccess private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({
                msg: 'There is no profile for such user'
            })
        }
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

//@route POST api/profile
//@desc Create or update user profile
//@ccess private
router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()

]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    //Build profile obj
    const profileFields = {};

    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    //Build social obj
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.youtube = linkedin;

    try {
        let profile = await Profile.findOne({
            user: req.user.id
        });
        if (profile) {
            //Update
            profile = await Profile.findOneAndUpdate({
                user: req.user.id
            }, {
                $set: profileFields
            }, {
                new: true
            });
            return res.json(profile);
        }
        // Create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

})

//@route GET api/profile
//@desc GET all user profiles
//@ccess publick
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

//@route GET api/profile/user/:user_id
//@desc GET profile by user_id
//@ccess publick
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar']);
        if (!profile) return res.status(400).json({
            msg: 'Profile not found'
        });
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind = 'ObjectId') {
            return res.status(400).json({
                msg: 'Profile not found'
            });
        }
        res.status(500).send('Server Error')
    }
})

//@route DELETE api/profile
//@desc Delete profile, user and posts
//@ccess Privat
router.delete('/', auth, async (req, res) => {
    try {
        // remove user's post




        // Remove profile    
        await Profile.findOneAndRemove({
            user: req.user.id
        });
        // Remove user
        await User.findOneAndRemove({
            _id: req.user.id
        });
        res.json({
            msg: ' User deleted '
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

//@route PUT api/profile/experience
//@desc Add profile experience
//@ccess Private
router.put('/experience', [auth, [
    check('title', 'Title required').not().isEmpty(),
    check('company', 'Company required').not().isEmpty(),
    check('from', 'From date required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExperience = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        })
        profile.experience.unshift(newExperience)
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }

});

//@route DELETE api/profile/experience/:exp_id
//@desc Delete profile experience from profile
//@ccess Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        })
        // Get remove index
        const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1)
        await profile.save()
        res.json(profile);
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }

})

//@route PUT api/profile/education
//@desc Add profile education
//@ccess Private
router.put('/education', [auth, [
    check('school', 'School required').not().isEmpty(),
    check('degree', 'Degree required').not().isEmpty(),
    check('fieldofstudy', 'Field of study required').not().isEmpty(),
    check('from', 'From date required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEducation = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        })
        profile.education.unshift(newEducation)
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }

});

//@route DELETE api/profile/education/:edu_id
//@desc Delete profile education from profile
//@ccess Private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        })
        // Get remove index
        const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1)
        await profile.save()
        res.json(profile);
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }

})

//@route GET api/profile/github/:username
//@desc Get user repos from GitHub
//@ccess Public

router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5
            &sort=created:asc
            &client_id=${config.githubClienId}
            &client_secret=${config.githubSecret}`,
            method: 'GET',
            headers: {
                'user-agent': 'node.js'
            }
        }
        request(options, (error, response, body) => {
            if (error) console.error(error)
            if (response.statusCode !== 200) {
               return res.status(404).json({
                    msg: 'No GitHub profile found'
                })
            }
            res.json(JSON.parse(body));
        })
        
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }

})


module.exports = router;


