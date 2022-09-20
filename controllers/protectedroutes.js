const { requiresAuth } = require('express-openid-connect');
const router = require('express').Router();
console.log(router);
router.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

module.exports = router;