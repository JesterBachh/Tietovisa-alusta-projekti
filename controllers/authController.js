const resultsController = require("./resultsController");

exports.getProfile = async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");

  try {
    const results = await resultsController.getUserResults(req.session.user.id);

    res.render("auth/profile", {
      user: req.session.user,
      results: results,
      title: "My Profile",
    });
  } catch (error) {
    res.status(500).send("Profile Error");
  }
};
