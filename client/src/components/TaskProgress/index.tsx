import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { SummaryResponse } from '../../types/SummaryResponse';
import api from '../../api-service/api';
import ApiConfig from '../../api-service/apiConfig';
import CalendarIcon from '../../assets/calendar-icon.svg';
import NotesIcon from '../../assets/notes-icon.svg';
import NotesArrowIcon from '../../assets/notes-arrow-icon.svg';
import NotesCheckIcon from '../../assets/notes-check-icon.svg';
import './style.css';

/**
 * Task progress component.
 *
 * This component displays the progress of tasks.
 *
 * @returns {React.ReactNode} The task progress component.
 */
function TaskProgress(): React.ReactNode {
  const [completedTasks, setCompletedTasks] = useState<number>(0);
  const [pendingTasks, setPendingTasks] = useState<number>(0);
  const [totalNotes, setTotalNotes] = useState<number>();

  /**
   * Fetches the tasks progress.
   */
  const fetchTasksProgress = async (): Promise<void> => {
    try {
      const response: SummaryResponse = await api.getJSON(`${ApiConfig.homeUrl}/summary`);
      const { doneTaskCount } = response;
      const { pendingTaskCount } = response;
      setCompletedTasks(doneTaskCount);
      setPendingTasks(pendingTaskCount);
      setTotalNotes(response.notesCount);
    }
    catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTasksProgress();
  }, []);

  return (
    <div className="completed-tasks">
      <Row>
        <Col xs={2} sm={2} md={1}>
          <img src={CalendarIcon} alt="Calendar Icon" />
        </Col>
        <Col xs={10} sm={10} md={11}>
          <div className="plus-jakarta-sans-semibold title">Tasks</div>
          <span className="plus-jakarta-sans-regular description">Track all your progress</span>
        </Col>
      </Row>
      <Row>
        <Col className="chart-container text-center">
          <div className="task-progress total">
            <img src={NotesIcon} alt="Notes Icon" />
            <div className="tpg-text plus-jakarta-sans-regular">
              Total
              <br />
              Notes
            </div>
            <div className="tpg-value plus-jakarta-sans-semibold">{totalNotes}</div>
          </div>
        </Col>
        <Col className="chart-container text-center">
          <div className="task-progress pending">
            <img src={NotesArrowIcon} alt="Notes Arrow Icon" />
            <div className="tpg-text plus-jakarta-sans-regular">
              Pending
              <br />
              Tasks
            </div>
            <div className="tpg-value plus-jakarta-sans-semibold">{pendingTasks}</div>
          </div>
        </Col>
        <Col className="chart-container text-center">
          <div className="task-progress completed">
            <img src={NotesCheckIcon} alt="Notes Check Icon" />
            <div className="tpg-text plus-jakarta-sans-regular">
              Completed
              <br />
              Tasks
            </div>
            <div className="tpg-value plus-jakarta-sans-semibold">{completedTasks}</div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default TaskProgress;
