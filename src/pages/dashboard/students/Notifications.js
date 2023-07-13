import React from "react";
import { Card, CardContent, Chip, Grid, Typography } from "@mui/material";
import { Container } from "@mui/system";

import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import { Box, Stack } from "@mui/system";

const Notifications = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <Typography
            component="h4"
            variant="h6"
            color="mainText"
            fontWeight={500}
          >
            پیام ها
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
              borderRadius: "30px",
              padding: 2,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Chip
                  color="secondary"
                  sx={{ color: "#fff", borderRadius: 2, lineHeight: "10px" }}
                  label={<MailOutlineRoundedIcon />}
                />
                <Typography color="mainText" ml={1}>
                  کلاس قرآنی
                </Typography>
              </Box>
              <Typography color="text.secondary" fontFamily="iranyekanFn">
                1401/5/22
              </Typography>
            </Stack>
            <CardContent>
              <Typography color="text.secondary" lineHeight={2} fontSize={15}>
                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
                استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله
                در ستون و سطرآنچنان که لازم است
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
              borderRadius: "30px",
              padding: 2,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Chip
                  color="secondary"
                  sx={{ color: "#fff", borderRadius: 2, lineHeight: "10px" }}
                  label={<MailOutlineRoundedIcon />}
                />
                <Typography color="mainText" ml={1}>
                  کلاس قرآنی
                </Typography>
              </Box>
              <Typography color="text.secondary" fontFamily="iranyekanFn">
                1401/5/22
              </Typography>
            </Stack>
            <CardContent>
              <Typography color="text.secondary" lineHeight={2} fontSize={15}>
                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
                استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله
                در ستون و سطرآنچنان که لازم است
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Notifications;
