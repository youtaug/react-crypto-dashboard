// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Grid, TextField, CircularProgress } from '@mui/material';
import CryptoList from '../components/CryptoList';
import CryptoChart from '../components/CryptoChart';
import { fetchCryptoMarkets } from '../api';

const HomePage = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCryptoMarkets();
        setCryptoData(data);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectCrypto = (crypto) => {
    setSelectedCrypto(crypto);
  };

  // 検索フィルター機能
  const filteredData = cryptoData.filter((crypto) =>
    crypto.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <TextField
        label="Search Cryptocurrency"
        variant="outlined"
        fullWidth
        margin="normal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <CryptoList data={filteredData} onSelectCrypto={handleSelectCrypto} />
          </Grid>
          <Grid item xs={12} md={6}>
            {selectedCrypto ? (
              <CryptoChart crypto={selectedCrypto} />
            ) : (
              <p>Select a cryptocurrency to view its chart.</p>
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default HomePage;
