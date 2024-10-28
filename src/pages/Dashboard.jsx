import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents } from '../redux/studentSlice';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const dispatch = useDispatch();
  const students = useSelector((state) => state.students.list);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const totalStudents = students.length;

  const studentsPerClass = students.reduce((acc, student) => {
    acc[student.class] = (acc[student.class] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(studentsPerClass),
    datasets: [
      {
        label: 'Number of Students',
        data: Object.values(studentsPerClass),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content container mt-5">
        <h1 className="dashboard-title">DASHBOARD</h1>
        <div className="total-students-box mb-4 p-3 rounded">
          <h5>Total Students: {totalStudents}</h5>
        </div>
        <div className="chart-container">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true, position: 'top' },
                title: { display: true, text: 'Students per Class' },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  min: 0,
                  max: 22, 
                  ticks: {
                    stepSize: 2, 
                  },
              },
            },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
