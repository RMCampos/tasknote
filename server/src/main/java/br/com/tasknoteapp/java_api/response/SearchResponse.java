package br.com.tasknoteapp.java_api.response;

import java.util.List;

public record SearchResponse(List<TaskResponse> tasks, List<NoteResponse> notes) {}
