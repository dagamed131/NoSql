const express = require('express')
const UserController = require('../controllers/UserController')
const router = express.Router();
router.post('/user/register', UserController.register);
router.post('/user/login', UserController.login);
//router.get('/auth/google', UserController.authGoogle);
module.exports = router