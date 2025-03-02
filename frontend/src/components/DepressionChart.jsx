import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function DepressionChart({ data }) {
  const chartRef = useRef(null); // Ref for the canvas element
  const chartInstance = useRef(null); // Ref to store the chart instance

  useEffect(() => {
    if (chartRef.current && data) {
      const ctx = chartRef.current.getContext("2d");

      // Destroy the previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create a new chart instance
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: data.map((d) => new Date(d.created_at).toLocaleDateString()),
          datasets: [
            {
              label: "Depression Severity",
              data: data.map((d) => d.score),
              borderColor: "rgba(75, 192, 192, 1)",
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    // Cleanup function to destroy the chart instance when the component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]); // Re-run the effect when `data` changes

  return <canvas ref={chartRef}></canvas>;
}