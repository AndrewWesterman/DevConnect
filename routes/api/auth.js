const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route   GET api/auth
// @desc    Get user associated active token
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        return res.json(user);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});

// @route   POST api/auth
// @desc    Authenticate a user and get token
// @access  Public
router.post(
    '/',
    [
        check('email', 'Not a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;

        function returnInvalid() {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid credentials' }] });
        }

        try {
            // See if user exists
            let user = await User.findOne({ email });
            if (!user) return returnInvalid();

            // Check is password is match
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return returnInvalid();

            // Return jwt
            const payload = {
                user: {
                    id: user.id,
                },
            };
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    return res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }
    }
);

module.exports = router;
