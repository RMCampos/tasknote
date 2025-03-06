import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { SummaryResponse } from '../../types/SummaryResponse';
import api from '../../api-service/api';
import ApiConfig from '../../api-service/apiConfig';
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
  const [totalTasks, setTotalTasks] = useState<number>();

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
      setTotalTasks(doneTaskCount + pendingTaskCount);
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
        <Col xs={2}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect opacity="0.8" x="0.5" y="0.5" width="43" height="43" rx="7.5" stroke="#C3D4E9" />
            <path d="M18 12V15" stroke="#222222" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M26 12V15" stroke="#222222" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.5 19.09H30.5" stroke="#222222" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M32 29C32 29.75 31.79 30.46 31.42 31.06C30.73 32.22 29.46 33 28 33C26.99 33 26.07 32.63 25.37 32C25.06 31.74 24.79 31.42 24.58 31.06C24.21 30.46 24 29.75 24 29C24 26.79 25.79 25 28 25C29.2 25 30.27 25.53 31 26.36C31.62 27.07 32 27.99 32 29Z" stroke="#222222" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M26.44 29L27.43 29.99L29.56 28.02" stroke="#222222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M31 18.5V26.36C30.27 25.53 29.2 25 28 25C25.79 25 24 26.79 24 29C24 29.75 24.21 30.46 24.58 31.06C24.79 31.42 25.06 31.74 25.37 32H18C14.5 32 13 30 13 27V18.5C13 15.5 14.5 13.5 18 13.5H26C29.5 13.5 31 15.5 31 18.5Z" stroke="#222222" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21.9955 23.7H22.0045" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18.2943 23.7H18.3033" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18.2943 26.7H18.3033" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Col>
        <Col xs={10}>
          <div className="plus-jakarta-sans-semibold title">Tasks</div>
          <span className="plus-jakarta-sans-regular description">Progress</span>
        </Col>
      </Row>
      <Row>
        <Col className="chart-container text-center">
          <div className="task-progress total">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12.2H15" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 16.2H12.38" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 6H14C16 6 16 5 16 4C16 2 15 2 14 2H10C9 2 8 2 8 4C8 6 9 6 10 6Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 4.02002C19.33 4.20002 21 5.43002 21 10V16C21 20 20 22 15 22H9C4 22 3 20 3 16V10C3 5.44002 4.67 4.20002 8 4.02002" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div>Total</div>
            <div>{totalTasks}</div>
          </div>
        </Col>
        <Col className="chart-container text-center">
          <div className="task-progress pending">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_b_16_4697)">
                <rect width="40" height="40" rx="8" fill="white" fillOpacity="0.2" />
                <path d="M18 14H22C24 14 24 13 24 12C24 10 23 10 22 10H18C17 10 16 10 16 12C16 14 17 14 18 14Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 30H17C12 30 11 28 11 24V18C11 13.44 12.67 12.2 16 12.02" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M24 12.02C27.33 12.2 29 13.43 29 18V23" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M23 27V24H26" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M29 30L23.04 24.04" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <defs>
                <filter id="filter0_b_16_4697" x="-6" y="-6" width="52" height="52" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feGaussianBlur in="BackgroundImageFix" stdDeviation="3" />
                  <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_16_4697" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_16_4697" result="shape" />
                </filter>
              </defs>
            </svg>
            <div>Pending</div>
            <div>{pendingTasks}</div>
          </div>
        </Col>
        <Col className="chart-container text-center">
          <div className="task-progress completed">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12.2H15" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 16.2H12.38" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 6H14C16 6 16 5 16 4C16 2 15 2 14 2H10C9 2 8 2 8 4C8 6 9 6 10 6Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 4.02002C19.33 4.20002 21 5.43002 21 10V16C21 20 20 22 15 22H9C4 22 3 20 3 16V10C3 5.44002 4.67 4.20002 8 4.02002" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div>Completed</div>
            <div>{completedTasks}</div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default TaskProgress;
