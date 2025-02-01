// src/pages/CryptoDetailsPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCryptoDetails, fetchCryptoChartData } from '../api';
import { Typography, Card, CardContent, CircularProgress, Grid } from '@mui/material';
import { Line } from 'react-chartjs-2';
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

const CryptoDetailsPage = () => {
  const { id } = useParams();
  const [cryptoDetails, setCryptoDetails] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const data = await fetchCryptoDetails(id);
        setCryptoDetails(data);
      } catch (error) {
        console.error('Error fetching crypto details:', error);
      } finally {
        setLoadingDetails(false);
      }
    };

    const loadChart = async () => {
      try {
        setLoadingChart(true);
        const data = await fetchCryptoChartData(id, 14); // 過去14日間のデータ
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
              label: `${cryptoDetails ? cryptoDetails.name : 'Crypto'} Price (USD)`,
              data: priceData,
              fill: false,
              borderColor: 'rgba(75,192,192,1)',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoadingChart(false);
      }
    };

    loadDetails();
    loadChart();
  }, [id]);

  if (loadingDetails) {
    return <CircularProgress />;
  }

  if (!cryptoDetails) {
    return <Typography variant="h6">No details available for this cryptocurrency.</Typography>;
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        {cryptoDetails.name} ({cryptoDetails.symbol.toUpperCase()})
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Market Data</Typography>
              <Typography>Current Price: ${cryptoDetails.market_data.current_price.usd.toLocaleString()}</Typography>
              <Typography>Market Cap: ${cryptoDetails.market_data.market_cap.usd.toLocaleString()}</Typography>
              <Typography>24h High: ${cryptoDetails.market_data.high_24h.usd.toLocaleString()}</Typography>
              <Typography>24h Low: ${cryptoDetails.market_data.low_24h.usd.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Price Chart (14 Days)</Typography>
              {loadingChart ? (
                <CircularProgress />
              ) : chartData ? (
                <Line data={chartData} />
              ) : (
                <Typography>No chart data available.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6">Description</Typography>
          <div dangerouslySetInnerHTML={{ __html: cryptoDetails.description.en }} />
        </CardContent>
      </Card>
    </>
  );
};

export default CryptoDetailsPage;
