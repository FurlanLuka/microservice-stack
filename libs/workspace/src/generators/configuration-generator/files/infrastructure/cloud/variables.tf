variable "environment_name" {
  default = "production_environment"
}

variable "domain" {
  default = "cloud.microservice-stack.com"
}

variable "zone_id" {
  default = "Z0524984X82EET1H7DYL"
}

variable "output_secrets" {
  default = true
}

variable "load_balancer_url" {
  default = "k8s-ingresscontroller-68eee81516-2098595028.us-east-1.elb.amazonaws.com"
}