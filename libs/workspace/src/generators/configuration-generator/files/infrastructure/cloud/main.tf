terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

variable "access_key" {}
variable "secret_key" {}
variable "region" {}

provider "aws" {
  region     = var.region
  secret_key = var.secret_key
  access_key = var.access_key

  default_tags {
    tags = {
      Manager = "MicroserviceStack"
    }
  }
}

module "certificate_manager" {
  source  = "./modules/certificate_manager"

  domain  = var.domain
  zone_id = var.zone_id
}

module "vpc" {
  source = "./modules/vpc"

  environment_name = var.environment_name
}

module "container_repository" {
  source = "./modules/container_repository"

  environment_name = var.environment_name
}

module "eks" {
  source = "./modules/eks"

  cluster_name = var.environment_name

  acm_certificate_arn = module.certificate_manager.acm_certificate_arn

  vpc_id = module.vpc.vpc_id
  vpc_private_subnets = module.vpc.private_subnets

  aws_auth_users = [
    {
      userarn  = module.iam.github_actions_user_arn
      username = module.iam.github_actions_user_name
      groups   = ["system:masters"]
    },
  ]
}

module "iam" {
  source = "./modules/iam"

  output_secrets = var.output_secrets
  eks_cluster_arn = module.eks.cluster_arn
}

module "helm" {
  source = "./modules/helm"

  host = module.eks.host
  name = module.eks.name
  cluster_ca_certificate = module.eks.cluster_ca_certificate

  deploy_rabbitmq = var.deploy_rabbitmq
  deploy_redis = var.deploy_redis

  domain = var.domain
  acm_certificate_arn = module.certificate_manager.acm_certificate_arn

  environment_name = var.environment_name
}

module "rds" {
  count = var.deploy_postgres ? 1 : 0

  source = "./modules/rds"

  name = var.environment_name

  db_name  = "default_db"
  username = "default_user"

  vpc_id                    = module.vpc.vpc_id
  vpc_private_subnets       = module.vpc.private_subnets
  vpc_database_subnet_group = module.vpc.database_subnet_group
  vpc_cidr_block            = module.vpc.vpc_cidr_block
}

module "records" {
  count = var.load_balancer_url != "" ? 1 : 0

  source  = "terraform-aws-modules/route53/aws//modules/records"
  version = "~> 2.0"

  zone_id = var.zone_id

  records = [
     {
      name = "api"
      type = "CNAME"
      ttl  = 60
      records = [
        var.load_balancer_url
      ]
    }
  ]
}

