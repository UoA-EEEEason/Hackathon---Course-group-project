import React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../Components/theme';
import Box from '@mui/material/Box';
import HackathonList from '../../Components/HackathonList';
import { AppContext } from '../../Components/AppContextProvider';
import { useState, useEffect, useContext } from 'react';

// An array of card objects to be displayed
// const cards = [1];

// initial filter
const initialFilters = { tag: null, offset: null, status: null, username: null, role: null }

// This is the main function that returns the myEvents component
export default function MyEvents() {
  const { currentUser } = useContext(AppContext);
  const [filters, setFilters] = useState(initialFilters);
  const [haveData, setHaveData] = useState([false]);

  // add username into filter
  useEffect(() => {
    if (currentUser) {
      setFilters({ ...initialFilters, username: currentUser.email })
    }
  }, [currentUser]);

  const onDataLoaded = (data) => {
    if (data.length === 0) {
      setHaveData(false);
    } else {
      setHaveData(true);
    }
  };

  return (
    <div data-testid="MyEvents">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ mt: 10 }}>
          <HackathonList filters={filters} pagename={'myEvents'} isParticipant={true} onDataLoaded={onDataLoaded} />
        </Box>
      </ThemeProvider>
      {haveData ? (
        <div></div>
      ) : (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container sx={{ py: 2 }} maxWidth="md">
            <Box align="center">
              <img src="src\Icons\EmptyIcon.png" alt="Currently my event is empty" width="40%" height="40%" />
            </Box>
            <Typography
              align="center"
              sx={{
                fontFamily: 'Inter',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '18px',
                letterSpacing: '0.75px',
                mb: 1,
              }}
            >
              You haven't registered in any hackathon
            </Typography>
            <Typography
              align="center"
              sx={{
                fontFamily: 'Inter',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '12px',
                letterSpacing: '0.75px',
                mb: 3,
              }}
            >
              The hackathons registered by you will be shown here
            </Typography>
            <Box align="center">
              <Button
                href='/explore_hackathons'
                sx={{
                  width: '250px',
                  height: '52px',
                  background: '#FF9300',
                  textTransform: 'none',
                  borderRadius: '5px',
                  fontFamily: 'Inter',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '16px',
                  color: '#F7F7FC',
                }}
              >
                Explore Hackathons
              </Button>

            </Box>
          </Container>
        </ThemeProvider>
      )}
    </div>
  );
}