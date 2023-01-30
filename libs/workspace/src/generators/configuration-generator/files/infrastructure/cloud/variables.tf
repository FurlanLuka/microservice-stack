variable "environment_name" {
  default = "production_environment"
}

variable "domain" {
  default = "<replace>"
}

variable "zone_id" {
  default = "<replace>"
}

variable "output_secrets" {
  default = true
}

variable "load_balancer_url" {
  default = ""
}

variable "deploy_rabbitmq" {
  default = false
}

variable "deploy_redis" {
  default = false
}

variable "deploy_postgres" {
  default = false
}