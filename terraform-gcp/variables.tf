variable "project_id" {
  type        = string
  description = "The GCP Project ID"
}

variable "region" {
  type        = string
  default     = "us-central1"
  description = "The GCP region to deploy resources"
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
  default   = "tasknote"
}

variable "security_key" {
  type      = string
  sensitive = true
}

variable "mailgun_apikey" {
  type      = string
  sensitive = true
}

variable "backend_image" {
  type    = string
  default = "ghcr.io/rmcampos/tasknote/api:latest"
}

variable "frontend_image" {
  type    = string
  default = "ghcr.io/rmcampos/tasknote/app:latest"
}

variable "cors_allowed_origins" {
  type    = string
  default = "*"
}
