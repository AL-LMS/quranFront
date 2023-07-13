import React, { useContext, useState } from "react";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Tooltip,
  Typography,
} from "@mui/material";

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { Stack } from "@mui/system";
import { toastify } from "../../../../helper/toast";
import { DefiContext } from "../../../../context/DefiContext";

const DeleteQuestionExam = ({ id }) => {
  const [open, setOpen] = useState(false);
  const { auth } = useAuth();
  const { setReload } = useContext(DefiContext);

  const deleteHandler = async () => {
    try {
      const response = await axios.delete("quiz/quizQuestion/", {
        data: [{ id }],
        headers: { Authorization: `Bearer ${auth}` },
      });
      setOpen(false);
      toastify("error-login", "سوال مورد نظر حذف شد");
      setReload((prevState) => !prevState);
    } catch (err) {}
  };

  return (
    <div>
      <Tooltip title="حذف">
        <Button color="error" onClick={() => setOpen(true)}>
          <DeleteOutlinedIcon />
        </Button>
      </Tooltip>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ textAlign: "center" }}>حذف سوال آزمون</DialogTitle>
        <DialogContent>
          <Typography
            component="p"
            fontSize={14}
            textAlign="center"
            color="text.secondary"
          >
            در صورت حذف اطلاعات سوال از بین می رود
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mt={2}
          >
            <Button
              variant="contained"
              color="error"
              sx={{ boxShadow: "none" }}
              onClick={deleteHandler}
            >
              حذف
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setOpen(false)}
            >
              انصراف
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteQuestionExam;
