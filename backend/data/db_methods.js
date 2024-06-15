const { BlockedSeller } = require("./db_init");

// Get all blocked sellers matching blocked_by_uuid
const getBlockedSellers = async (blockedByUuid) => {
  const blockedSellers = (
    await BlockedSeller.findAll({
      attributes: ["id", "name", "blocked_by_uuid"],
      where: { blocked_by_uuid: blockedByUuid },
    })
  ).map((sellerModel) => sellerModel.dataValues);

  return blockedSellers;
};

// Add a seller to the database
const addSellerToDatabase = async (sellerName, blockedByUuid) => {
  await BlockedSeller.create({ name: sellerName, blocked_by_uuid: blockedByUuid });
  console.log(`Seller ${sellerName} was added to the database.`);
  return true;
};

module.exports = { getBlockedSellers, addSellerToDatabase };
