variable "output_secrets" {
  default = false
}

variable "name" {
  type = string
}

variable "db_name" {
  type = string
}

variable "username" {
  type    = string
  default = "root"
}

variable "instance_class" {
  type    = string
  default = "db.t4g.micro"
}

variable "vpc_id" {}

variable "vpc_cidr_block" {}

variable "vpc_private_subnets" {}

variable "vpc_database_subnet_group" {}
