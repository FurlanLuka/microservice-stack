provider "helm" {
  kubernetes {
    host = var.host
    cluster_ca_certificate = var.cluster_ca_certificate

    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      args        = ["eks", "get-token", "--cluster-name", var.name]
      command     = "aws"
    }
  }
}

resource "helm_release" "alb" {
  name = "aws-load-balancer-controller"

  repository = "https://aws.github.io/eks-charts"
  chart = "aws-load-balancer-controller"

  namespace = "kube-system"

  set {
    name = "clusterName"
    value = var.environment_name
  }

  set {
    name = "serviceAccount.create"
    value = false
  }

  set {
    name = "serviceAccount.name"
    value = "aws-load-balancer-controller"
  }
}

resource "helm_release" "redis" {
  count = var.deploy_redis ? 1 : 0

  name = "redis"
  chart = "bitnami/redis"

  set {
    name = "auth.enabled"
    value = false
  }
}

resource "helm_release" "rabbitmq" {
  count = var.deploy_rabbitmq ? 1 : 0

  name = "rabbitmq"
  chart = "bitnami/rabbitmq"

  set {
    name = "communityPlugins"
    value = "https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download/3.10.2/rabbitmq_delayed_message_exchange-3.10.2.ez"
  }

  set {
    name = "extraPlugins"
    value = "rabbitmq_auth_backend_ldap rabbitmq_delayed_message_exchange"
  }

  set {
    name = "replicaCount"
    value = 1
  }

  set {
    name = "auth.username"
    value = "guest"
  }

  set {
    name = "auth.password"
    value = "guest"
  }
}

resource "helm_release" "ingress_controller" {
  name = "ingress-controller"
  chart = "../charts/ingress-controller"

  set {
    name = "environment"
    value = "production"
  }

  set {
    name = "productionConfig.domain"
    value = "api.${var.domain}"
  }

  set {
    name = "productionConfig.sslCertificateArn"
    value = var.acm_certificate_arn
  }

  values = [
    file("../ingress-values.yaml"),
  ]
}