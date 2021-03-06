const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
    '/',
    [auth, check('text', 'Text is required').notEmpty()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            });

            const post = await newPost.save();
            return res.json(post);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
    }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        return res.json(posts);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

// @route   GET api/posts/:post_id
// @desc    Get post by id
// @access  Private
router.get('/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        return res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        return res.status(500).send('Server Error');
    }
});

// @route   DELETE api/posts/:post_id
// @desc    Delete post by id
// @access  Private
router.delete('/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        // Check if post exists
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        // Check if user is authorized to delete
        if (post.user.toString() !== req.user.id)
            return res.status(401).json({ msg: 'User not authorized' });

        await post.remove();

        return res.json({ msg: 'Post deleted' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        return res.status(500).send('Server Error');
    }
});

// @route   PUT api/posts/:post_id/like
// @desc    Like a post
// @access  Private
router.put('/:post_id/like', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        // Check is post exists
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        // Check if we have already liked the post
        if (
            post.likes.filter((l) => l.user.toString() === req.user.id)
                .length === 1
        ) {
            return res
                .status(400)
                .json({ msg: 'You cannot like a post more than once' });
        }

        // Add our like to the post
        post.likes.unshift({ user: req.user.id });
        await post.save();

        return res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        return res.status(500).send('Server Error');
    }
});

// @route   PUT api/posts/:post_id/unlike
// @desc    Unlike a post
// @access  Private
router.put('/:post_id/unlike', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        // Check is post exists
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        // Check if we have already liked the post
        if (
            post.likes.filter((l) => l.user.toString() === req.user.id)
                .length === 0
        ) {
            return res
                .status(400)
                .json({ msg: 'You must have liked a post to unlike it' });
        }

        // Remove our like from the post
        post.likes = post.likes.filter((l) => l.user.toString() != req.user.id);
        await post.save();

        return res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        return res.status(500).send('Server Error');
    }
});

// @route   POST api/posts/:post_id/comments
// @desc    Comment on a post
// @access  Private
router.post(
    '/:post_id/comments',
    [auth, check('text', 'Text is required').notEmpty()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');

            let post = await Post.findById(req.params.post_id);
            // Check if post exists
            if (!post) return res.status(404).json({ msg: 'Post not found' });

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            };

            post.comments.push(newComment);

            post = await post.save();
            return res.json(post.comments);
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(404).json({ msg: 'Post not found' });
            }
            return res.status(500).send('Server Error');
        }
    }
);

// @route   POST api/posts/:post_id/comments/:com_id
// @desc    Remove comment on a post
// @access  Private
router.delete('/:post_id/comments/:com_id', auth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.post_id);
        // Check if post exists
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        const comment = post.comments.find((c) => c.id === req.params.com_id);
        // Check if comment id exists
        if (!comment) return res.status(404).json({ msg: 'Comment not found' });
        // Check if user is authorized to delete comment
        if (comment.user.toString() !== req.user.id)
            return res.status(401).json({ msg: 'Not authorized' });

        // Delete the comment
        post.comments = post.comments.filter((c) => c.id !== req.params.com_id);

        post = await post.save();
        return res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        return res.status(500).send('Server Error');
    }
});

module.exports = router;
