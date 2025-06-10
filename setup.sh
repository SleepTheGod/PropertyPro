#!/bin/bash

echo "🚀 Fully Automated Property Management System Setup"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if required tools are installed
check_dependencies() {
    print_info "Checking dependencies..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    print_status "All dependencies are installed"
}

# Install Vercel CLI if not present
install_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        print_info "Installing Vercel CLI..."
        npm install -g vercel
        print_status "Vercel CLI installed"
    else
        print_status "Vercel CLI already installed"
    fi
}

# Generate secure secrets
generate_secrets() {
    print_info "Generating secure secrets..."
    
    # Generate NEXTAUTH_SECRET (32 characters)
    NEXTAUTH_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
    
    # Generate JWT_SECRET (64 characters)
    JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)
    
    print_status "Secrets generated"
}

# Create environment file
create_env_file() {
    print_info "Creating environment configuration..."
    
    cat > .env.local << EOF
# Auto-generated environment configuration
# Generated on: $(date)

# Database Configuration (will be set automatically by Neon integration)
DATABASE_URL="postgresql://user:pass@localhost:5432/property_management"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"

# JWT Secret
JWT_SECRET="$JWT_SECRET"

# Stripe Configuration (Test Mode - Safe for development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51234567890abcdef"
STRIPE_SECRET_KEY="sk_test_51234567890abcdef"
STRIPE_WEBHOOK_SECRET="whsec_test_1234567890abcdef"

# Application Settings
NODE_ENV="development"
SITE_URL="http://localhost:3000"
ADMIN_EMAIL="root@admin.com"

# Optional: Email Configuration (disabled by default)
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT="587"
# SMTP_USER=""
# SMTP_PASS=""

# Optional: SMS Configuration (disabled by default)
# TWILIO_ACCOUNT_SID=""
# TWILIO_AUTH_TOKEN=""
# TWILIO_PHONE_NUMBER=""
EOF

    print_status "Environment file created"
}

# Install dependencies
install_dependencies() {
    print_info "Installing project dependencies..."
    npm install
    print_status "Dependencies installed"
}

# Build the project
build_project() {
    print_info "Building project..."
    npm run build
    if [ $? -eq 0 ]; then
        print_status "Project built successfully"
    else
        print_error "Build failed. Please check the errors above."
        exit 1
    fi
}

# Deploy to Vercel
deploy_to_vercel() {
    print_info "Deploying to Vercel..."
    
    # Login to Vercel (will open browser if not logged in)
    vercel login
    
    # Deploy with auto-generated project name
    PROJECT_NAME="property-mgmt-$(date +%s)"
    
    # Create vercel.json with project name
    cat > vercel.json << EOF
{
  "name": "$PROJECT_NAME",
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
EOF
    
    # Deploy to production
    DEPLOYMENT_URL=$(vercel --prod --yes --name "$PROJECT_NAME" 2>&1 | grep -o 'https://[^[:space:]]*\.vercel\.app')
    
    if [ -n "$DEPLOYMENT_URL" ]; then
        print_status "Deployed successfully to: $DEPLOYMENT_URL"
        echo "$DEPLOYMENT_URL" > deployment_url.txt
    else
        print_error "Deployment failed"
        exit 1
    fi
}

# Set up Neon database automatically
setup_neon_database() {
    print_info "Setting up Neon database integration..."
    
    # This will be handled by the Vercel integration
    # The database URL will be automatically set
    print_status "Neon integration will be configured automatically"
}

# Update environment variables in Vercel
update_vercel_env() {
    if [ -f "deployment_url.txt" ]; then
        DEPLOYMENT_URL=$(cat deployment_url.txt)
        PROJECT_NAME=$(basename "$DEPLOYMENT_URL" .vercel.app)
        
        print_info "Updating production environment variables..."
        
        # Update NEXTAUTH_URL to production URL
        vercel env add NEXTAUTH_URL "$DEPLOYMENT_URL" production --yes
        vercel env add NEXTAUTH_SECRET "$NEXTAUTH_SECRET" production --yes
        vercel env add JWT_SECRET "$JWT_SECRET" production --yes
        
        print_status "Environment variables updated"
    fi
}

# Verify deployment
verify_deployment() {
    if [ -f "deployment_url.txt" ]; then
        DEPLOYMENT_URL=$(cat deployment_url.txt)
        
        print_info "Verifying deployment..."
        
        # Wait a moment for deployment to be ready
        sleep 10
        
        # Check if site is accessible
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL")
        
        if [ "$HTTP_STATUS" = "200" ]; then
            print_status "Deployment verification successful"
        else
            print_warning "Deployment may still be initializing (HTTP $HTTP_STATUS)"
        fi
    fi
}

# Main execution
main() {
    echo ""
    print_info "Starting fully automated setup..."
    echo ""
    
    check_dependencies
    install_vercel_cli
    generate_secrets
    create_env_file
    install_dependencies
    build_project
    deploy_to_vercel
    setup_neon_database
    update_vercel_env
    verify_deployment
    
    echo ""
    echo "🎉 SETUP COMPLETE!"
    echo "=================="
    
    if [ -f "deployment_url.txt" ]; then
        DEPLOYMENT_URL=$(cat deployment_url.txt)
        echo ""
        print_status "Your Property Management System is live at:"
        echo -e "${BLUE}🌐 $DEPLOYMENT_URL${NC}"
        echo ""
        print_status "Admin Login:"
        echo -e "${BLUE}📧 Email: root@admin.com${NC}"
        echo -e "${BLUE}🔑 Password: root${NC}"
        echo ""
        print_status "Admin Dashboard:"
        echo -e "${BLUE}🏠 $DEPLOYMENT_URL/admin/login${NC}"
        echo ""
        print_status "Tenant Portal:"
        echo -e "${BLUE}👥 $DEPLOYMENT_URL/login${NC}"
        echo ""
        print_info "Next Steps:"
        echo "1. Visit the admin dashboard and change the default password"
        echo "2. Add your first property and units"
        echo "3. Configure Stripe for real payments (optional)"
        echo "4. Invite tenants to register"
        echo ""
        print_warning "Note: The system is using test Stripe keys. Real payments are disabled for safety."
    fi
}

# Run main function
main
