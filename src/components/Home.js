import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Welcome to the App</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/kanban')}
        style={{ marginRight: 8 }}
      >
        Go to Kanban
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate('/login')}
      >
        Go to Sign In
      </Button>
    </Container>
  );
}

export default Home;
