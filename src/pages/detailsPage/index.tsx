import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import Header from "../../components/header";

const DetailsPage = () => {
  const { id } = useParams(); // Get the car's ID from the URL
  const [car, setCarDetails] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/data/${id}`);
        const data = await response.json();
        setCarDetails(data.data);
      } catch (error) {
        console.error("Error fetching car details:", error);
      }
    };

    fetchCarDetails();
  }, [id]);

  if (!car) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          width: "100vw",
        }}
      >
        <CircularProgress color="secondary" />
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <div>
      {" "}
      <Header />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          width: "100vw",
        }}
      >
        <Card
          sx={{
            margin: "0 auto",
            maxWidth: "600px",
            width: "100%",
            boxShadow: 3,
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              component="div"
              gutterBottom
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              {car.Brand} {car.Model}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ textAlign: "center", mb: 2 }}
            >
              {car.BodyStyle} - Segment {car.Segment}
            </Typography>
            <Divider />
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold">
                  Acceleration (0-100 km/h):
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{car.AccelSec} sec</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold">
                  Top Speed:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{car.TopSpeed_KmH} km/h</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold">
                  Range:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{car.Range_Km} km</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold">
                  Efficiency:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  {car.Efficiency_WhKm} Wh/km
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold">
                  Fast Charging:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  {car.FastCharge_KmH} km/h
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold">
                  Rapid Charge:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{car.RapidCharge}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold">
                  Powertrain:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{car.PowerTrain}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold">
                  Plug Type:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{car.PlugType}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold">
                  Seats:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{car.Seats}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold">
                  Price:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">€{car.PriceEuro}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold">
                  Launch Date:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{car.Date}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default DetailsPage;
