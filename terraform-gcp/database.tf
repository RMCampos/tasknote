resource "google_sql_database_instance" "instance" {
  name             = "tasknote-db-instance"
  region           = var.region
  database_version = "POSTGRES_15"

  depends_on = [
    google_service_networking_connection.private_vpc_connection,
    google_project_service.sqladmin,
    google_project_service.servicenetworking
  ]

  settings {
    tier = "db-f1-micro" # Smallest tier for dev/small app
    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.vpc_network.id
    }
  }

  deletion_protection = false # Set to true for production
}

resource "google_sql_database" "database" {
  name     = var.db_name
  instance = google_sql_database_instance.instance.name
}

resource "google_sql_user" "users" {
  name     = var.db_user
  instance = google_sql_database_instance.instance.name
  password = var.db_password
}
