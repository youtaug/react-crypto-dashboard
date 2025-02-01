// src/components/CryptoChart.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { fetchCryptoChartData } from '../api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CryptoChart = ({ crypto }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        setLoading(true);
        const data = await fetchCryptoChartData(crypto.id, 7);
        const prices = data.prices;
        const labels = prices.map((p) => {
          const date = new Date(p[0]);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        });
        const priceData = prices.map((p) => p[1]);
        setChartData({
          labels,
          datasets: [
            {
              label: `${crypto.name} Price (USD)`,
              data: priceData,
              fill: false,
              borderColor: 'rgba(75,192,192,1)',
            },
          ],
        });
      } catch (error) {
        console.error('Error loading chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, [crypto]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {crypto.name} Price Chart (7 Days)
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : chartData ? (
          <Line data={chartData} />
        ) : (
          <Typography>No chart data available.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default CryptoChart;
