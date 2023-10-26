#!/bin/bash

echo_info () {
    echo "$1"
}

# Updating packages
echo_info "UPDATES-BEING-INSTALLED"
sudo apt update && sudo apt upgrade -y


# Installing node server
echo_info "INSTALLING-NODEJS"
sudo apt install -y nodejs npm


# Installing unzip
echo_info "INSTALLING-UNZIP"
sudo apt install -y unzip


# Uninstalling git
sudo apt-get remove --purge -y git


# Creating new user and giving ownership to the webapp directory
sudo groupadd ajit
sudo useradd -s /bin/false -g ajit -d /opt/ajit -m ajit
sudo chmod -R 755 /opt/ajit/webapp


# Moving weapp.zip to /opt/ajithome and installing node modules
sudo mv /home/admin/webapp.zip /opt/ajit/
cd /opt/ajit
sudo unzip webapp.zip
sudo rm webapp.zip
sudo mv /opt/ajit/webapp/users.csv /opt/
cd /opt/ajit/webapp
sudo npm i


# Starting the service
sudo sh -c "echo '[Unit]
Description=My NPM Service
Requires=cloud-init.target
After=cloud-final.service

[Service]
EnvironmentFile=/etc/environment
Type=simple
User=ajit
WorkingDirectory=/opt/ajit/webapp
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10

[Install]
WantedBy=cloud-init.target' | sudo tee /etc/systemd/system/webapp.service"

sudo systemctl daemon-reload
sudo systemctl enable webapp
sudo systemctl start webapp
sudo systemctl status webapp