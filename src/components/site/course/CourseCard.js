import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Tooltip,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import NoImage from "../../../assets/img/class1.jpeg";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";
import { getUrl } from "../../../helper/getUrl";

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
          height: "400px",
        }}
      >
        <Link to={`/panel/course/details/${data?.course_id}`}>
          <CardMedia
            component="img"
            sx={{ width: "100%", borderRadius: "5px", height: "150px" }}
            alt="course"
            src={
              // data.picture1 ? `https://api.srvschool.ir${data.picture1}` : NoImage
              data.picture ? getUrl() + "get_file" + data.picture : NoImage
            }
          />
          <CardContent>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "5px",
                // justifyContent: "space-between"
              }}
            >
              <img
                style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                src={data.teacher_pic ? data.teacher_pic : NoImage}
              />
              <span
                style={{ color: "#000", fontSize: "12px", marginRight: "10px" }}
              >
                {data.teacher_name}
              </span>
            </div>
            <Divider style={{ marginBottom: "5px" }} />
            <Typography
              fontWeight={400}
              fontSize="15px"
              color="#000"
              height={50}
              mb={1}
            >
              {data.name}
            </Typography>
            <Stack direction="row" justifyContent="space-between" height={45}>
              <Tooltip title={data.explain}>
                <Typography
                  fontFamily="iranyekanFn"
                  fontWeight={500}
                  fontSize="10px"
                  sx={{
                    display: "-webkit-box",
                    overflow: "hidden",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 3,
                    color: "#000",
                  }}
                >
                  {data.explain}
                </Typography>
              </Tooltip>
            </Stack>
          </CardContent>
        </Link>
        <Stack direction="row" justifyContent="space-evenly">
          <Button
            variant="contained"
            sx={{
              boxShadow: "none",
              borderRadius: "5px",
              padding: "10px",
              fontSize: "12px",
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
              fontSize: "12px",
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
            <span style={{ fontSize: "20px" }}>{data.teacher_name}</span>
            <img
              src={data.teacher_pic ? data.teacher_pic : NoImage}
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
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
              {data.teacher_description}
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
