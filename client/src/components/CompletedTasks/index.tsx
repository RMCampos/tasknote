import React, { useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { AxisOptions, Chart } from 'react-charts';
import { TasksChartResponse } from '../../types/TasksChartResponse';
import api from '../../api-service/api';
import ApiConfig from '../../api-service/apiConfig';
import ChartIcon from '../../assets/chart-icon.svg';
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
        <Col xs={1} sm={2} md={1}>
          <img src={ChartIcon} alt="Chart Icon" />
        </Col>
        <Col xs={11} sm={10} md={11}>
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
