#!/bin/bash

# TaskManager Setup Script
echo "🚀 Setting up TaskManager Application..."

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

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    print_error "Node.js version $NODE_VERSION is too old. Please install Node.js 18+ and try again."
    exit 1
fi

print_status "Node.js version $NODE_VERSION is compatible"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    print_warning "PostgreSQL is not installed. Please install PostgreSQL 12+ for full functionality."
    print_info "You can still run the application with mock data for development."
fi

# Install dependencies
print_info "Installing dependencies..."

# Install root dependencies
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install root dependencies"
    exit 1
fi

# Install server dependencies
print_info "Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install server dependencies"
    exit 1
fi
cd ..

# Install client dependencies
print_info "Installing client dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install client dependencies"
    exit 1
fi
cd ..

print_status "All dependencies installed successfully"

# Setup environment file
print_info "Setting up environment configuration..."
if [ ! -f "server/.env" ]; then
    cp server/.env.example server/.env
    print_status "Created server/.env file"
    print_warning "Please edit server/.env with your database credentials"
else
    print_info "server/.env already exists"
fi

# Setup database (if PostgreSQL is available)
if command -v psql &> /dev/null; then
    print_info "Setting up database..."
    
    # Check if database exists
    if psql -lqt | cut -d \| -f 1 | grep -qw taskmanager; then
        print_info "Database 'taskmanager' already exists"
    else
        print_info "Creating database 'taskmanager'..."
        createdb taskmanager
        if [ $? -eq 0 ]; then
            print_status "Database created successfully"
        else
            print_warning "Failed to create database. You may need to configure PostgreSQL first."
        fi
    fi
    
    # Run database schema
    print_info "Setting up database schema..."
    psql -d taskmanager -f server/database/schema.sql
    if [ $? -eq 0 ]; then
        print_status "Database schema created successfully"
    else
        print_warning "Failed to create database schema. Please check your PostgreSQL configuration."
    fi
fi

# Build client for production
print_info "Building client application..."
cd client
npm run build
if [ $? -eq 0 ]; then
    print_status "Client built successfully"
else
    print_error "Failed to build client"
    exit 1
fi
cd ..

# Final instructions
echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit server/.env with your database credentials (if using PostgreSQL)"
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "🌐 The application will be available at:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend: http://localhost:5000"
echo ""
echo "📚 Available commands:"
echo "   npm run dev        - Start development servers"
echo "   npm run build      - Build for production"
echo "   npm start          - Start production server"
echo "   npm run clean      - Clean node_modules"
echo ""
echo "🐛 If you encounter issues:"
echo "   - Check that PostgreSQL is running"
echo "   - Verify database credentials in server/.env"
echo "   - Make sure ports 3000 and 5000 are available"
echo ""
print_status "TaskManager is ready to use!"