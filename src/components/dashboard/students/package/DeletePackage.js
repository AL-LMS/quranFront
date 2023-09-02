import React, { useState } from "react";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import {
  Button,
  Dialog,
  DialogTitle,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { toastify } from "../../../../helper/toast";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { useContext } from "react";
import { DefiContext } from "../../../../context/DefiContext";

const typeName = {
  package: "پکیج",
  coursePackages: "درس پکیج",
  cart: "محصول",
};

const DeletePackage = React.forwardRef((props, ref) => {
  const { id } = props;
  const { pk } = props;
  const { auth } = useAuth();
  const [open, setOpen] = useState(false);
  const { setReload } = useContext(DefiContext);

  const closeHandler = () => {
    setOpen(false);
  };

  const submitData = async () => {
    try {
      const response = await axios.delete(props.url, {
        data: [{ id }],
        headers: { Authorization: `Bearer ${auth}` },
      });
      const data = await response.data;
      toastify("error-login", `${typeName[props.type]} مورد نظر حذف شد`);
      setOpen(false);
      setReload((prevState) => !prevState);
    } catch (err) {
    }
  };

  return (
    <div>
      <Tooltip title="حذف">
        <Button
          variant="text"
          onClick={() => setOpen(true)}
          sx={[
            {
              boxShadow: "none",
              color: "#f74b4a",
              "&:hover": {
                color: "#f2302f",
                boxShadow: "none",
              },
            },
          ]}
        >
          <DeleteForeverOutlinedIcon />
        </Button>
      </Tooltip>

      <Dialog open={open} onClose={closeHandler}>
        <Box
          component="span"
          sx={{
            display: "inline-block",
            width: "50px",
            height: "50px",
            textAlign: "center",
            lineHeight: "65px",
            borderRadius: "50%",
            backgroundColor: "#ccc",
            color: "#666",
            margin: "1rem auto 0",
          }}
        >
          <DeleteOutlineRoundedIcon />
        </Box>
        <DialogTitle textAlign="center" color="text" fontWeight={500}>
          حذف {typeName[props.type]}
          <Typography
            component="small"
            variant="small"
            color="text.secondary"
            fontSize="13px"
            display="block"
          >
            در صورت حذف دسترسی به اطلاعات {typeName[props.type]} از بین می رود
          </Typography>
          <Box
            component="div"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt={3}
          >
            <Button
              variant="contained"
              onClick={submitData}
              sx={[
                {
                  boxShadow: "none",
                  backgroundColor: "#f74b4a",
                  "&:hover": {
                    backgroundColor: "#f2302f",
                    boxShadow: "none",
                  },
                },
              ]}
            >
              حذف
            </Button>
            <Button color="error" variant="text" onClick={closeHandler}>
              انصراف
            </Button>
          </Box>
        </DialogTitle>
      </Dialog>
    </div>
  );
});

export default DeletePackage;
