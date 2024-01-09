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
import CourseCard from "../../components/site/course/CourseCard";
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
  border-radius: 5px;
  width: 100%;
  height: 400px;
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

const data = [
  {
    course_id: 12,
    days: ["شنبه", "دوشنبه"],
    end_date: "1402-11-29",
    start_date: "1402-09-29",
    teacher_name: "علیرضا محمدی",
    teacher_user_id: 3,
    explain: "این دوره ",
    is_online: true,
    ages: 1,
    degree: 1,
    sex: 0,
    type: "قرائت",
    name: "قرائت",
    min: 1,
    max: 5,
    price: 0,
    prerequisite: [],
    start_time: "05:00:00",
    end_time: "10:00:00",
    teacher_description: "هیچ توضحی ندارم",
    teacher_pic: "",
    course_sCount: 0,
    picture: "default",
  },
  {
    course_id: 11,
    days: ["یکشنبه", "دوشنبه", "سه شنبه"],
    end_date: "1402-11-28",
    start_date: "1402-08-28",
    teacher_name: "محمدرضا قادری",
    teacher_user_id: 1,
    explain: "قرائت بایستی بتوانیم انجام دهیم.",
    is_online: false,
    ages: 2,
    degree: 1,
    sex: 0,
    type: "قرائت",
    name: "دوره تست قرائت",
    min: 1,
    max: 50,
    price: 0,
    prerequisite: [],
    start_time: "09:00:00",
    end_time: "11:00:00",
    teacher_description: "سوابق من",
    teacher_pic: "IMG_20220707_103753.jpg",
    course_sCount: 1,
    picture: "catsee.jpg",
  },
  {
    course_id: 10,
    days: ["شنبه", "دوشنبه", "چهار شنبه"],
    end_date: "1402-09-29",
    start_date: "1402-08-27",
    teacher_name: "محمدرضا قادری",
    teacher_user_id: 1,
    explain: "این دوره برای حفظ و تست می‌باشد.",
    is_online: true,
    ages: 2,
    degree: 1,
    sex: 1,
    type: "حفظ",
    name: "دوره تست حفظ",
    min: 1,
    max: 5,
    price: 0,
    prerequisite: [],
    start_time: "06:00:00",
    end_time: "08:00:00",
    teacher_description: "سوابق من",
    teacher_pic: "IMG_20220707_103753.jpg",
    course_sCount: 0,
    picture: "default",
  },
];
const HomePage = () => {
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
                <InfoText>قرآنی برای کودکان</InfoText>
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
                تنوع زیادی از پاساژهای لورم ایپسوم وجود دارد
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
                تنوع زیادی از پاساژهای لورم ایپسوم وجود دارد
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
                تنوع زیادی از پاساژهای لورم ایپسوم وجود دارد
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
              <CardTitle>مربیان آقا و خانم</CardTitle>
              <CardDescription>
                تمامی کلاس های آموزش آنلاین قرآن توسط علمای اسلامی مجرب برگزار
                می شود
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
              <CardTitle>مربیان آقا و خانم</CardTitle>
              <CardDescription>
                تمامی کلاس های آموزش آنلاین قرآن توسط علمای اسلامی مجرب برگزار
                می شود
              </CardDescription>
            </ItemCard>
            <ItemCard>
              <CardIcon>
                <CardImage src={timemanagement} />
              </CardIcon>
              <CardTitle>مربیان آقا و خانم</CardTitle>
              <CardDescription>
                تمامی کلاس های آموزش آنلاین قرآن توسط علمای اسلامی مجرب برگزار
                می شود
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
        <FooterContainer></FooterContainer>
      </Grid>
    </>
  );
};

export default HomePage;
