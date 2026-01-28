const express = require("express");
const router = express.Router();
const controller = require("../controllers/urlController");

router.get("/", controller.renderHome);
router.post("/shorten", controller.createShortUrl);
router.get("/analytics", controller.analytics);
router.get("/analytics/:shortCode", controller.analyticsDetail);
router.get("/:shortCode", controller.redirectUrl);

module.exports = router;
