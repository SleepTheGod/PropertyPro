# 🚀 Deployment Guide - Property Management System

This guide will help you deploy the Property Management System to Vercel for live testing and production use.

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository
- Vercel account
- Database provider account (Neon recommended)
- Stripe account (for payments)

## 🗄️ Step 1: Database Setup

### Option A: Neon Database (Recommended)

1. **Create Neon Account**: Go to [neon.tech](https://neon.tech) and sign up
2. **Create Database**: Create a new project called "property-management"
3. **Run Setup Script**: Copy and run the SQL from `database/neon_setup.sql` in the Neon console
4. **Get Connection String**: Copy your DATABASE_URL from Neon dashboard

### Option B: Supabase

1. **Create Supabase Account**: Go to [supabase.com](https://supabase.com)
2. **Create Project**: Create a new project
3. **Run SQL**: Execute the setup script in the SQL editor
4. **Get Connection String**: Copy your PostgreSQL connection string

## 🔧 Step 2: Environment Variables

Create these environment variables in your Vercel dashboard:

\`\`\`bash
# Database
DATABASE_URL="postgresql://username:password@host:5432/database"

# Authentication
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-32-character-secret-key"

# Stripe (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Optional: SMS (Twilio)
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+1234567890"
\`\`\`

## 🚀 Step 3: Deploy to Vercel

### Method 1: Vercel CLI (Recommended)

\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
\`\`\`

### Method 2: GitHub Integration

1. **Push to GitHub**: Push your code to a GitHub repository
2. **Connect Vercel**: Go to [vercel.com](https://vercel.com) and import your repository
3. **Configure**: Set environment variables in the Vercel dashboard
4. **Deploy**: Vercel will automatically deploy

## 💳 Step 4: Stripe Configuration

1. **Create Stripe Account**: Go to [stripe.com](https://stripe.com)
2. **Get API Keys**: Copy your publishable and secret keys
3. **Set up Webhooks**:
   - Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. **Copy Webhook Secret**: Add to environment variables

## 📧 Step 5: Email Configuration (Optional)

For email notifications, configure SMTP:

\`\`\`bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
\`\`\`

## 📱 Step 6: SMS Configuration (Optional)

For SMS notifications, set up Twilio:

1. **Create Twilio Account**: Go to [twilio.com](https://twilio.com)
2. **Get Phone Number**: Purchase a phone number
3. **Get Credentials**: Copy Account SID and Auth Token
4. **Add to Environment Variables**

## ✅ Step 7: Verify Deployment

1. **Visit Your Site**: Go to your Vercel URL
2. **Test Admin Login**: 
   - Email: `root@admin.com`
   - Password: `root`
3. **Test Features**:
   - Create a property
   - Add a unit
   - Create a tenant
   - Process a payment
   - Submit a maintenance request

## 🔒 Step 8: Security Checklist

- [ ] Change default admin password
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Set up monitoring
- [ ] Enable database backups

## 📊 Step 9: Monitoring & Analytics

### Vercel Analytics
\`\`\`bash
npm install @vercel/analytics
\`\`\`

### Error Tracking (Sentry)
\`\`\`bash
npm install @sentry/nextjs
\`\`\`

## 🔄 Step 10: Continuous Deployment

Set up automatic deployments:

1. **GitHub Integration**: Connect your repository
2. **Branch Protection**: Set up main branch protection
3. **Preview Deployments**: Enable for pull requests
4. **Environment Promotion**: Set up staging → production flow

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check DATABASE_URL format
   - Verify database is accessible
   - Check firewall settings

2. **Authentication Issues**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches domain
   - Ensure cookies are enabled

3. **Payment Failures**
   - Verify Stripe keys are correct
   - Check webhook endpoint
   - Test with Stripe test cards

4. **Build Failures**
   - Check Node.js version (18+)
   - Verify all dependencies are installed
   - Check TypeScript errors

### Support

- **Documentation**: Check README.md
- **Logs**: View Vercel function logs
- **Database**: Check Neon/Supabase logs
- **Stripe**: Check Stripe dashboard

## 🎉 Success!

Your Property Management System is now live! 

**Admin Access**: `https://your-domain.vercel.app/admin/login`
**Tenant Access**: `https://your-domain.vercel.app/login`

Remember to:
- Change default passwords
- Set up regular backups
- Monitor system performance
- Keep dependencies updated
\`\`\`

Now let's create a quick deployment verification script:
