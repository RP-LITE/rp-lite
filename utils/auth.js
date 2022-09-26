// Protects routes that should be protected
const checkLogin = (req, res, next) => {
  console.log(req.session);
  if (req.session.logged_in) {
      next();
      return;
  }
  res.status(500).json('Not Logged in');
}

module.exports = { checkLogin };