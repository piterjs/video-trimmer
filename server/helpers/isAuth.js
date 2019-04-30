function isAuth (req, res, next) {
  if (req.user) {
    next();
  } else {
    res.status(303).redirect('/auth')
  }
}

module.exports = isAuth;
