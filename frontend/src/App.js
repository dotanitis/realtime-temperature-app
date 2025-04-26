import React, { useEffect, useState} from 'react';
import { Line } from 'react-chartjs-2'
import 'chart.js/auto'

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5001');

    ws.onopen = () => {
      console.log('✅ WebSocket Connected');
    };

    ws.onclose = () => {
      console.log('❌ WebSocket Disconnected');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setData((prevData) => [...prevData.slice(-20), message]);
      };

      return() => ws.close();
  }, []);

  const chartData = {
    labels : data.map((d) => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: data.map((d) => d.temperature),
        fill: false,
        borderColor: 'rgb(75,192,192)',
      },
    ],
  };

  return (
    <div style={{ width : "600px", margin: "50px auto"}}>
      <h1>Real Time temperature monitor</h1>
      <Line data={chartData} />
    </div>
  );
}

export default App;
