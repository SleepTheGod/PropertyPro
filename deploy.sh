#!/bin/bash

echo "🚀 Deploying Property Management System to Vercel"
echo "================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project locally first
echo "🔨 Building project locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment completed!"
echo ""
echo "🔗 Your Property Management System is now live!"
echo ""
echo "📋 Next Steps:"
echo "1. Set up your database (Neon, Supabase, or PlanetScale)"
echo "2. Configure environment variables in Vercel dashboard"
echo "3. Set up Stripe webhooks"
echo "4. Test the admin login with root@admin.com / root"
echo ""
echo "🔧 Environment Variables to set in Vercel:"
echo "- DATABASE_URL"
echo "- NEXTAUTH_SECRET"
echo "- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo "- STRIPE_SECRET_KEY"
echo "- STRIPE_WEBHOOK_SECRET"
echo ""
echo "📚 Documentation: Check README.md for detailed setup instructions"
