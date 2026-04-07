terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.0.0"
    }
  }

  backend "s3" {
    bucket                      = "tasknote-stg"
    key                         = "kubernetes/terraform.tfstate"
    region                      = "auto"
    endpoints                   = { s3 = "https://d17eb09b6bce2f90e16e800bb2a6baf9.r2.cloudflarestorage.com" }
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    skip_s3_checksum            = true
  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

variable "db_user" {
  type      = string
  sensitive = true
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "db_name" {
  type      = string
  sensitive = true
}

variable "security_key" {
  type      = string
  sensitive = true
}

variable "mailgun_apikey" {
  type      = string
  sensitive = true
}

variable "cors_allowed_origins" {
  type    = string
  default = "https://tasknote-stg.darkroasted.vps-kinghost.net"
}

variable "root_log_level" {
  type    = string
  default = "INFO"
}

variable "backend_image" {
  type    = string
  default = "ghcr.io/rmcampos/tasknote/api:candidate"
}

variable "frontend_image" {
  type    = string
  default = "ghcr.io/rmcampos/tasknote/app:candidate"
}

resource "kubernetes_namespace_v1" "tasknote_stg" {
  metadata {
    name = "tasknote-stg"
  }
}

resource "kubernetes_secret_v1" "tasknote_stg_secrets" {
  metadata {
    name      = "tasknote-stg-secrets"
    namespace = kubernetes_namespace_v1.tasknote_stg.metadata[0].name
  }

  data = {
    postgres_user     = var.db_user
    postgres_password = var.db_password
    postgres_db       = var.db_name
    security_key      = var.security_key
    mailgun_apikey    = var.mailgun_apikey
  }
}

resource "kubernetes_persistent_volume_claim_v1" "tasknote_stg_db_data" {
  metadata {
    name      = "postgres-data-pvc"
    namespace = kubernetes_namespace_v1.tasknote_stg.metadata[0].name
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = "1Gi"
      }
    }
  }
}

resource "kubernetes_deployment_v1" "tasknote_stg_db" {
  metadata {
    name      = "tasknote-stg-db"
    namespace = kubernetes_namespace_v1.tasknote_stg.metadata[0].name
  }
  spec {
    replicas = 1
    selector { match_labels = { app = "tasknote-stg-db" } }
    template {
      metadata { labels = { app = "tasknote-stg-db" } }
      spec {
        container {
          image = "postgres:15.8-bookworm"
          name  = "postgres"
          volume_mount {
            name       = "postgres-storage"
            mount_path = "/var/lib/postgresql/data"
          }
          env {
            name = "POSTGRES_USER"
            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.tasknote_stg_secrets.metadata[0].name
                key  = "postgres_user"
              }
            }
          }
          env {
            name = "POSTGRES_PASSWORD"
            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.tasknote_stg_secrets.metadata[0].name
                key  = "postgres_password"
              }
            }
          }
          env {
            name = "POSTGRES_DB"
            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.tasknote_stg_secrets.metadata[0].name
                key  = "postgres_db"
              }
            }
          }
          port { container_port = 5432 }
        }
        volume {
          name = "postgres-storage"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim_v1.tasknote_stg_db_data.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service_v1" "tasknote_stg_db_svc" {
  metadata {
    name      = "tasknote-stg-db-svc"
    namespace = kubernetes_namespace_v1.tasknote_stg.metadata[0].name
  }
  spec {
    selector = { app = "tasknote-stg-db" }
    port { port = 5432 }
    type = "ClusterIP"
  }
}

resource "kubernetes_deployment_v1" "tasknote_stg_backend" {
  metadata {
    name      = "tasknote-stg-backend"
    namespace = kubernetes_namespace_v1.tasknote_stg.metadata[0].name
  }
  spec {
    replicas = 1
    selector { match_labels = { app = "tasknote-stg-backend" } }
    template {
      metadata { labels = { app = "tasknote-stg-backend" } }
      spec {
        container {
          image = var.backend_image
          name  = "backend"
          env {
            name = "POSTGRES_DB"
            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.tasknote_stg_secrets.metadata[0].name
                key  = "postgres_db"
              }
            }
          }
          env {
            name  = "POSTGRES_HOST"
            value = "tasknote-stg-db-svc"
          }
          env {
            name = "POSTGRES_USER"
            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.tasknote_stg_secrets.metadata[0].name
                key  = "postgres_user"
              }
            }
          }
          env {
            name = "POSTGRES_PASSWORD"
            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.tasknote_stg_secrets.metadata[0].name
                key  = "postgres_password"
              }
            }
          }
          env {
            name  = "POSTGRES_PORT"
            value = "5432"
          }
          env {
            name  = "CORS_ALLOWED_ORIGINS"
            value = var.cors_allowed_origins
          }
          env {
            name  = "SERVER_SERVLET_CONTEXT_PATH"
            value = "/"
          }
          env {
            name  = "ROOT_LOG_LEVEL"
            value = var.root_log_level
          }
          env {
            name = "SECURITY_KEY"
            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.tasknote_stg_secrets.metadata[0].name
                key  = "security_key"
              }
            }
          }
          env {
            name  = "TARGET_ENV"
            value = "production"
          }
          env {
            name = "MAILGUN_APIKEY"
            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.tasknote_stg_secrets.metadata[0].name
                key  = "mailgun_apikey"
              }
            }
          }
          resources {
            limits   = { memory = "256Mi", cpu = "500m" }
            requests = { memory = "256Mi", cpu = "250m" }
          }
        }
      }
    }
  }
}

resource "kubernetes_service_v1" "tasknote_stg_backend_svc" {
  metadata {
    name      = "tasknote-stg-backend-svc"
    namespace = kubernetes_namespace_v1.tasknote_stg.metadata[0].name
  }
  spec {
    selector = { app = "tasknote-stg-backend" }
    port {
      port        = 8585
      target_port = 8585
    }
  }
}

resource "kubernetes_deployment_v1" "tasknote_stg_frontend" {
  metadata {
    name      = "tasknote-stg-frontend"
    namespace = kubernetes_namespace_v1.tasknote_stg.metadata[0].name
  }
  spec {
    replicas = 1
    selector { match_labels = { app = "tasknote-stg-app" } }
    template {
      metadata { labels = { app = "tasknote-stg-app" } }
      spec {
        container {
          image = var.frontend_image
          name  = "frontend"
          port { container_port = 5000 }
          env {
            name  = "VITE_BACKEND_SERVER"
            value = "https://tasknoteapi-stg.darkroasted.vps-kinghost.net"
          }
        }
      }
    }
  }
}

resource "kubernetes_service_v1" "tasknote_stg_frontend_svc" {
  metadata {
    name      = "tasknote-stg-frontend-svc"
    namespace = kubernetes_namespace_v1.tasknote_stg.metadata[0].name
  }
  spec {
    selector = { app = "tasknote-stg-app" }
    port {
      port        = 5000
      target_port = 5000
    }
    type = "ClusterIP"
  }
}

# Unified Ingress for App and API
resource "kubernetes_ingress_v1" "tasknote_stg_ingress" {
  metadata {
    name      = "tasknote-stg-ingress"
    namespace = kubernetes_namespace_v1.tasknote_stg.metadata[0].name
    annotations = {
      "kubernetes.io/ingress.class"    = "traefik"
      "cert-manager.io/cluster-issuer" = "letsencrypt-prod"
    }
  }
  spec {
    tls {
      hosts       = ["tasknote-stg.darkroasted.vps-kinghost.net", "tasknoteapi-stg.darkroasted.vps-kinghost.net"]
      secret_name = "tasknote-stg-tls-certs"
    }
    rule {
      host = "tasknote-stg.darkroasted.vps-kinghost.net"
      http {
        path {
          path      = "/"
          path_type = "Prefix"
          backend {
            service {
              name = kubernetes_service_v1.tasknote_stg_frontend_svc.metadata[0].name
              port { number = 5000 }
            }
          }
        }
      }
    }
    rule {
      host = "tasknoteapi-stg.darkroasted.vps-kinghost.net"
      http {
        path {
          path      = "/"
          path_type = "Prefix"
          backend {
            service {
              name = kubernetes_service_v1.tasknote_stg_backend_svc.metadata[0].name
              port { number = 8585 }
            }
          }
        }
      }
    }
  }
}
