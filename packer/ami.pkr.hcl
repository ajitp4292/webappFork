packer {
  required_plugins {
    amazon = {
      version = ">= 1.2.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
  //if no default the region becomes required
}

variable "source_ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9"
}

variable "ssh_username" {
  type    = string
  default = "admin_user"
}

variable "vpc_id" {
  type    = string
  default = "vpc-01e6d98c0a832c06d"
}

variable "subnet_id" {
  type    = string
  default = "subnet-068b40a438a6d2d33"
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

variable "ami_users" {
  type    = list(string)
  default = ["838458155220"]
}

source "amazon-ebs" "app-ami" {
  region          = "${var.aws_region}"
  ami_name        = "csye6225_f23_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "AMI test-dev"
  ami_users       = var.ami_users
  ami_regions = [
    "us-east-1",
  ]


  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }
  instance_type = "${var.instance_type}"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  subnet_id     = "${var.subnet_id}"
  vpc_id        = "${var.vpc_id}"
  profile       = "dev"

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  name    = "packer-ami"
  sources = ["source.amazon-ebs.app-ami"]

  
  provisioner "file" {
    source      = "../webapp.zip"
    destination = "/opt/webapp.zip"
  }


  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1"
    ]

    script = "./packer/start.sh"
  }
  /*
  post-processor "manifest" {
    output = "./packer/manifest.json"
    strip_path = true
  }*/
}