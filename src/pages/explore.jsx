import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LinearProgress } from "@mui/material";

const cards = [1, 2, 3];

const theme = createTheme();

export default function Explopre() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 8,
          pb: 2,
        }}
      >
        <Container maxWidth="md">
          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="flex-start"
          >
            <Button variant="outlined">All</Button>
            <Button variant="outlined">Ongoing</Button>
            <Button variant="outlined">Finished</Button>
          </Stack>
        </Container>
      </Box>
      <Container sx={{ py: 2 }} maxWidth="md">
        <Grid container spacing={4}>
          {cards.map((card) => (
            <Grid item key={card} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                data-testid="card"
              >
                <CardMedia
                  component="img"
                  sx={{}}
                  image="https://source.unsplash.com/random"
                  alt="random"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    title
                  </Typography>
                  <Typography>prize pool $1000</Typography>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <LinearProgress
                      sx={{ height: 10, width: "60%" }}
                      color="secondary"
                      variant="determinate"
                      value={50}
                    />
                    <Typography fontSize="10px">Apply in 30 days</Typography>
                  </Stack>
                  <Typography>ongoing</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
