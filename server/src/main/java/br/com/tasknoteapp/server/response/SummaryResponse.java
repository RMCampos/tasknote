package br.com.tasknoteapp.server.response;

public record SummaryResponse(Integer pendingTaskCount, Integer doneTaskCount) {}
