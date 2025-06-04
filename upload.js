const admin = require("firebase-admin");
const fs = require("fs");

const data = JSON.parse(fs.readFileSync("./products.json", "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json")),
});

const db = admin.firestore();

async function testConnection() {
  try {
    const doc = await db.collection("test").doc("ping").get();
    console.log("Connection success:", doc.exists);
  } catch (error) {
    console.error("Connection failed:", error);
  }
}

// دالة رفع البيانات
async function uploadData() {
  const products = data.data;

  if (!Array.isArray(products)) {
    console.error("❌ 'data' is not an array of products.");
    return;
  }

  for (const product of products) {
    try {
      await db.collection("products").add(product);
      console.log(`✔️ Uploaded: ${product.title || "Unnamed product"}`);
    } catch (error) {
      console.error(`❌ Error uploading product:`, error);
    }
  }

  console.log("✅ All data uploaded!");
}

// تنفيذ دالة اختبار الاتصال ثم الرفع
async function main() {
  await testConnection();
  await uploadData();
}

main();
