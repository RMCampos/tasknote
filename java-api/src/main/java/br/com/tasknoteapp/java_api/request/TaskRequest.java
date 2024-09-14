package br.com.tasknoteapp.java_api.request;

import java.util.List;

public record TaskRequest(String description, List<String> urls) {}
