resource "google_artifact_registry_repository" "repo" {
  location      = var.region
  repository_id = "tasknote-repo"
  description   = "Docker repository for TaskNote images"
  format        = "DOCKER"
  depends_on    = [google_project_service.artifactregistry]
}
