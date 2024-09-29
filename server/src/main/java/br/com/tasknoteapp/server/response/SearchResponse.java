package br.com.tasknoteapp.server.response;

import java.util.List;

public record SearchResponse(List<TaskResponse> tasks, List<NoteResponse> notes) {}
