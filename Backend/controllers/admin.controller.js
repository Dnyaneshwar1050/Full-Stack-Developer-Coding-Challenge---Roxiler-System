const { User, Store, Rating, sequelize } = require("../models");
const validators = require("../utils/validators");

exports.createUser = async (req, res) => {
  try {
    const payload = req.body;
    const errors = validators.validateSignup(payload);
    if (errors.length) return res.status(400).json({ errors });

    const exists = await User.findOne({ where: { email: payload.email } });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      address: payload.address,
      role: payload.role || "normal",
    });
    return res
      .status(201)
      .json({ id: user.id, email: user.email, role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const errs = [];
    if (!name) errs.push("Name is required");
    if (!email) errs.push("Email is required");
    if (!address) errs.push("Address is required");
    if (errs.length) return res.status(400).json({ errors: errs });

    const store = await Store.create({
      name,
      email,
      address,
      ownerId: ownerId || null,
    });
    return res.status(201).json(store);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.dashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    return res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      role,
      sortBy = "name",
      order = "asc",
    } = req.query;
    const where = {};
    if (name) where.name = { [sequelize.Op.iLike]: `%${name}%` };
    if (email) where.email = { [sequelize.Op.iLike]: `%${email}%` };
    if (address) where.address = { [sequelize.Op.iLike]: `%${address}%` };
    if (role) where.role = role;

    const users = await User.findAll({
      where,
      order: [[sortBy, order.toUpperCase()]],
    });
    return res.json(
      users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        address: u.address,
        role: u.role,
      })),
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.listStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = "name", order = "asc" } = req.query;
    const where = {};
    if (name) where.name = { [sequelize.Op.iLike]: `%${name}%` };
    if (email) where.email = { [sequelize.Op.iLike]: `%${email}%` };
    if (address) where.address = { [sequelize.Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      order: [[sortBy, order.toUpperCase()]],
    });

    // Attach average rating for each store
    const result = await Promise.all(
      stores.map(async (s) => {
        const avg = await Rating.findOne({
          where: { storeId: s.id },
          attributes: [
            [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
          ],
          raw: true,
        });
        return {
          id: s.id,
          name: s.name,
          email: s.email,
          address: s.address,
          averageRating: avg ? parseFloat(avg.avgRating || 0).toFixed(2) : 0,
        };
      }),
    );
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      include: [{ model: Store, as: "store" }, { model: Rating }],
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resp = {
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    };
    if (user.role === "store_owner" && user.store) {
      // compute rating for store
      const avg = await Rating.findOne({
        where: { storeId: user.store.id },
        attributes: [
          [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
        ],
        raw: true,
      });
      resp.storeRating = avg ? parseFloat(avg.avgRating || 0).toFixed(2) : null;
    }
    return res.json(resp);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
