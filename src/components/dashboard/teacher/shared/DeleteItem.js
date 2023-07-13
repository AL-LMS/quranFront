import React, { useContext, useState } from "react";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from "@mui/material";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import toastify from "../../../../helper/toast";
import { DefiContext } from "../../../../context/DefiContext";

const DeleteItem = ({ url, id }) => {
  const { auth } = useAuth();
  const [open, setOpen] = useState(false);
  const { setReload } = useContext(DefiContext);

  const submitData = async () => {
    const response = await axios.delete(url, {
      data: { id },
      headers: { Authorization: `Bearer ${auth}` },
    });
    setOpen(false);
    toastify("error-login", "آیتم مورد نظر حذف شد");
    setReload((prevState) => !prevState);
  };

  return (
    <div>
      <Tooltip title="حذف">
        <Button color="error" onClick={() => setOpen(true)}>
          <DeleteOutlineOutlinedIcon />
        </Button>
      </Tooltip>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ textAlign: "center" }}>حذف آیتم</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: "center" }}>
            درصورت حذف اطلاعات این آیتم از بین می رود
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            onClick={submitData}
            sx={{ boxShadow: "none" }}
            color="error"
          >
            حذف
          </Button>
          <Button color="error" onClick={() => setOpen(false)}>
            انصراف
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteItem;
