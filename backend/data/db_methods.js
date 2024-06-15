const { BlockedSeller } = require("./db_init");

// Add a seller to the database
const addSellerToDatabase = async (sellerName, blockedByUuid) => {
  await BlockedSeller.create({ name: sellerName, blocked_by_uuid: blockedByUuid });
  console.log(`Seller ${sellerName} was added to the database.`);
  return true;
};

module.exports = { addSellerToDatabase };
