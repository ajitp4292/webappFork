#!/bin/bash
# Update and Upgrade System
sudo apt update -y
sudo apt upgrade -y

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Node.js and npm
sudo apt install -y nodejs npm

# Set PostgreSQL default user password 
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'Admin7914';"

# Navigate to /opt directory
cd /opt

# Install unzip
sudo apt install -y unzip

