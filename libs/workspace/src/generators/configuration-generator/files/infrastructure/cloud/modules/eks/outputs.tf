output "host" {
  value = module.eks.cluster_endpoint
}

output "cluster_ca_certificate" {
  value = base64decode(module.eks.cluster_certificate_authority_data)
}

output "name" {
  value = module.eks.cluster_name
}

output "cluster_arn" {
  value = module.eks.cluster_arn
}