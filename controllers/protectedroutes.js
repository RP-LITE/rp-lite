const { requiresAuth } = require('express-openid-connect');
const { router } = require('express');
router.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});