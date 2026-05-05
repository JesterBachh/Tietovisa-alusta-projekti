module.exports = (req, res, next) => {
  console.log("--- DEBUG ADMIN CHECK ---");
  console.log("Session ID:", req.sessionID);
  console.log("User Object in Session:", req.session.user);

  if (req.session && req.session.user && req.session.user.role === "admin") {
    console.log("ACCESS GRANTED: User is admin");
    next();
  } else {
    console.log("ACCESS DENIED: Redirecting to main");
    if (!req.session.user) console.log("Reason: No user in session");
    else if (req.session.user.role !== "admin")
      console.log("Reason: Role is", req.session.user.role);

    res.redirect("/");
  }
};
