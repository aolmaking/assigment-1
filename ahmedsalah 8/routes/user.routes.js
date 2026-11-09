const express = require("express");
const controller = require("../controllers/user.controller");
const { requireLoggedUser } = require("../middlewares/loggedUser");

const router = express.Router();

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.patch("/:id", requireLoggedUser, controller.updateUser);
router.delete("/", requireLoggedUser, controller.deleteUser);
router.get("/", requireLoggedUser, controller.getUser);

module.exports = router;
