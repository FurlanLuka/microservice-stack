variable "cluster_name" {
  type = string
}

variable "acm_certificate_arn" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "vpc_private_subnets" {}

variable "aws_auth_users" {
  default = []
}
