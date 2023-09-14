const controller = require("../controllers/users");
const router = require("express").Router();
const { registerValidator, loginValidator } = require("../middlewares/user");

router.post("/register", registerValidator, controller.register);
router.post("/login", loginValidator, controller.login);

module.exports = router;
