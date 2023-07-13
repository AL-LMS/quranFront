import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import useAuth from "../../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import { DefiContext } from "../../../../context/DefiContext";
import Loader from "../../../../components/site/shared/Loader";
import NewExercise from "../../../../components/dashboard/students/myCourse/NewExercise";
import { ToastContainer } from "react-toastify";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

const MyExercise = () => {
  const [loading, setLoading] = useState(false);
  const { auth, user } = useAuth();
  const { cid, hid } = useParams();
  const [data, setData] = useState([]);
  const { reload } = useContext(DefiContext);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `course/coursehwAns/?s_id=${user.pk}&h_id=${hid}`,
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      );
      const data = await response.data;
      setData(data);
      setLoading(false);
    };
    fetchData();
  }, [reload]);

  if (loading)
    return (
      <Container maxWidth="lg">
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            <Loader />
          </Grid>
        </Grid>
      </Container>
    );
  console.log(data);
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} mt={3}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            component="h5"
            variant="h6"
            fontWeight={500}
            color="mainText"
          >
            تکالیف ارسالی
          </Typography>
          <NewExercise type="create" cid={cid} hid={hid} />
        </Grid>
        {data.length > 0 ? (
          <Grid item xs={12}>
            <Card
              sx={{
                boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
                borderRadius: "15px",
                padding: 2,
              }}
            >
              <List>
                {data.map((item) => (
                  <ListItem
                    key={item.id}
                    secondaryAction={
                      <Stack direction="row">
                        <Tooltip title="دانلود">
                          <a
                            href={`https://api.srvschool.ir${item.file_course}`}
                            download
                            target="_blank"
                          >
                            <Button>
                              <FileDownloadOutlinedIcon />
                            </Button>
                          </a>
                        </Tooltip>
                        <NewExercise type="edit" hid={hid} id={item.id} />
                      </Stack>
                    }
                  >
                    <ListItemText primary={item.homework_name} />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Typography textAlign="center">
              شما تکلیفی ارسال نکرده اید
            </Typography>
          </Grid>
        )}
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default MyExercise;
