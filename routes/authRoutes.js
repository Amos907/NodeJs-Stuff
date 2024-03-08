const { Router } = require("express");
const authController = require("../controllers/authController");

const router = Router();

router.get("/auth/register", authController.register_get);

router.post("/auth/register", authController.register_post);

router.get("/auth/login", authController.login_get);

router.post("/auth/login", authController.login_post);

module.exports = router;
