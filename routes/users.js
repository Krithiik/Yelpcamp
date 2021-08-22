const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) next(err);
        req.flash("success", `Welcome to Yelpcamp! ${registeredUser.username}`);
        res.redirect("/campgrounds");
      });
    } catch (e) {
      if (e.code == "11000") {
        req.flash("error", "The User with that email already exists");
      } else {
        req.flash("error", e.message);
      }
      res.redirect("register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const redirectUrl = req.session.returnTo || "/campgrounds";
    req.flash("success", `Welcome back! ${req.user.username}`);
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "See you soon !!");
  res.redirect("/campgrounds");
});

module.exports = router;
