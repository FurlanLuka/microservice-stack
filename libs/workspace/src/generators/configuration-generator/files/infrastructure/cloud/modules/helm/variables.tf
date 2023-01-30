variable "host" {
  type = string
}

variable "cluster_ca_certificate" {
  type = string
}

variable "name" {
 type = string
}

variable "environment_name" {
  type = string
}

variable "domain" {
  type = string
}

variable "acm_certificate_arn" {
  type = string
}

variable "deploy_rabbitmq" {
  type = bool
}

variable "deploy_redis" {
  type = bool
}