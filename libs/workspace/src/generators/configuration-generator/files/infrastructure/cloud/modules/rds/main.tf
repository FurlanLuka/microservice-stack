module "security_group" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 4.0"

  name        = "${var.name}-postgresql-security-group"
  description = "PostgreSQL security group"
  vpc_id      = var.vpc_id

  ingress_with_cidr_blocks = [
    {
      from_port   = 5432
      to_port     = 5432
      protocol    = "tcp"
      description = "Postgre access from within VPC"
      cidr_blocks = var.vpc_cidr_block
    },
  ]
}

module "db" {
  source = "terraform-aws-modules/rds/aws"

  identifier = "${var.name}-postgresql"

  engine               = "postgres"
  engine_version       = "14"
  family               = "postgres14"
  major_engine_version = "14"
  instance_class       = var.instance_class

  allocated_storage     = 20
  max_allocated_storage = 100

  db_name  = var.db_name
  username = var.username
  port     = 5432

  multi_az               = true
  subnet_ids             = var.vpc_private_subnets
  vpc_security_group_ids = [module.security_group.security_group_id]
  db_subnet_group_name   = var.vpc_database_subnet_group

  maintenance_window              = "Mon:00:00-Mon:03:00"
  backup_window                   = "03:00-06:00"
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  backup_retention_period = 1
  skip_final_snapshot     = false

  parameters = [
    {
      name  = "autovacuum"
      value = 1
    },
    {
      name  = "client_encoding"
      value = "utf8"
    }
  ]
}
