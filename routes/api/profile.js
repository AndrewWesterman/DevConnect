const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id,
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'No profile for active user' }] });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

// @route   POST api/profile
// @desc    Create profile for user
// @access  Private
router.post(
    '/',
    [
        auth,
        [
            check('status', 'Status cannot be empty').notEmpty(),
            check('skills', 'Skills cannot be empty').notEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
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
            linkedin,
        } = req.body;

        // Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        profileFields.skills = skills.split(',').map((skill) => skill.trim());

        // Build social object
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (facebook) profileFields.social.facebook = facebook;
        if (twitter) profileFields.social.twitter = twitter;
        if (instagram) profileFields.social.instagram = instagram;
        if (linkedin) profileFields.social.linkedin = linkedin;

        try {
            let profile = await Profile.findOne({ user: req.user.id });

            // Update
            if (profile) {
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );

                return res.json(profile);
            }
            // Create
            else {
                profile = new Profile(profileFields);
                await profile.save();
                return res.json(profile);
            }
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
    }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', [
            'name',
            'avatar',
        ]);
        return res.json(profiles);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

// @route   GET api/profile/user/:id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id,
        }).populate('user', ['name', 'avatar']);

        if (!profile)
            return res
                .status(400)
                .json({ errors: [{ msg: 'Profile not found' }] });

        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Profile not found' }] });
        }
        return res.status(500).send('Server Error');
    }
});

// @route   DELETE api/profile
// @desc    Delete the profile, user, and posts
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        // @TODO: Remove users posts

        // Remove Profile
        await Profile.findOneAndDelete({ user: req.user.id });

        // Remove User
        await User.findOneAndDelete({ _id: req.user.id });

        return res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put(
    '/experience',
    [
        auth,
        [
            check('title', 'Title is required').notEmpty(),
            check('company', 'Company is required').notEmpty(),
            check('from', 'From date is required').notEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.experience.unshift(newExp);
            await profile.save();

            return res.json(profile);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
    }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete profile experience with id
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Remove the experience with matching id
        profile.experience = profile.experience.filter(
            (e) => e.id !== req.params.exp_id
        );
        await profile.save();

        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put(
    '/education',
    [
        auth,
        [
            check('school', 'School is required').notEmpty(),
            check('degree', 'Degree is required').notEmpty(),
            check('fieldofstudy', 'Field of study is required').notEmpty(),
            check('from', 'From date is required').notEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.education.unshift(newEdu);
            await profile.save();

            return res.json(profile);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
    }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete profile education with id
// @access  Private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Remove the education with matching id
        profile.education = profile.education.filter(
            (e) => e.id !== req.params.edu_id
        );
        await profile.save();

        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

// @route   DELETE api/profile/github/:username
// @desc    Get user repos from GitHub
// @access  Public
router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${
                req.params.username
            }/repos?per_page=5&sort=created:desc&client_id=${config.get(
                'githubClientId'
            )}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' },
        };

        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No Github profile found' });
            }

            return res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

module.exports = router;
