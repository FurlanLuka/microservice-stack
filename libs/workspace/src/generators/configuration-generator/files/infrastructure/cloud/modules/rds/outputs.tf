resource "local_file" "database_credentials" {
  count = var.output_secrets ? 1 : 0

  filename = "${path.root}/outputs/postgres_database_credentials.json"
  content  = <<EOF
{
  "database": "${module.db.db_instance_name}",
  "username": "${module.db.db_instance_username}",
  "password": "${module.db.db_instance_password}",
  "port": "${module.db.db_instance_port}",
  "hostname": "${module.db.db_instance_endpoint}"
}
EOF
}
