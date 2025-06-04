const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Initialize Firebase Admin SDK with your service account key file
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

/**
 * Imports a JSON file into a specified Firestore collection.
 * Each item in the JSON array will be added as a document.
 *
 * @param {string} filePath - The path to the JSON file.
 * @param {string} collectionName - The name of the Firestore collection.
 */
async function importCollection(filePath, collectionName) {
  try {
    // Read and parse the JSON file
    // const data = JSON.parse(fs.readFileSync(path.join(__dirname, filePath), 'utf8'));
    const data = JSON.parse(fs.readFileSync("./products.json", "utf8"));

    // Prepare a batch write
    const batch = db.batch();

    data.forEach((doc) => {
      // Use the _id field as the document ID if available, else let Firestore generate one.
      const docRef = doc._id
        ? db.collection(collectionName).doc(doc._id)
        : db.collection(collectionName).doc();
      batch.set(docRef, doc);
    });

    // Commit the batch
    await batch.commit();
    console.log(
      `Imported ${data.length} documents into "${collectionName}" collection.`
    );
  } catch (error) {
    console.error(`Error importing collection ${collectionName}:`, error);
  }
}

async function runImport() {
  await importCollection("products.json", "products");
  await importCollection("categories.json", "categories");
  await importCollection("brands.json", "brands");
}

runImport()
  .then(() => {
    console.log("Data import completed successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Data import encountered an error:", error);
    process.exit(1);
  });
