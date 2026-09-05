const { Store, Rating, User } = require('../models');

// Store Owner dashboard metrics and raters list
const getOwnerDashboard = async (ownerId) => {
  const store = await Store.findOne({
    where: { ownerId },
    include: [
      {
        model: Rating,
        include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      },
    ],
  });

  if (!store) {
    const err = new Error('No store found for this owner');
    err.statusCode = 404;
    throw err;
  }

  const ratings = store.Ratings || store.ratings || [];
  const total = ratings.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = ratings.length ? (total / ratings.length).toFixed(2) : null;

  return {
    store: {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
    },
    averageRating,
    raters: ratings.map((r) => ({
      id: r.User ? r.User.id : null,
      userName: r.User ? r.User.name : 'Unknown',
      userEmail: r.User ? r.User.email : 'Unknown',
      rating: r.rating,
      submittedAt: r.createdAt,
    })),
  };
};

module.exports = {
  getOwnerDashboard,
};
