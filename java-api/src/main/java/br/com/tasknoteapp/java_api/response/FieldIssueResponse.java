package br.com.tasknoteapp.java_api.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "An object with fields name and the respective error massages")
record FieldIssueResponse(String fieldName, String fieldMessage) {}
