const { Rating, Store, sequelize } = require("../models");
const validators = require("../utils/validators");

exports.submitOrUpdate = async (req, res) => {
  try {
    const storeId = req.params.storeId || req.body.storeId;
    const { rating } = req.body;
    const errs = validators.validateRatingValue(rating);
    if (errs.length) return res.status(400).json({ errors: errs });

    if (!storeId) return res.status(400).json({ message: "Store ID is required" });

    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });

    // upsert: unique constraint on userId+storeId
    let r = await Rating.findOne({ where: { storeId, userId: req.user.id } });
    if (r) {
      r.rating = rating;
      await r.save();
    } else {
      r = await Rating.create({ storeId, userId: req.user.id, rating });
    }

    const avgRow = await Rating.findOne({
      where: { storeId },
      attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avgRating"]],
      raw: true,
    });
    const avg = avgRow ? parseFloat(avgRow.avgRating || 0) : null;
    return res.json({ rating: r.rating, average: avg });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
