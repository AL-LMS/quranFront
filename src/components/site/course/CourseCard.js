import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import NoImage from "../../../assets/img/class1.jpeg";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const CourseCard = ({ data }) => {
  const [openModal, setOpenModal] = React.useState(false);
  const navigate = useNavigate();
  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <>
      <Card
        sx={{
          boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
          borderRadius: "5px",
          padding: 1,
        }}
      >
        <Link to={`/panel/course/details/${data?.course_id}`}>
          <CardMedia
            component="img"
            sx={{ width: "100%", borderRadius: "5px", height: "200px" }}
            alt="course"
            src={
              // data.picture1 ? `https://api.srvschool.ir${data.picture1}` : NoImage
              data.picture ? data.picture : NoImage
            }
          />
          <CardContent>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <img
                style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                src={NoImage}
              />
              <span style={{ fontSize: "12px", marginRight: "10px" }}>
                احمد اسدی
              </span>
            </div>
            <Divider style={{ marginBottom: "5px" }} />
            <Typography
              variant="body1"
              fontWeight={400}
              fontSize="15px"
              color="text"
              mb={1}
            >
              {data.name}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                variant="subtitle1"
                color={data.price ? "text.secondary" : "text"}
                fontFamily="iranyekanFn"
                fontWeight={500}
                fontSize="10px"
                sx={{
                  textDecoration: !data.price ? "line-through" : "initial",
                  color: data.price ? "#000" : "#666",
                }}
              >
                {data.explain}
              </Typography>
            </Stack>
          </CardContent>
        </Link>
        <Stack direction="row" justifyContent="space-between">
          <Button
            variant="contained"
            sx={{
              boxShadow: "none",
              borderRadius: "5px",
              padding: "10px",
            }}
            onClick={() => navigate("/panel/course/details/" + data.course_id)}
          >
            توضیحات دوره
          </Button>
          <Button
            variant="contained"
            sx={{
              boxShadow: "none",
              borderRadius: "5px",
              padding: "10px",
            }}
            onClick={() => setOpenModal(true)}
          >
            اطلاعات مربی
          </Button>
        </Stack>
      </Card>
      <Dialog
        open={openModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleClose()}
        aria-describedby="alert-dialog-slide-description"
        style={{ direction: "rtl", padding: "10px" }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", padding: "20px" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <span style={{ fontSize: "20px" }}>احمد اسدی</span>
            <img
              src={NoImage}
              style={{ width: "75px", height: "75px", borderRadius: "50%" }}
            />
          </div>
          <Divider />
          <div style={{ marginTop: "5px" }}>
            <p
              style={{
                display: "block",
                textOverflow: "ellipsis",
                wordWrap: "break-word",
                overflow: "hidden",
                maxHeight: "7em",
                lineHeight: "1.8em",
              }}
            >
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
              استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله
              در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد
              نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.
              کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان
              جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای
              طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان
              فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری
              موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد
              نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل
              دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.
            </p>
          </div>
        </div>
        <DialogActions>
          <Button onClick={() => handleClose()}>برگشت</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CourseCard;
