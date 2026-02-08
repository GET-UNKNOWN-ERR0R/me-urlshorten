const Url = require("../models/Url");
const { nanoid } = require("nanoid");
const validUrl = require("valid-url");

exports.renderHome = (req, res) => {
  res.render("home");
};

exports.createShortUrl = async (req, res, next) => {
  try {
    const { originalUrl, customAlias } = req.body;

    if (!validUrl.isUri(originalUrl)) {
      return res.render("home", { error: "Invalid URL" });
    }

    const shortCode = customAlias || nanoid(6);

    const existing = await Url.findOne({ shortCode });
    if (existing) {
      return res.render("home", { error: "Alias already taken" });
    }

    const url = await Url.create({
      originalUrl,
      shortCode,
      sessionId: req.sessionID,
    });

    res.render("success", {
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
    });
  } catch (error) {
    next(error);
  }
};

exports.redirectUrl = async (req, res, next) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });

    if (!url) {
      return res.status(404).render("404");
    }

    url.clicks += 1;
    url.lastAccessed = new Date();
    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    next(error);
  }
};

exports.analytics = async (req, res, next) => {
  try {
    const urls = await Url.find({
      sessionId: req.sessionID,
    }).sort({ createdAt: -1 });

    res.render("analytics", { urls });
  } catch (error) {
    next(error);
  }
};

exports.analyticsDetail = async (req, res, next) => {
  try {
    const url = await Url.findOne({
      shortCode: req.params.shortCode,
      sessionId: req.sessionID,
    });

    if (!url) {
      return res.status(404).render("404");
    }

    res.render("analytics-detail", { url });
  } catch (error) {
    next(error);
  }
};
