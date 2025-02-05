import React, { useState, useEffect} from 'react';
import { getHackathonByFilterByHost, getHackathonByFilterByParticipant, getHackathonByTag, getHackathonByFilterExplore } from './firebase/firebaseFunction';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { LinearProgress } from '@mui/material';
import { daysDiff, hackathonPercentage } from '../hooks/dateFunctions';

// const initialFilters = { tag: null, offset: null, status: null, role: null };
// const limit = 10

// This is the main function that returns the hackathonList component
function HackathonList({ filters, pagename, isParticipant, onDataLoaded }) {
  // const [offset, setOffset] = useState(0)
  const [data, setData] = useState([]);
  useEffect(() => {
    // dashBoard function
    async function fetchDataByHostAndFilter() {
      const Data = await getHackathonByFilterByHost(filters);
      setData(Data);
      onDataLoaded(Data);
    }
    // myEvents function
    async function fetchDataByParticipant() {
      const Data = await getHackathonByFilterByParticipant(filters);
      setData(Data);
      onDataLoaded(Data);
    }
    // homePage function
    async function fetchDataByGuest() {
      const Data = await getHackathonByTag(filters);
      setData(Data);
    }
    // explore function getting hackathon that participant does not participate
    async function fetchDataForExplore() {
      const Data = await getHackathonByFilterExplore(filters);
      setData(Data);
    }

    const role = filters.role;

    if (pagename === 'myEvents') {
      fetchDataByParticipant();
      console.log('it is participant myEvents')
      console.log('filter: ', filters)
    } else if (pagename === 'explore') {
      fetchDataForExplore();
      console.log('it is participant explore')
      console.log('filter: ', filters)
    } else if (pagename === 'dashBoard') {
      fetchDataByHostAndFilter();
      console.log('it is host dashBoard')
      console.log('filter: ', filters)
    } else if (pagename === 'homePage') {
      fetchDataByGuest();
      console.log('it is participant homePage')
      console.log('filter: ', filters)
    } else {
      fetchDataByGuest();
      console.log('it is guest')
      console.log('filter: ', filters)
    }
  }, [filters, pagename]);

  return (
    <Box data-testid="hackthonList">
      <Container sx={{ py: 2 }} maxWidth="md">
        <Grid container spacing={4}>
          {data.map((card) => (
            <Grid item key={card} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: "320px",
                  display: "flex",
                  flexDirection: "column",
                  border: '1px solid #30363D',
                  borderRadius: '10px',
                }}
                data-testid="card"
              >
                {/* <CardMedia
                  component="img"
                  href={`/single_hackathon/${data.id}`}
                  sx={{}}
                  image="https://source.unsplash.com/random"
                  alt="random"
                /> */}
                {isParticipant ? (
                  <a href={`/single_hackathon/${card.id}`}>
                    <CardMedia
                      component="img"
                      // href={`/single_hackathon/${data.id}`}
                      sx={{}}
                      image="https://source.unsplash.com/random"
                      alt="random"
                    />
                  </a>) : (
                  <a href={`/host_editevent/${card.id}`}>
                    <CardMedia
                      component="img"
                      // href={`/single_hackathon/${data.id}`}
                      sx={{}}
                      image="https://source.unsplash.com/random"
                      alt="random"
                    />
                  </a>)}
                <CardContent sx={{ flexGrow: 1 }}>
                  {card && (
                    <Typography
                      sx={{
                        fontFamily: 'Inter',
                        fontStyle: 'normal',
                        fontWeight: 700,
                        fontSize: '14px',
                        color: '#FFFFFF',
                      }}
                    >
                      {card.title !== undefined ? card.title : "Title missing"}
                    </Typography>
                  )}

                  <Typography
                    sx={{
                      fontFamily: 'Inter',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      fontSize: '12px',
                      color: '#C9D1D9',
                      mb: 3
                    }}
                  >
                    {card.prizePool !== undefined
                      ? `Prize pool $ ${card.prizePool}`
                      : "prizePool missing"}
                  </Typography>

                  <Stack direction="row" alignItems="center" spacing={2}>
                    {card.status === "ongoing" ? (
                      <>
                        <LinearProgress
                          sx={{ height: 10, width: "50%" }}
                          color="secondary"
                          variant="determinate"
                          value={
                            card.startDate !== undefined &&
                              card.endDate !== undefined
                              ? hackathonPercentage(card.startDate, card.endDate)
                              : 50
                          }
                        />
                        <Typography fontSize="9px">
                          Apply in{" "}
                          {card.startDate !== undefined
                            ? daysDiff(card.startDate)
                            : "*"}{" "}
                          days
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Box sx={{ height: 10, width: "40%" }} />
                        <Typography fontSize="9px">
                          &nbsp;
                        </Typography>
                      </>
                    )}
                  </Stack>

                  <Typography
                    style={{
                      color: card.status === "ongoing" ? "#7CDD74" : "#FF6262",
                      fontFamily: 'Inter',
                      fontStyle: 'normal',
                      fontWeight: 700,
                      fontSize: '12px',
                    }}
                  >
                    {card.status !== undefined ? card.status : "status missing"}
                  </Typography>

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default HackathonList;
