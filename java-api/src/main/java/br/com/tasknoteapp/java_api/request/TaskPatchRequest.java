package br.com.tasknoteapp.java_api.request;

import java.util.List;

public record TaskPatchRequest(String description, Boolean done, List<TaskUrlPatchRequest> urls) {}
