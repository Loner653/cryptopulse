"use client";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

export default function CryptoChart() {
  const [prices, setPrices] = useState([]);
  const [timestamps, setTimestamps] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrices((prev) => [...prev.slice(-20), parseFloat(data.p)]); // Keep last 20 prices
      setTimestamps((prev) => [...prev.slice(-20), new Date().toLocaleTimeString()]);
    };

    return () => ws.close(); // Cleanup WebSocket on unmount
  }, []);

  const chartData = {
    labels: timestamps,
    datasets: [
      {
        label: "BTC/USDT Price",
        data: prices,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true } },
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
