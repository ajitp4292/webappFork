#!/bin/bash
 
echo_info () {
    echo "$1"
}
 
# Updating packages
sudo apt update && sudo apt upgrade -y
 
# Installing node server
sudo apt install -y nodejs npm
 
# Installing unzip
sudo apt install -y unzip
 
# Uninstalling git
sudo apt-get remove --purge -y git
 
# Installing PostgreSQL Client
sudo apt install postgresql-client -y
 
# Installing dig
sudo apt install dnsutils -y
 
# Cloudwatch agent installation and configuration
sudo wget https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i ./amazon-cloudwatch-agent.deb
sudo apt-get -f install
sudo mv /home/admin/cloudwatch-config.json /opt/cloudwatch-config.json
 
# Creating new user and giving ownership to the webapp directory
sudo groupadd ajitgroup
sudo useradd -s /bin/false -g ajitgroup -d /opt/ajithome -m ajit
sudo chown -R ajit:ajitgroup /opt/ajithome/
sudo chmod -R 775 /opt/ajithome/
sudo chmod g+s /opt/ajithome/
 
# Moving weapp.zip to /opt/ajithome and installing node modules
sudo mv /home/admin/webapp.zip /opt/ajithome/
cd /opt/ajithome/
sudo unzip webapp.zip
sudo rm webapp.zip
 
# Creating log file
sudo touch /var/log/csye6225.log
sudo chown -R ajit:ajitgroup /var/log/csye6225.log
sudo chmod 750 /var/log/csye6225.log
 
# Installing node modules
sudo mv /opt/ajithome/webapp/users.csv /opt/
cd /opt/ajithome/webapp
sudo npm i
 
# Systemd
sudo cp /home/admin/webapp.service /etc/systemd/system/
 
#Final permissions to directory
sudo chown ajit:ajitgroup /etc/systemd/system/webapp.service
sudo chmod 750 /etc/systemd/system/webapp.service
sudo chown -R ajit:ajitgroup /opt/ajithome/
sudo chmod -R 750 /opt/ajithome/webapp
 
# Starting the service
sudo systemctl daemon-reload
sudo systemctl enable webapp
sudo systemctl start webapp
sudo systemctl status webapp
 
# Installing rsyslog for audit logs
sudo apt install -y rsyslog
sudo systemctl daemon-reload