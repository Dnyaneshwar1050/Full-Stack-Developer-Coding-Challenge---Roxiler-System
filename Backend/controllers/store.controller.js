const { Store, Rating, User, sequelize } = require("../models");
const validators = require("../utils/validators");

exports.listStoresPublic = async (req, res) => {
  try {
    const { name, address, sortBy = "name", order = "asc" } = req.query;
    const where = {};
    if (name) where.name = { [sequelize.Op.iLike]: `%${name}%` };
    if (address) where.address = { [sequelize.Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      order: [[sortBy, order.toUpperCase()]],
    });

    const result = await Promise.all(
      stores.map(async (s) => {
        const avgRow = await Rating.findOne({
          where: { storeId: s.id },
          attributes: [
            [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
          ],
          raw: true,
        });
        const avg = avgRow ? parseFloat(avgRow.avgRating || 0) : null;
        let userRating = null;
        if (req.user) {
          const r = await Rating.findOne({
            where: { storeId: s.id, userId: req.user.id },
          });
          if (r) userRating = r.rating;
        }
        return {
          id: s.id,
          name: s.name,
          address: s.address,
          overallRating: avg,
          userRating,
        };
      }),
    );

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getStoreDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const s = await Store.findByPk(id);
    if (!s) return res.status(404).json({ message: "Store not found" });
    const avgRow = await Rating.findOne({
      where: { storeId: s.id },
      attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avgRating"]],
      raw: true,
    });
    const avg = avgRow ? parseFloat(avgRow.avgRating || 0) : null;
    return res.json({
      id: s.id,
      name: s.name,
      email: s.email,
      address: s.address,
      overallRating: avg,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.ownerDashboard = async (req, res) => {
  try {
    // find store owned by this user
    const store = await Store.findOne({ where: { ownerId: req.user.id } });
    if (!store)
      return res.status(404).json({ message: "No store found for this owner" });

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });
    const avgRow = await Rating.findOne({
      where: { storeId: store.id },
      attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avgRating"]],
      raw: true,
    });
    const avg = avgRow ? parseFloat(avgRow.avgRating || 0) : null;
    return res.json({
      store: { id: store.id, name: store.name, address: store.address },
      averageRating: avg,
      ratings,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
