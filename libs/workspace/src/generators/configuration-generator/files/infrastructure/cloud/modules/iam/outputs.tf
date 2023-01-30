resource "local_file" "iam_user_credentials" {
  count = var.output_secrets ? 1 : 0

  filename = "${path.root}/outputs/iam_user_credentials.json"
  content  = <<EOF
{
  "iam_user_name": "${module.iam_user_github_actions.iam_user_name}",
  "iam_access_key_id": "${module.iam_user_github_actions.iam_access_key_id}",
  "iam_access_key_secret": "${module.iam_user_github_actions.iam_access_key_secret}",
}
EOF
}

output "github_actions_user_arn" {
  value = module.iam_user_github_actions.iam_user_arn
}

output "github_actions_user_name" {
  value = module.iam_user_github_actions.iam_user_name
}
