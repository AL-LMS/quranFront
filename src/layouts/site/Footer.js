import React, { useContext } from "react";
import { DefiContext } from "../../context/DefiContext";
import { Link } from "react-router-dom";
import { Grid, Stack, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";

//Icons
import Telegram from "../../assets/img/telegram.svg";
import Instagram from "../../assets/img/instagram.svg";
import WhatsApp from "../../assets/img/whatsapp.svg";
import Aparat from "../../assets/img/aparat.svg";
import Android from "../../assets/img/androidDl.png";
import Ios from "../../assets/img/iosDl.png";
import Windows from "../../assets/img/windowsDl.png";
import ZarinPal from "../../assets/img/zarinpal.png";

const Footer = () => {
  const { gradeID } = useContext(DefiContext);
  return (
    <Box component="footer" mt={8}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={6} md={3}>
            <Typography
              color="text"
              variant="h6"
              fontSize="1rem"
              fontWeight={500}
              mb={2}
            >
              خدمات مشتریان
            </Typography>
            <Stack spacing={1}>
              <Link to="/panel/dashboard">
                <Typography
                  component="span"
                  color="mainText"
                  fontSize="0.85rem"
                >
                  ثبت نام
                </Typography>
              </Link>
              <Link to="/panel/dashboard">
                <Typography
                  component="span"
                  color="mainText"
                  fontSize="0.85rem"
                >
                  پنل کاربری
                </Typography>
              </Link>
              <Link to="/course">
                <Typography
                  component="span"
                  color="mainText"
                  fontSize="0.85rem"
                >
                  خرید دوره
                </Typography>
              </Link>
              <Link to="/packages">
                <Typography
                  component="span"
                  color="mainText"
                  fontSize="0.85rem"
                >
                  پکیج های آموزشی
                </Typography>
              </Link>
              <Link to="/FAQ">
                <Typography
                  component="span"
                  color="mainText"
                  fontSize="0.85rem"
                >
                  سوالات متداول
                </Typography>
              </Link>
            </Stack>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography
              color="text"
              variant="h6"
              fontSize="1rem"
              fontWeight={500}
              mb={2}
            >
              دسته بندی ها
            </Typography>
            <Stack spacing={1}>
              {gradeID?.map((item) => (
                <Link key={item.id} to={`/course?page=1&grade=${item.id}`}>
                  <Typography
                    component="span"
                    color="mainText"
                    fontSize="0.85rem"
                  >
                    {item.name}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              color="text"
              variant="h6"
              fontSize="1rem"
              fontWeight={500}
              mb={2}
            >
              با ما همراه باشید
            </Typography>
            <Stack direction="row" spacing={2}>
              <a
                href="https://t.me/konkoorehadaf"
                target="_blank"
                rel="noreferrer"
                style={{ width: "50%" }}
              >
                <Box
                  component="div"
                  sx={{
                    padding: "1rem 2rem",
                    borderRadius: "10px",
                    textAlign: "center",
                    background: "linear-gradient(120deg,#08c,#5dc9ff)",
                    boxShadow: "0 3px 30px rgb(5 190 255 / 22%)",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <img
                      src={Telegram}
                      alt="telegram"
                      style={{ maxWidth: "100%" }}
                    />
                    <Typography variant="body1" fontWeight={400} color="#fff">
                      تلگرام دارالقرآن
                    </Typography>
                  </Stack>
                </Box>
              </a>
              <a
                href="https://www.instagram.com/konkoorehadaf/"
                target="_blank"
                rel="noreferrer"
                style={{ width: "50%" }}
              >
                <Box
                  component="div"
                  sx={{
                    padding: "1rem 2rem",
                    borderRadius: "10px",
                    textAlign: "center",
                    background:
                      "linear-gradient(90deg,#833ab4,#fd1d1d,#fcb045)",
                    boxShadow: "0 3px 30px rgb(224 10 74 / 22%)",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <img
                      src={Instagram}
                      alt="instagram"
                      style={{ maxWidth: "100%" }}
                    />
                    <Typography variant="body1" fontWeight={400} color="#fff">
                      اینستاگرام دارالقرآن
                    </Typography>
                  </Stack>
                </Box>
              </a>
            </Stack>
            <Stack direction="row" spacing={2} mt={2}>
              <a
                href="https://www.aparat.com/konkoorehadaf"
                target="_blank"
                rel="noreferrer"
                style={{ width: "50%" }}
              >
                <Box
                  component="div"
                  sx={{
                    padding: "1rem 2rem",
                    borderRadius: "10px",
                    textAlign: "center",
                    background: "linear-gradient(120deg,#ff0084,#33001b)",
                    boxShadow: "0 3px 30px #ff008466",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <img
                      src={Aparat}
                      alt="telegram"
                      style={{ maxWidth: "100%", width: "28px" }}
                    />
                    <Typography variant="body1" fontWeight={400} color="#fff">
                      آپارات دارالقرآن
                    </Typography>
                  </Stack>
                </Box>
              </a>
              <a
                href="https://www.instagram.com/konkoorehadaf/"
                target="_blank"
                rel="noreferrer"
                style={{ width: "50%" }}
              >
                <Box
                  component="div"
                  sx={{
                    padding: "1rem 2rem",
                    borderRadius: "10px",
                    textAlign: "center",
                    background: "linear-gradient(120deg,#56ab2f,#a8e063)",
                    boxShadow: "0 3px 30px rgb(34 255 5 / 22%)",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <img
                      src={WhatsApp}
                      alt="instagram"
                      style={{ maxWidth: "100%" }}
                    />
                    <Typography variant="body1" fontWeight={400} color="#fff">
                      واتساپ دارالقرآن
                    </Typography>
                  </Stack>
                </Box>
              </a>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Box
              component="div"
              sx={{
                padding: "1rem",
                background: "#F3E6FF",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Typography
                variant="h6"
                fontWeight={500}
                fontSize="17px"
                color="primary"
                sx={{ marginBottom: { md: 0, xs: 2 } }}
              >
                اپلیکیشن دارالقرآن
              </Typography>
              <Stack
                spacing={1}
                alignItems="center"
                sx={{ flexDirection: { xs: "column", md: "row" } }}
              >
                <a
                  href="https://dl.hadaf.academy/applications/hadafPlayer-v2.4.10.apk"
                  download
                  style={{ marginTop: 0 }}
                >
                  <img
                    src={Android}
                    alt="Android"
                    style={{
                      maxWidth: "100%",
                      width: "220px",
                      borderRadius: "10px",
                      boxShadow: "0 5px 20px rgba(112,112,112,0.2)",
                    }}
                  />
                </a>
                <a
                  href="https://sibche.com/applications/hadaf-player"
                  download
                  style={{ margin: "0 10px" }}
                >
                  <img
                    src={Ios}
                    alt="Ios"
                    style={{
                      maxWidth: "100%",
                      width: "220px",
                      borderRadius: "10px",
                      boxShadow: "0 5px 20px rgba(112,112,112,0.2)",
                    }}
                  />
                </a>
                <a
                  href="https://dl.hadaf.academy/applications/HadafAcademySetup-4.7.7.zip"
                  download
                  style={{ marginTop: 0 }}
                >
                  <img
                    src={Windows}
                    alt="Windows"
                    style={{
                      maxWidth: "100%",
                      width: "220px",
                      borderRadius: "10px",
                      boxShadow: "0 5px 20px rgba(112,112,112,0.2)",
                    }}
                  />
                </a>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} md={10}>
            <Box
              sx={{
                borderRadius: "10px",
                padding: 2,
                backgroundColor: "#F3E6FF",
              }}
            >
              <Typography
                color="text"
                variant="h6"
                fontSize="1rem"
                fontWeight={500}
                mb={2}
              >
                پشتیبانی
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Stack spacing={1}>
                    <Typography
                      color="text"
                      variant="h6"
                      fontSize="1rem"
                      fontWeight={500}
                    >
                      شماره تماس:
                    </Typography>
                    <Typography
                      component="span"
                      color="mainText"
                      fontSize="0.85rem"
                      fontFamily="iranyekanFn"
                      fontWeight={400}
                    >
                      021-88779962
                    </Typography>
                    <Typography
                      component="span"
                      color="mainText"
                      fontSize="0.85rem"
                      fontFamily="iranyekanFn"
                      fontWeight={400}
                    >
                      021-88873252
                    </Typography>
                    <Typography
                      component="span"
                      color="mainText"
                      fontSize="0.85rem"
                      fontFamily="iranyekanFn"
                      fontWeight={400}
                    >
                      021-88772917
                    </Typography>
                    <Typography
                      component="span"
                      color="mainText"
                      fontSize="0.85rem"
                      fontFamily="iranyekanFn"
                      fontWeight={400}
                    >
                      021-88773994
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <Typography
                      color="text"
                      variant="h6"
                      fontSize="1rem"
                      fontWeight={500}
                    >
                      آدرس:
                    </Typography>
                    <Typography
                      component="span"
                      color="mainText"
                      fontSize="0.85rem"
                      fontFamily="iranyekanFn"
                      fontWeight={400}
                    >
                      آدرس دفتر مرکزی و ثبت نام: تهران : میدان ونک خیابان ونک
                      نسیده به اتوبان کردستان مجتمع آینه ونک طبقه اول واحد۱۰۴
                    </Typography>
                    <Typography
                      component="span"
                      color="mainText"
                      fontSize="0.85rem"
                      fontFamily="iranyekanFn"
                      fontWeight={400}
                    >
                      آدرس آموزشگاه دختران : تهران . خیابان ولیعصر نرسیده به
                      میدان ونک روبروی گاندی ۱۲ ( جنب مجتمع خورشید ) پلاک ۲۵۳۴
                    </Typography>
                    <Typography
                      component="span"
                      color="mainText"
                      fontSize="0.85rem"
                      fontFamily="iranyekanFn"
                      fontWeight={400}
                    >
                      آدرس آموزشگاه پسران: خیابان میرداماد ضلع شمالی میدان مادر
                      خیابان سنجابی (بهروز سابق)
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography
                    color="text"
                    variant="h6"
                    fontSize="1rem"
                    fontWeight={500}
                    mb={1}
                  >
                    پست الکترونیکی:
                  </Typography>
                  <Typography
                    component="span"
                    color="mainText"
                    fontSize="0.85rem"
                    fontFamily="iranyekanFn"
                    fontWeight={400}
                  >
                    konkoorehadaf@gmail.com
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box
              sx={{
                borderRadius: "10px",
                padding: 2,
                backgroundColor: "#F3E6FF",
                height: "100%",
              }}
            >
              <Typography
                color="text"
                variant="h6"
                fontSize="1rem"
                fontWeight={500}
                mb={2}
              >
                پرداخت امن
              </Typography>
              <a
                href="https://www.zarinpal.com/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={ZarinPal}
                  alt="zarinpal"
                  style={{ maxWidth: "100%", width: "120px" }}
                />
              </a>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
