import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import {
  Avatar,
  Backdrop,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { useParams } from "react-router-dom";
import Loader from "../../../../components/site/shared/Loader";
import { miladi_be_shamsi } from "../../../../helper/shamsi";
import { toastify } from "../../../../helper/toast";

import FileImage from "../../../../assets/img/file.png";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import { DefiContext } from "../../../../context/DefiContext";

const Forum = () => {
  const { auth, user } = useAuth();
  const { id } = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [myMessage, setMyMessage] = useState([]);
  const [otherMessage, setOtherMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const { reload, setReload } = useContext(DefiContext);
  const [message, setMessage] = useState({
    title: "teat",
    show: true,
    description: "",
    file: "",
    ForumHeaderid: id,
  });
  const fileHandler = (e) => {
    setMessage({ ...message, file: e.target.files[0] });
  };
  const open = Boolean(anchorEl);
  const openHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const closeHandler = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      setPageLoader(true);
      const response = await axios.get(`forum/forumDetail/?h_id=${id}`, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      const data = await response.data;
      setPageLoader(false);
      setMyMessage(data.filter((item) => item.Userid === user.pk));
      setOtherMessage(data.filter((item) => item.Userid !== user.pk));
    };
    fetchData();
  }, [reload]);
  console.log({ myMessage, otherMessage });
  const sendHandler = async (e) => {
    e.preventDefault();
    if (message.description) {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", message.title);
      formData.append("show", message.show);
      formData.append("description", message.description);
      formData.append("file", message.file);
      formData.append("ForumHeaderid", message.ForumHeaderid);
      formData.append("Userid", user.pk);
      try {
        const response = await axios.post("forum/forumDetail/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${auth}`,
          },
        });
        setLoading(false);
        toastify("success");
        setReload((prevState) => !prevState);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    }
  };

  const deleteHandler = async (id) => {
    try {
      const response = await axios.delete("forum/forumDetail/", {
        data: [{ id }],
        headers: { Authorization: `Bearer ${auth}` },
      });
      toastify("error-login", "پیام شما حذف شد");
      setReload((prevState) => !prevState);
    } catch (err) {}
  };

  if (pageLoader)
    return (
      <Container maxWidth="lg">
        <Grid container spacing>
          <Grid
            item
            xs={12}
            sx={{
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loader />
          </Grid>
        </Grid>
      </Container>
    );

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} my={3}>
        <form onSubmit={sendHandler}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              position: "fixed",
              padding: "10px",
              borderRadius: "20px",
              boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
              bottom: 0,
              backgroundColor: "#fff",
              left: { xs: 0, md: "6rem" },
              right: { xs: 0, md: "6rem" },
              zIndex: 100,
            }}
          >
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="fileF"
              multiple
              onChange={fileHandler}
            />
            <label htmlFor="fileF">
              <Button component="span">
                <AttachFileOutlinedIcon sx={{ transform: "rotate(45deg)" }} />
              </Button>
            </label>
            <InputBase
              placeholder="پیام شما..."
              value={message.description}
              onChange={(e) =>
                setMessage({ ...message, description: e.target.value })
              }
              multiline
              sx={{ width: "100%" }}
            />
            <Button
              variant="contained"
              sx={{ boxShadow: "none", borderRadius: 3 }}
              endIcon={<NearMeOutlinedIcon />}
              type="submit"
              disabled={loading}
            >
              ارسال
            </Button>
          </Box>
        </form>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {myMessage.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Card
                  sx={{
                    boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
                    padding: 2,
                    borderRadius: "20px",
                    maxWidth: { xs: "80%", md: "60%" },
                    width: "fit-content",
                    backgroundColor: "#E5D8FF",
                  }}
                >
                  <CardHeader
                    sx={{ padding: "0 10px 10px" }}
                    avatar={<Avatar>{item.Username[0]}</Avatar>}
                    title={item.Username}
                    action={
                      <IconButton onClick={openHandler}>
                        <MoreVertIcon />
                      </IconButton>
                    }
                  />
                  {item.file && (
                    <a
                      href={`https://api.srvschool.ir${item.file}`}
                      download
                      style={{
                        display: "block",
                        padding: "10px",
                        borderRadius: "10px",
                        backgroundColor: "#fff",
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <img
                          src={FileImage}
                          alt="file"
                          style={{ maxWidth: "100%", width: "50px" }}
                        />
                        <Typography color="primary">دانلود فایل</Typography>
                      </Stack>
                    </a>
                  )}
                  <Menu
                    id="profile-menu"
                    open={open}
                    anchorEl={anchorEl}
                    onClose={closeHandler}
                    MenuListProps={{ "aria-labelledby": "profile-menu" }}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        boxShadow: "none",
                        borderRadius: 4,
                        color: "#666",
                        textAlign: "center",
                        padding: "0 1rem",
                      },
                    }}
                  >
                    <MenuItem onClick={closeHandler} color="error">
                      <Stack
                        direction="row"
                        spacing={1}
                        onClick={() => deleteHandler(item.id)}
                      >
                        <DeleteOutlineIcon color="error" />
                        <Typography color="error">حذف</Typography>
                      </Stack>
                    </MenuItem>
                  </Menu>
                  <CardContent>
                    <Typography variant="subtitle2">
                      {item.description}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Typography
                      fontFamily="iranyekanFn"
                      color="text.secondary"
                      fontSize="13px"
                    >
                      {miladi_be_shamsi(item.created_at)}
                    </Typography>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            {otherMessage.map((item) => (
              <Grid
                key={item.id}
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Card
                  sx={{
                    boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
                    padding: 2,
                    borderRadius: "20px",
                    maxWidth: { xs: "80%", md: "60%" },
                    width: "fit-content",
                  }}
                >
                  <CardHeader
                    sx={{ padding: "0 10px 10px" }}
                    avatar={<Avatar>{item.Username[0]}</Avatar>}
                    title={item.Username}
                  />
                  {item.file && (
                    <a
                      href={`https://api.srvschool.ir${item.file}`}
                      download
                      target="_blank"
                      style={{
                        display: "block",
                        padding: "10px",
                        borderRadius: "10px",
                        backgroundColor: "#fff",
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <img
                          src={FileImage}
                          alt="file"
                          style={{ maxWidth: "100%", width: "50px" }}
                        />
                        <Typography color="primary">دانلود فایل</Typography>
                      </Stack>
                    </a>
                  )}
                  <CardContent>
                    <Typography variant="subtitle2">
                      {item.description}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Typography
                      fontFamily="iranyekanFn"
                      color="text.secondary"
                      fontSize="13px"
                    >
                      {miladi_be_shamsi(item.created_at)}
                    </Typography>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Backdrop open={loading} />
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default Forum;
