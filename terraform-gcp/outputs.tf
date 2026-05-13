output "backend_url" {
  value = google_cloud_run_v2_service.backend.uri
}

output "frontend_url" {
  value = google_cloud_run_v2_service.frontend.uri
}

output "cloud_sql_instance_ip" {
  value = google_sql_database_instance.instance.private_ip_address
}

output "artifact_registry_repo" {
  value = google_artifact_registry_repository.repo.name
}
