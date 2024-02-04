import React from "react";
import { Button, Grid } from "@mui/material";
import styled from "styled-components";
import x2 from "../../assets/img/hero.jpg";
import service from "../../assets/img/service-bg.png";
import x1 from "../../assets/img/featured.png";
import quran from "../../assets/img/quran.png";
import quran1 from "../../assets/img/quran1.png";
import hand from "../../assets/img/hand.png";
import courseBG from "../../assets/img/courses_bg.png";
import iso from "../../assets/img/iso.png";
import islamic from "../../assets/img/islamic.png";
import praying from "../../assets/img/praying.png";
import timemanagement from "../../assets/img/timemanagement.png";
import schedule from "../../assets/img/scholar.png";
import training from "../../assets/img/training.png";
import footerbg from "../../assets/img/footer-bg.jpg";
import footer2bg from "../../assets/img/footer-bg_2.jpg";
import logoPic from "../../assets/img/logo.png";
import rubika from "../../assets/img/rubika.png";
import bale from "../../assets/img/bale.png";
import eitta from "../../assets/img/eitaa.png";
import aparat from "../../assets/img/aparat.png";
import CourseCard from "../../components/site/course/CourseCard";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { getUrl } from "../../helper/getUrl";
import toastify from "../../helper/toast";
const HeroContainer = styled.div`
  width: 100%;
  height: 100vh;
  image-opacity: 0.5;
  background-image: url(${x2});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const Header1 = styled.span`
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
  @media screen and (max-width: 768px) {
    font-size: 1rem;
  }
  @media screen and (max-width: 480px) {
    font-size: 1rem;
  }
`;
const Name = styled.span`
  color: #fff;
  font-size: 4rem;
  font-weight: 800;
  @media screen and (max-width: 768px) {
    font-size: 2rem;
  }
  @media screen and (max-width: 480px) {
    font-size: 2rem;
  }
`;
const Explain = styled.span`
  color: #fff;
  font-size: 1.5rem;
  width: 50%;
  text-align: center;
  margin-bottom: 1rem;
  @media screen and (max-width: 768px) {
    font-size: 0.7rem;
  }
  @media screen and (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const CardContainer = styled.div`
  background-color: #e5f3ed;
  background-image: url(${x1});
  background-position: center;
  background-repeat: repeat-x;
  border-radius: 5px;
  width: 98%;
  height: 200px;
  margin-top: -120px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 768px) {
    height: 400px;
    background-repeat: repeat-y;
  }
  @media screen and (max-width: 480px) {
    height: 400px;
    background-repeat: repeat-y;
  }
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
  width: 100%;
`;
const Item = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  @media screen and (max-width: 768px) {
    margin-bottom: 1rem;
  }
  @media screen and (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;
const Icon = styled.div`
  border-radius: 50%;
  background-color: #cb9f41;
  border: 1px solid #000;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const IconImage = styled.img`
  width: 64px;
  height: 64px;
`;
const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 15px;
  @media screen and (max-width: 768px) {
    margin-right: 10px;
  }
  @media screen and (max-width: 480px) {
    margin-right: 10px;
  }
`;
const InfoName = styled.span`
  color: #000;
  font-size: 1rem;
  text-align: right;
  @media screen and (max-width: 768px) {
    font-size: 0.7rem;
  }
  @media screen and (max-width: 480px) {
    font-size: 0.7rem;
  }
`;
const InfoText = styled.span`
  color: #000;
  font-size: 1rem;
  text-align: right;
  @media screen and (max-width: 768px) {
    font-size: 0.7rem;
  }
  @media screen and (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const ServiceContainer = styled.div`
  background-color: rgb(18, 29, 24);
  background-image: url(${service});
  // background-repeat: no-repeat;
  background-size: cover;
  border-radius: 5px;
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 70px 120px 100px;
  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
    flex-direction: row;
    padding: 20px;
    height: auto;
    background-position: center center;
  }
  @media screen and (max-width: 480px) {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 20px;
    height: auto;
    background-position: center center;
  }
`;

const ServiceHeader = styled.h2`
  color: #fff;
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
`;
const ServiceCards = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  @media screen and (max-width: 768px) {
  }
  @media screen and (max-width: 480px) {
  }
`;

const ServiceCard = styled.div`
  width: 25%;
  display: flex;
  background-color: #fff;
  border-radius: 5px;
  background-image: url(${schedule});
  padding: 20px;
  min-height: 270px;
  flex-direction: column;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
  @media screen and (max-width: 768px) {
    width: 100%;
    margin-bottom: 30px;
  }
  @media screen and (max-width: 480px) {
    width: 100%;
    margin-bottom: 30px;
  }
`;

const ServiceCardHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
`;
const ServiceCardTitle = styled.span`
  text-align: center;
`;
const ServiceCardBody = styled.span`
  text-align: center;
  margin-top: 50px;
`;

const WhyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0;
`;
const WhyTitle = styled.h1`
  color: #000;
  text-align: center;
`;

const WhyCards = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
  }
  @media screen and (max-width: 480px) {
    flex-wrap: wrap;
  }
`;

const ItemCard = styled.div`
  border: 1px solid #000;
  border-radius: 10px;
  width: 20%;
  height: 300px;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  @media screen and (max-width: 768px) {
    width: 85%;
    height: 250px;
    margin-bottom: 15px;
  }
  @media screen and (max-width: 480px) {
    width: 85%;
    height: 250px;
    margin-bottom: 15px;
  }
`;

const CardIcon = styled.div`
  border-radius: 50%;
  background-color: #cb9f41;
  border: 1px solid #000;
  width: 75px;
  height: 75px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CardImage = styled.img`
  width: 40px;
  height: 40px;
`;

const CardTitle = styled.span`
  font-size: 1.5rem;
  color: #000;
`;

const CardDescription = styled.span`
  font-size: 0.75rem;
  color: #000;
  text-align: center;
`;

const CourseContainer = styled.div`
  background-color: rgb(250, 248, 243);
  background-image: url(${courseBG});
  background-size: cover;
  border-radius: 5px;
  width: 100%;
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 70px 120px 100px;
  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
    flex-direction: row;
    padding: 20px;
    height: auto;
    background-position: center center;
  }
  @media screen and (max-width: 480px) {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 20px;
    height: auto;
    background-position: center center;
  }
`;
const CourseHeader = styled.h2`
  color: #000;
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
`;

const CourseCards = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: wrap;
  align-items: center;
  width: 75%;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;

const FooterContainer = styled.div`
  background-color: rgb(250, 248, 243);
  background-image: url(${footerbg});
  background-size: cover;
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 70px 120px 100px;
  direction: ltr;
  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: auto;
    padding: 0px;
    background-position: center center;
  }
  @media screen and (max-width: 480px) {
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    height: auto;
    padding: 0px;
    background-position: center center;
  }
`;
const FooterFirstSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 25%;
  @media screen and (max-width: 768px) {
    margin-top: 30px;
    width: 75%;
  }
  @media screen and (max-width: 480px) {
    margin-top: 30px;
    width: 75%;
  }
`;
const FooterInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;
const Hr = styled.hr`
  width: 100%;
  color: #344e46;
  margin-top: 20px;
  margin-bottom: 20px;
`;
const Image = styled.img`
  width: 85px;
  height: 85px;
  border-radius: 50%;
  @media screen and (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
  @media screen and (max-width: 480px) {
    width: 75px;
    height: 75px;
  }
`;
const FooterAddress = styled.span`
  font-size: 16px;
  margin-bottom: 10px;
  color: #fff;
`;
const FooterPhone = styled.span`
  font-size: 14px;
  color: #fff;
`;
const FooterSocialMedia = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  width: 100%;
`;
const A = styled.a`
  background-color: #344e46;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: "pointer";
`;
const I = styled.img`
  width: 50%;
  height: 50%;
`;
const FooterSecondSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 768px) {
    margin-top: 20px;
  }
  @media screen and (max-width: 480px) {
    margin-top: 20px;
  }
`;
const FooterTitle = styled.span`
  font-size: 26px;
  font-weight: bold;
  color: #fff;
  @media screen and (max-width: 768px) {
    font-size: 24px;
  }
  @media screen and (max-width: 480px) {
    font-size: 24px;
  }
`;
const FooterLinks = styled.a`
  font-size: 16px;
  color: #fff;
  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
  @media screen and (max-width: 480px) {
    font-size: 14px;
  }
`;
const Footer2Container = styled.div`
  background-color: rgb(250, 248, 243);
  background-image: url(${footer2bg});
  background-size: cover;
  width: 100%;
  height: 70px;
  align-items: center;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  direction: rtl;
  @media screen and (max-width: 768px) {
    height: auto;
    padding: 0px;
    background-position: center center;
  }
  @media screen and (max-width: 480px) {
    height: auto;
    padding: 0px;
    background-position: center center;
  }
`;
const FooterPv = styled.span`
  font-size: 16px;
  color: #fff;
  text-align: center;
  margin-right: 20px;
  width: 100%;
  @media screen and (max-width: 768px) {
    font-size: 14px;
    margin-right: 0px;
  }
  @media screen and (max-width: 480px) {
    font-size: 14px;
    margin-right: 0px;
  }
`;
const HomePage = () => {
  const [data, setData] = useState([]);
  const get_courses = async () => {
    let data = {
      table: "courses",
      method_type: "get_courses",
      data: {
        query: {},
        from: 0,
        to: 3,
      },
    };
    let response = await axios({
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      data: {
        ...data,
      },

      baseURL: getUrl() + "back_request/select_request/",
    });
    if (response?.data?.tracking_code !== null) {
      setData(response?.data?.response?.all_course);
    } else {
      toastify("error-login", response?.data?.error);
    }
  };
  useEffect(() => {
    get_courses().then(() => {});
  }, []);
  return (
    <>
      <Grid item xs={12} mt={5}>
        <HeroContainer>
          <Header1>اولین مدرسه قرآنی آنلاین</Header1>
          <Name>مدرسه قرآنی آنلاین</Name>
          <Explain>
            دارالقرآن نیک‌اندیشان، یک مدرسه قرآنی آنلاین آموزشی دارای گواهی ISO
            با استانداردهای بین المللی است
          </Explain>
          <Button variant="contained">اطلاعات بیشتر</Button>
        </HeroContainer>
      </Grid>
      <Grid item xs={12} mt={5} display={"flex"} justifyContent={"center"}>
        <CardContainer>
          <ItemContainer>
            <Item>
              <Icon>
                <IconImage src={quran} />
              </Icon>
              <Info>
                <InfoName>آموزش سریع</InfoName>
                <InfoText>کلاس‌های قرآن</InfoText>
              </Info>
            </Item>
            <Item>
              <Icon>
                <IconImage src={iso} />
              </Icon>
              <Info>
                <InfoName>گواهینامه ISO</InfoName>
                <InfoText>برای موسسه قرآنی</InfoText>
              </Info>
            </Item>
            <Item>
              <Icon>
                <IconImage src={islamic} />
              </Icon>
              <Info>
                <InfoName>کلاس‌های آنلاین</InfoName>
                <InfoText>قرآنی برای تمامی سنین</InfoText>
              </Info>
            </Item>
          </ItemContainer>
        </CardContainer>
      </Grid>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}>
        <ServiceContainer>
          <ServiceHeader>
            خدماتی که دارالقرآن نیک‌اندیشان ارائه می‌دهد
          </ServiceHeader>
          <ServiceCards>
            <ServiceCard>
              <ServiceCardHeader>
                <CardIcon>
                  <CardImage src={quran} />
                </CardIcon>
                <ServiceCardTitle>دوره‌های حفظ</ServiceCardTitle>
              </ServiceCardHeader>
              <ServiceCardBody>
                دوره آموزشهای تکمیلی مخصوص افرادی برگزار می شود که حفظ قرآن خود
                را به پایان رسانده اند و در عین حال نیاز به کسب مهارتهای جدید در
                زمینه حفظ قرآن دارند .{" "}
              </ServiceCardBody>
            </ServiceCard>
            <ServiceCard>
              <ServiceCardHeader>
                <CardIcon>
                  <CardImage src={hand} />
                </CardIcon>
                <ServiceCardTitle>دوره‌های تفسیر</ServiceCardTitle>
              </ServiceCardHeader>
              <ServiceCardBody>
                تفسیر قرآن یکی از مهم‌ترین شاخه‌های علوم و معارف قرآنی است که
                پرده‌های ابهام را از چهره الفاظ و عبارات نورانی قرآن کریم
                برمی‌دارد و زمینه‌های فهم و تدبر بیشتر را فراهم سازد.
              </ServiceCardBody>
            </ServiceCard>
            <ServiceCard>
              <ServiceCardHeader>
                <CardIcon>
                  <CardImage src={quran1} />
                </CardIcon>
                <ServiceCardTitle>دوره‌های ترتیل</ServiceCardTitle>
              </ServiceCardHeader>
              <ServiceCardBody>
                دوره روخوانی و روانخوانی اولین مرحله یادگیری قرآن کریم می باشد و
                در عین حال پیش نیاز آموزشی سطوح بالاتر محسوب می شود.
              </ServiceCardBody>
            </ServiceCard>
          </ServiceCards>
        </ServiceContainer>
      </Grid>
      <Grid item xs={12}>
        <WhyContainer>
          <WhyTitle>چرا موسسه قرآنی دارالقرآن نیک‌اندیشان</WhyTitle>
          <WhyCards>
            <ItemCard>
              <CardIcon>
                <CardImage src={quran} />
              </CardIcon>
              <CardTitle>کلاس‌های قرآن</CardTitle>
              <CardDescription>
                با کلاس‌های غنی قرآن ما سفر تحول آفرین رشد معنوی را آغاز کنید.
              </CardDescription>
            </ItemCard>
            <ItemCard>
              <CardIcon>
                <CardImage src={praying} />
              </CardIcon>
              <CardTitle>مربیان آقا و خانم</CardTitle>
              <CardDescription>
                تمامی کلاس های آموزش آنلاین قرآن توسط علمای اسلامی مجرب برگزار
                می شود
              </CardDescription>
            </ItemCard>
            <ItemCard>
              <CardIcon>
                <CardImage src={training} />
              </CardIcon>
              <CardTitle>بهترین آموزش آنلاین</CardTitle>
              <CardDescription>
                مربیان متخصص قرآنی برای همه اعضای خانواده. تمامی مربیان ما
                مدارکی از دانشگاه و مراکز برتر اسلامی دارا هستند.
              </CardDescription>
            </ItemCard>
            <ItemCard>
              <CardIcon>
                <CardImage src={timemanagement} />
              </CardIcon>
              <CardTitle>زمانبندی منعطف</CardTitle>
              <CardDescription>
                ما در دارالقرآن نیک‌اندیشان به زما شما بسیار اهمیت می‌دهیم،
                بنابراین به قرآن آموز این اجازه را می‌دهیمکه زمان یادگییری مناسب
                را برای خود تعیین کند.
              </CardDescription>
            </ItemCard>
          </WhyCards>
        </WhyContainer>
        <CourseContainer>
          <CourseHeader>دوره‌های قرآنی</CourseHeader>
          <CourseCards>
            <Grid container spacing={3}>
              {data.map((course) => (
                <Grid item xs={12} md={4} key={course.id}>
                  <CourseCard data={course} />
                </Grid>
              ))}
            </Grid>
          </CourseCards>
        </CourseContainer>
      </Grid>
      <Grid item xs={12}>
        <FooterContainer>
          <FooterFirstSection>
            <Image src={logoPic} alt="دارالقرآن نیک‌اندیشان" />
            <Hr />
            <FooterInfo>
              <FooterAddress style={{ direction: "rtl" }}>
                دارالقرآن نیک‌اندیشان بستری قرآنی است که محیطی مبتنی بر فناوری
                اطلاعات و ارتباطات، آموزش الکترونیکی و آموزش یکپارچه را فراهم می
                کند. این به شما و فرزندتان کمک می کند تا مبانی اسلام، تجوید و
                عربی را نزد دانشمندان و متخصصان برتر بیاموزید.
              </FooterAddress>
            </FooterInfo>
          </FooterFirstSection>
          {/* <FooterSecondSection>
            <FooterTitle>لینک‌ها</FooterTitle>
            <FooterLinks>درباره ما</FooterLinks>
            <FooterLinks>ارتباط با ما</FooterLinks>
            <FooterLinks>آخرین آخبار</FooterLinks>
          </FooterSecondSection> */}
          <FooterSecondSection>
            <FooterTitle>دیگر لینک‌ها</FooterTitle>
            <Hr />
            <FooterInfo>
              <FooterAddress>
                تهران-خیابان انقلاب-دکتر قریب-پلاک 18
              </FooterAddress>
              <FooterPhone>(+98)21-55555555</FooterPhone>
              <FooterSocialMedia>
                <A href="">
                  <I src={bale} alt="bale" />
                </A>
                <A href="">
                  <I src={eitta} alt="eitta" />
                </A>
                <A href="">
                  <I src={rubika} alt="rubika" />
                </A>
                <A href="">
                  <I src={aparat} alt="aparat" />
                </A>
              </FooterSocialMedia>
            </FooterInfo>
          </FooterSecondSection>
        </FooterContainer>
        <Footer2Container>
          <FooterPv>
            تمام حقوق مادی و معنوی این وبسایت متعلق به دارالقرآن نیک‌اندیشان
            است.
          </FooterPv>
        </Footer2Container>
      </Grid>
    </>
  );
};

export default HomePage;
