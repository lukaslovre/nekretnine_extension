// Importing required modules
const express = require("express");
const cors = require("cors");
const { getBlockedSellers, addSellerToDatabase } = require("./data/db_methods");

// Creating an instance of express
const app = express();

// Middleware for enabling CORS
app.use(cors());

// Middleware for parsing JSON bodies
app.use(express.json());

app.get("/nekretnine/api", (req, res) => res.send("Hello, world!"));

app.get("/nekretnine/api/blocked-users", async (req, res) => {
  // Get uuid from request query
  const { blockedByUuid, website } = req.query;

  const blockedSellers = await getBlockedSellers(blockedByUuid, website);

  return res.status(200).json({ blockedSellers });
});

app.post("/nekretnine/api/block-user", async (req, res) => {
  console.log("Request body: ", req.body);

  const { sellerName, requestComingFromUuid, website } = req.body;

  // Check for required parameters
  if (!sellerName || !requestComingFromUuid || !website) {
    return res.status(400).json({ error: "Missing required parameters." });
  }

  try {
    // Add the seller to the database
    const success = await addSellerToDatabase(sellerName, requestComingFromUuid, website);

    if (!success) throw new Error("Error adding seller to the database. (success=false)");

    return res
      .status(200)
      .json({ message: `Seller ${sellerName} was added to the database.` });
  } catch (error) {
    console.error("Error adding seller to the database:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Starting the server
const PORT = process.env.PORT || 3100;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
