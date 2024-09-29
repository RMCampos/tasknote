package br.com.tasknoteapp.server.service;

import br.com.tasknoteapp.server.response.SearchResponse;
import br.com.tasknoteapp.server.response.SummaryResponse;

/** This interface contains methods for handling user Home requests. */
public interface HomeService {

  /**
   * Get summary for the home page.
   *
   * @return SummaryResponse with data.
   */
  public SummaryResponse getSummary();

  /**
   * Search for tasks and notes.
   *
   * @param term The term to be searched for.
   * @return SearchResponse containing found both tasks and notes, if any.
   */
  public SearchResponse search(String term);
}
