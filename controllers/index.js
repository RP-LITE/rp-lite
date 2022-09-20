const router = require('express').Router();
const protectedRoutes = require('./protectedroutes');

router.use('/',protectedRoutes);
module.exports = router;