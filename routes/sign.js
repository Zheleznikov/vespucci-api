const router = require('express').Router();
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signup', createUser);
router.post('/signin', login);
router.post('/logout', auth, logout);

module.exports = router;