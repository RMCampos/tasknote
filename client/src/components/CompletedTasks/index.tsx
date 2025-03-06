import React, { useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { AxisOptions, Chart } from 'react-charts';
import { TasksChartResponse } from '../../types/TasksChartResponse';
import api from '../../api-service/api';
import ApiConfig from '../../api-service/apiConfig';
import './style.css';

type Series = {
  label: string;
  data: TasksChartResponse[];
};

function CompletedTasks(): React.ReactNode {
  const [data, setData] = useState<Series[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const primaryAxis = useMemo((): AxisOptions<TasksChartResponse> => ({
    getValue: datum => datum.day
  }), []);

  const secondaryAxes = useMemo((): AxisOptions<TasksChartResponse>[] => [{
    getValue: datum => datum.count
  }], []);

  const getChartData = async (): Promise<void> => {
    try {
      const response: TasksChartResponse[] = await api.getJSON(`${ApiConfig.homeUrl}/completed-tasks-chart`);
      const chartData: Series[] = [{
        label: 'Completed Tasks',
        data: response
      }];
      setData(chartData);
    }
    catch (error) {
      console.error('Error fetching chart data:', error);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChartData();
  }, []);

  return (
    <div className="completed-tasks">
      <Row>
        <Col xs={2}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect opacity="0.8" x="0.5" y="0.5" width="43" height="43" rx="7.5" fill="white" stroke="#C3D4E9" />
            <path d="M15.9 27H28.09C29.99 27 30.99 26 30.99 24.1V12H12.99V24.1C13 26 14 27 15.9 27Z" stroke="#222222" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 12H32" stroke="#222222" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 32L22 30V27" stroke="#222222" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M26 32L22 30" stroke="#222222" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17.5 21L20.65 18.37C20.9 18.16 21.23 18.22 21.4 18.5L22.6 20.5C22.77 20.78 23.1 20.83 23.35 20.63L26.5 18" stroke="#222222" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Col>
        <Col xs={10}>
          <div className="plus-jakarta-sans-semibold title">Completed Tasks</div>
          <span className="plus-jakarta-sans-regular description">Summary from the last 7 days</span>
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="chart-container">
          {loading
            ? <div>Loading...</div>
            : <Chart options={{ data, primaryAxis, secondaryAxes }} />}
        </Col>
      </Row>
    </div>
  );
}

export default CompletedTasks;
