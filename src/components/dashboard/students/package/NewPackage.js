import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";

import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { toastify } from "../../../../helper/toast";
import useAuth from "../../../../hooks/useAuth";
import { useContext } from "react";
import { DefiContext } from "../../../../context/DefiContext";

const NewPackage = ({ type, data }) => {
  const { auth, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(data ? data.name : "");
  const [loading, setLoading] = useState(false);
  const { setReload } = useContext(DefiContext);

  const createHandler = async (e) => {
    e.preventDefault();
    if (name) {
      try {
        setLoading(true);
        const response = await axios.post(
          "package/studentPackage",
          [{ name: name, student: user.pk }],
          {
            headers: {
              Authorization: `Bearer ${auth}`,
            },
          }
        );
        toastify("success");
        setLoading(false);
        setOpen(false);
        setReload((prevState) => !prevState);
      } catch (err) {
        setLoading(false);
        toastify("error");
      }
    } else {
      setLoading(false);
      toastify("warning", "لطفا تمامی فیلدهارا پرکنید");
    }
  };
  const editHandler = async (e) => {
    e.preventDefault();
    if (name) {
      try {
        setLoading(true);
        const response = await axios.put(
          "package/studentPackage",
          [{ id: data.id, name: name, student: user.pk }],
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
          ایجاد پکیج
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)}>
          <CreateOutlinedIcon />
        </Button>
      )}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {type === "create" ? "ایجاد پکیج" : "ویرایش پکیج"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={type === "create" ? createHandler : editHandler}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="نام پکیج"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                {type === "create" ? (
                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    disabled={loading}
                  >
                    ثبت اطلاعات
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    disabled={loading}
                  >
                    ویرایش اطلاعات
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewPackage;
