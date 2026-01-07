// functions/index.js (Node.js)
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.getUserData = functions.https.onRequest(async (req, res) => {
  // 1. Get the token from the header
  const tokenId = req.get("Authorization").split("Bearer ")[1];

  try {
    // 2. Verify it with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    const uid = decodedToken.uid;

    // 3. Do secure stuff (e.g., fetch from DB)
    const data = { secret: "This is user-only data", userId: uid };
    res.json(data);
  } catch {
    res.status(403).send("Unauthorized");
  }
});
