// Migrate product images from Imgur (or any remote) to local /public/images/products
// Usage (PowerShell):
//   $env:SERVICE_ACCOUNT_PATH="./scripts/serviceAccountKey.json"; $env:FIRESTORE_PRODUCTS_COLLECTION="produits"; node scripts/migrate-imgur-to-local.js
// Requirements:
//   - Node 18+
//   - A Firebase service account JSON (download from Firebase console)
//   - Firestore documents with fields: id (doc id), imageUrl (remote URL), nom (optional for logging)

const fs = require("fs")
const path = require("path")
const admin = require("firebase-admin")

const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || path.join(__dirname, "serviceAccountKey.json")
const collectionName = process.env.FIRESTORE_PRODUCTS_COLLECTION || "produits"
const outputDir = path.resolve(process.cwd(), "public", "images", "products")

if (!fs.existsSync(serviceAccountPath)) {
  console.error(`❌ Service account file not found: ${serviceAccountPath}`)
  process.exit(1)
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"))

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

const db = admin.firestore()

async function downloadImage(url, destPath) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`)
  }
  const arrayBuffer = await res.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  fs.writeFileSync(destPath, buffer)
}

function inferExtension(url, contentType) {
  if (contentType?.includes("png")) return "png"
  if (contentType?.includes("webp")) return "webp"
  if (contentType?.includes("jpeg") || contentType?.includes("jpg")) return "jpg"
  const m = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/)
  if (m) return m[1].toLowerCase()
  return "jpg"
}

async function migrate() {
  console.log(`🚀 Migrating images from collection '${collectionName}' -> ${outputDir}`)
  const snapshot = await db.collection(collectionName).get()
  console.log(`Found ${snapshot.size} documents`)

  let migrated = 0
  let skipped = 0
  let failed = 0

  for (const doc of snapshot.docs) {
    const data = doc.data()
    const imageUrl = data.imageUrl
    const name = data.nom || data.name || doc.id

    if (!imageUrl) {
      console.warn(`⚠️  Skipping ${doc.id} (${name}): no imageUrl`)
      skipped++
      continue
    }

    // If already local, skip
    if (imageUrl.startsWith("/images/products/")) {
      console.log(`➡️  Skip (already local): ${doc.id} -> ${imageUrl}`)
      skipped++
      continue
    }

    try {
      const headRes = await fetch(imageUrl, { method: "HEAD" })
      const contentType = headRes.ok ? headRes.headers.get("content-type") : null
      const ext = inferExtension(imageUrl, contentType)
      const filename = `${doc.id}.${ext}`
      const dest = path.join(outputDir, filename)

      console.log(`⬇️  Downloading ${doc.id} (${name}) from ${imageUrl}`)
      await downloadImage(imageUrl, dest)

      const localPath = `/images/products/${filename}`
      await db.collection(collectionName).doc(doc.id).update({ imageUrl: localPath })
      console.log(`✅ Updated ${doc.id}: imageUrl -> ${localPath}`)
      migrated++
    } catch (err) {
      console.error(`❌ Failed ${doc.id} (${name}):`, err?.message || err)
      failed++
    }
  }

  console.log(`\nDone. Migrated: ${migrated}, skipped: ${skipped}, failed: ${failed}`)
}

migrate()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
