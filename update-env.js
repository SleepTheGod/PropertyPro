import fs from "fs"

// Read the current .env file
const envFile = fs.readFileSync(".env", "utf8")

// Replace test keys with live keys
const updatedEnv = envFile
  .replace(
    /NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_[a-zA-Z0-9]+/g,
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51234567890abcdef",
  )
  .replace(/STRIPE_SECRET_KEY=sk_test_[a-zA-Z0-9]+/g, "STRIPE_SECRET_KEY=sk_live_51234567890abcdef")
  .replace(/STRIPE_WEBHOOK_SECRET=whsec_[a-zA-Z0-9]+/g, "STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef")
  .replace(/STRIPE_MODE=test/g, "STRIPE_MODE=live")

// Write the updated .env file
fs.writeFileSync(".env", updatedEnv)

console.log("✅ Environment variables updated with live Stripe keys")
console.log("🔒 Your system is now configured for LIVE payments")
