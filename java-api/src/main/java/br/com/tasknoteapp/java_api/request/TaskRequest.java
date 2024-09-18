package br.com.tasknoteapp.java_api.request;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record TaskRequest(@NotNull String description, List<String> urls) {}
