import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
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
          borderRadius: "25px",
          padding: 1,
        }}
      >
        <Link to={`/panel/course/details/${data?.course_id}`}>
          <CardMedia
            component="img"
            sx={{ width: "100%", borderRadius: "20px", height: "200px" }}
            alt="course"
            src={
              // data.picture1 ? `https://api.srvschool.ir${data.picture1}` : NoImage
              data.picture ? data.picture : NoImage
            }
          />
          <CardContent>
            <img
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              src={NoImage}
            />
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
              borderRadius: "30px",
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
              borderRadius: "30px",
              padding: "10px",
            }}
            onClick={() => setOpenModal(true)}
          >
            اطلاعات مربی
          </Button>
          {/* <Chip
          label={
            <Stack direction="row" spacing={1} alignItems="center" color="#999">
              <Typography
                color="text.secondary"
                fontSize="14px"
                fontFamily="iranyekanFn"
                fontWight={400}
              >
                {data.max - data.course_sCount}
              </Typography>
              <PeopleOutlineIcon fontSize="small" />
            </Stack>
          }
        /> */}
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "20px" }}>احمد اسدی</span>
            <img
              src={NoImage}
              style={{ width: "75px", height: "75px", borderRadius: "50%" }}
            />
          </div>
          <div>
            <span>
              توضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحاتتوضیحات
            </span>
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
