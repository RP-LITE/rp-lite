const router = require("express").Router();
// const protectedRoutes = require('./protectedroutes');
const apiRoutes = require("./api");
const homeroutes = require("./homeroutes");
router.use("/", homeroutes);
router.get('/api',(req,res)=>{
  console.log('hit');
  res.send('hit it');
})
router.use("/api/", apiRoutes);

// router.use('/api', apiRoutes)
module.exports = router;
