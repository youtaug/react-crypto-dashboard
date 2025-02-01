// src/components/CryptoList.js
import React from 'react';
import { List, ListItem, ListItemText, Avatar, ListItemAvatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CryptoList = ({ data, onSelectCrypto }) => {
  const navigate = useNavigate();

  const handleItemClick = (crypto) => {
    onSelectCrypto(crypto);
    // 詳細ページへ遷移
    navigate(`/crypto/${crypto.id}`);
  };

  return (
    <List>
      {data.map((crypto) => (
        <ListItem button key={crypto.id} onClick={() => handleItemClick(crypto)}>
          <ListItemAvatar>
            <Avatar src={crypto.image} alt={crypto.name} />
          </ListItemAvatar>
          <ListItemText primary={crypto.name} secondary={`$${crypto.current_price}`} />
        </ListItem>
      ))}
    </List>
  );
};

export default CryptoList;
