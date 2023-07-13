import React, { useState, useEffect, useContext } from "react";
import { DefiContext } from "../../../../context/DefiContext";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import {
  Button,
  Dialog,
  DialogTitle,
  Autocomplete,
  Grid,
  TextField,
} from "@mui/material";
import { toastify } from "../../../../helper/toast";
import { useParams } from "react-router-dom";

const NewPackageCourse = ({ data, type }) => {
  const { id } = useParams();
  const { auth } = useAuth();
  const { course, setReload } = useContext(DefiContext);
  const [open, setOpen] = useState(false);
  const [courseID, setCourseID] = useState(data ? data.courseID : "");
  const [packageID, setPackageID] = useState(+id);
  const [loading, setLoading] = useState(false);

  const closeHandler = () => {
    setOpen(false);
  };

  const createHandler = async (e) => {
    e.preventDefault();
    if (courseID) {
      try {
        setLoading(true);
        const response = await axios.post(
          "package/studentPackageCourse",
          [{ courseID: courseID.id, packageID: packageID }],
          {
            headers: {
              Authorization: `Bearer ${auth}`,
            },
          }
        );
        toastify("success", "اطلاعات با موفقیت ثبت شد");
        setLoading(false);
        setOpen(false);
        setReload((prevState) => !prevState);
      } catch (err) {
        setLoading(false);
        toastify("error", "خطا دربرقراری ارتباط با سرور");
        console.log(err);
        console.log({ courseID, packageID });
      }
    } else {
      setLoading(false);
      toastify("warning", "لطفا تمامی فیلدهارا پرکنید");
    }
  };

  return (
    <div>
      {type === "create" ? (
        <Button
          variant="contained"
          sx={{ boxShadow: "none" }}
          onClick={() => setOpen(true)}
        >
          اضافه کردن درس
        </Button>
      ) : (
        <Button
          variant="contained"
          sx={{ boxShadow: "none" }}
          onClick={() => setOpen(true)}
        >
          اضافه کردن درس
        </Button>
      )}

      <Dialog open={open} onClose={closeHandler} fullWidth maxWidth="sm">
        <DialogTitle sx={{ textAlign: "center" }}>
          اضافه کردن درس جدید به پکیج
        </DialogTitle>
        <form onSubmit={createHandler}>
          <Grid container spacing={3} padding={2}>
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                value={courseID}
                onChange={(event, newValue) => {
                  setCourseID(newValue);
                }}
                id="controllable-states-demo"
                options={course?.length > 0 ? course : ["دوره ای وجود ندارد"]}
                getOptionLabel={(option) => option.name || ""}
                renderInput={(params) => (
                  <TextField {...params} label="دوره مورد نظر" />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                sx={{ boxShadow: "none" }}
                fullWidth
                type="submit"
                disabled={loading}
              >
                ثبت اطلاعات
              </Button>
            </Grid>
          </Grid>
        </form>
      </Dialog>
    </div>
  );
};

export default NewPackageCourse;
