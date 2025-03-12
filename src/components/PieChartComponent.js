import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartComponent = () => {
  const [chartData, setChartData] = useState({ labels: [], values: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ API Se Data Fetch Karna
    fetch(
      "https://toolbox.boomlive.in/api_project/indiaspendtemp.php?pulljson=true"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response:", data); // Debugging ke liye console log

        // ✅ API Se Aaye Data Ko Set Karna
        setChartData({
          labels: data.labels || [], // API response se labels lena
          values: data.values || [], // API response se values lena
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching chart data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading chart...</p>;

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.values,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return <Pie data={data} />;
};

export default PieChartComponent;
