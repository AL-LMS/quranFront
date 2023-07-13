import React from "react";
import { Grid, Typography } from "@mui/material";
import {Container} from "@mui/system"
import DownloadCard from "../../components/site/app/DownloadCard";

//Icons
import AndroidIcon from "../../assets/img/android.svg";
import AppleIcon from "../../assets/img/apple.svg";
import WindowsIcon from "../../assets/img/windows.svg";
import Help from "../../components/site/app/Help";

const Applications = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} mt={1}>
        <Grid item xs={12} mb={6}>
          <Typography
            color="mainText"
            textAlign="center"
            component="h3"
            variant="h6"
            fontWeight={500}
          >
            اپلیکیشن های پلیر هدف
          </Typography>
          <Typography color="#999" textAlign="center" mt={1}>
            شما با دانلود و نصب اپلیکیشن هدف میتوانید بصورت نامحدود بدون مصرف
            مداوم اینترنت از آموزش های هدف استفاده کنید
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <DownloadCard
            system="android"
            peName="اندروید"
            link="https://dl.hadaf.academy/applications/hadafPlayer-v2.4.10.apk"
            icon={AndroidIcon}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <DownloadCard
            system="ios"
            peName="آی او اس"
            link="https://sibche.com/applications/hadaf-player"
            icon={AppleIcon}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <DownloadCard
            system="windows"
            peName="ویندوز"
            link="https://dl.hadaf.academy/applications/HadafAcademySetup-4.7.7.zip"
            icon={WindowsIcon}
          />
        </Grid>
        <Grid item xs={12}>
          <Help />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Applications;
