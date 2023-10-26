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
  default = "admin"
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
  default = ["838458155220", "130332994094"]
}