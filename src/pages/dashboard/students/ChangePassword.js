import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Grid, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { authPass } from "../../../auth/changePassword";

import { toastify } from "../../../helper/toast";
import { ToastContainer } from "react-toastify";
import useAuth from "../../../hooks/useAuth";

const ChangePassword = () => {
  const { auth, user } = useAuth();
  const [form, setForm] = useState({
    old_password: "",
    password: "",
    repetition_pass: "",
  });
  const [errors, setErros] = useState({});

  useEffect(() => {
    setErros(authPass(form));
  }, [form]);

  const changePasswordHandler = async () => {
    if (!Object.keys(errors).length) {
      try {
        const response = await axios.post(
          `authen/change_password/`,
          { id: user.pk, old: form.old_password, password: form.password },
          {
            headers: { Authorization: `Bearer ${auth}` },
          }
        );
        toastify("success-login", "رمز عبور تغییر کرد");
      } catch (err) {
        if (err.response.status === 400) {
          toastify("error-login", "رمز عبور قبلی صحیح نیست");
        } else {
          toastify("error", "خطا دربرقراری ارتباط با سرور");
        }
      }
    } else {
      toastify("warning", "لطفا فیلدهارا با دقت پرکنید");
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={4} sx={{ margin: "0 auto" }}>
          <Card
            sx={{
              boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
              padding: 2,
              borderRadius: 3,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  component="h6"
                  variant="h6"
                  textAlign="center"
                  color="mainText"
                  fontWeight={500}
                >
                  تغییر رمز عبور
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="رمزعبور قدیمی"
                  value={form.old_password}
                  onChange={(e) =>
                    setForm({ form, old_password: e.target.value })
                  }
                  size="small"
                  fullWidth
                  variant="filled"
                  sx={{ borderRadius: "40px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="رمزعبور جدید"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  size="small"
                  fullWidth
                  variant="filled"
                  sx={{ borderRadius: "40px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="تکرار رمزعبور جدید"
                  value={form.repetition_pass}
                  onChange={(e) =>
                    setForm({ ...form, repetition_pass: e.target.value })
                  }
                  size="small"
                  fullWidth
                  helperText={errors.repetition_pass && errors.repetition_pass}
                  variant="filled"
                  sx={{ borderRadius: "40px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  sx={{
                    boxShadow: "none",
                    padding: "8px 0",
                    borderRadius: 3,
                    marginTop: 2,
                  }}
                  fullWidth
                  onClick={changePasswordHandler}
                >
                  تغییر
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default ChangePassword;
