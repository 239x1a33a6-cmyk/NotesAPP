const express = require("express");
const router = express.Router();
const {handleUserRegistration,
     handleUserLogin,
     handleLogout
} = require("../controllers/user");

router.post("/register", handleUserRegistration);
router.post("/login", handleUserLogin)
router.post("/logout", handleLogout);
module.exports = router;