import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function DepressionChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current && data && data.length > 0) {
      const ctx = chartRef.current.getContext("2d");

      // Destroy the previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Extract data for the chart
      const dates = data.map((d) => new Date(d.created_at).toLocaleDateString());
      const scores = data.map((d) => d.score);
      
      // Set severity thresholds based on PHQ-9 scoring
      const minimalThreshold = Array(dates.length).fill(5);  // Score 0-4: Minimal
      const mildThreshold = Array(dates.length).fill(10);    // Score 5-9: Mild
      const moderateThreshold = Array(dates.length).fill(15); // Score 10-14: Moderate
      const severeThreshold = Array(dates.length).fill(20);   // Score 15-19: Moderately Severe
                                                             // Score 20-27: Severe

      // Create a new chart instance
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: dates,
          datasets: [
            // Actual scores dataset
            {
              label: "Depression Score",
              data: scores,
              borderColor: "rgba(66, 135, 245, 1)",
              backgroundColor: "rgba(66, 135, 245, 0.1)",
              fill: true,
              tension: 0.3,
              borderWidth: 3,
              pointBackgroundColor: "rgba(66, 135, 245, 1)",
              pointBorderColor: "#fff",
              pointRadius: 5,
              pointHoverRadius: 7,
            },
            // Background threshold areas (optional - uncomment if you want to show thresholds)
            /*
            {
              label: "Minimal (0-4)",
              data: minimalThreshold,
              borderColor: "rgba(75, 192, 192, 0.3)",
              borderWidth: 1,
              borderDash: [5, 5],
              pointRadius: 0,
              fill: false,
            },
            {
              label: "Mild (5-9)",
              data: mildThreshold,
              borderColor: "rgba(255, 205, 86, 0.3)",
              borderWidth: 1,
              borderDash: [5, 5],
              pointRadius: 0,
              fill: false,
            },
            {
              label: "Moderate (10-14)",
              data: moderateThreshold,
              borderColor: "rgba(255, 159, 64, 0.3)",
              borderWidth: 1,
              borderDash: [5, 5],
              pointRadius: 0,
              fill: false,
            },
            {
              label: "Severe (15+)",
              data: severeThreshold,
              borderColor: "rgba(255, 99, 132, 0.3)",
              borderWidth: 1,
              borderDash: [5, 5],
              pointRadius: 0,
              fill: false,
            },
            */
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              mode: "index",
              intersect: false,
              callbacks: {
                afterLabel: function(context) {
                  const score = context.raw;
                  let severity = "";
                  
                  if (score <= 4) severity = "Minimal depression";
                  else if (score <= 9) severity = "Mild depression";
                  else if (score <= 14) severity = "Moderate depression";
                  else if (score <= 19) severity = "Moderately severe depression";
                  else severity = "Severe depression";
                  
                  return `Severity: ${severity}`;
                }
              }
            },
            legend: {
              position: "top",
              labels: {
                usePointStyle: true,
                boxWidth: 6,
              }
            },
            title: {
              display: true,
              text: "Depression Severity Over Time",
              font: {
                size: 16,
              }
            },
            annotation: {
              annotations: {
                minimal: {
                  type: "line",
                  yMin: 5,
                  yMax: 5,
                  borderColor: "rgba(75, 192, 192, 0.5)",
                  borderWidth: 1,
                  borderDash: [5, 5],
                  label: {
                    content: "Mild",
                    enabled: true,
                    position: "end"
                  }
                },
                moderate: {
                  type: "line",
                  yMin: 10,
                  yMax: 10,
                  borderColor: "rgba(255, 205, 86, 0.5)",
                  borderWidth: 1,
                  borderDash: [5, 5],
                  label: {
                    content: "Moderate",
                    enabled: true,
                    position: "end"
                  }
                },
                severe: {
                  type: "line",
                  yMin: 15,
                  yMax: 15,
                  borderColor: "rgba(255, 99, 132, 0.5)",
                  borderWidth: 1,
                  borderDash: [5, 5],
                  label: {
                    content: "Severe",
                    enabled: true,
                    position: "end"
                  }
                },
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 27, // PHQ-9 max score
              title: {
                display: true,
                text: "PHQ-9 Score",
                font: {
                  weight: "bold"
                }
              },
              ticks: {
                callback: function(value) {
                  return value;
                }
              },
              grid: {
                color: "rgba(0, 0, 0, 0.05)"
              }
            },
            x: {
              title: {
                display: true,
                text: "Assessment Date",
                font: {
                  weight: "bold"
                }
              },
              grid: {
                display: false
              }
            }
          }
        }
      });
    } else if (chartRef.current && (!data || data.length === 0)) {
      // No data case
      const ctx = chartRef.current.getContext("2d");
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      // Draw "No data available" text
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillStyle = "#666";
      ctx.fillText("No assessment data available yet.", chartRef.current.width / 2, chartRef.current.height / 2);
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow">
      <div className="h-64">
        {!data || data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            No assessment data available yet.
          </div>
        ) : (
          <canvas ref={chartRef}></canvas>
        )}
      </div>
      {data && data.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          <div className="bg-blue-50 p-2 rounded">
            <span className="font-semibold">0-4:</span> Minimal
          </div>
          <div className="bg-green-50 p-2 rounded">
            <span className="font-semibold">5-9:</span> Mild
          </div>
          <div className="bg-yellow-50 p-2 rounded">
            <span className="font-semibold">10-14:</span> Moderate
          </div>
          <div className="bg-red-50 p-2 rounded">
            <span className="font-semibold">15+:</span> Severe
          </div>
        </div>
      )}
    </div>
  );
}
