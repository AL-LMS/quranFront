import React, { useContext } from "react";
import { DefiContext } from "../../../../context/DefiContext";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from "@mui/material";
import DeletePackage from "../package/DeletePackage";

import { Stack } from "@mui/system";

const ProductCard = ({ data }) => {
  const { course } = useContext(DefiContext);
  return (
    <ListItem
      sx={{
        padding: 0,
        borderRadius: 3,
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        backgroundColor: "#fff",
      }}
      secondaryAction={
        <Stack spacing={2} sx={{ display: { xs: "none", md: "flex" } }}>
          <DeletePackage type="cart" url="dashboard/basket" id={data.id} />
        </Stack>
      }
    >
      <ListItemAvatar>
        <Avatar
          src={`https://api.srvschool.ir${
            course.find((item) => item.id === data.buy_id)?.picture
          }`}
          alt="course"
          sx={{
            height: { xs: "60px", md: "150px" },
            width: { xs: "60px", md: "150px" },
            borderRadius: 2,
            marginRight: 2,
          }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Stack direction="row" spacing={1}>
            <Typography color="text.secondary">نام دوره:</Typography>
            <Typography color="mainText">{data?.name}</Typography>
          </Stack>
        }
        secondary={
          <Stack direction="row" spacing={1} mt={2}>
            <Typography color="text.secondary">قیمت دوره:</Typography>
            <Typography color="mainText">
              {data?.price} تومان
            </Typography>
          </Stack>
        }
      />
      <Stack sx={{ display: { xs: "flex", md: "none" } }}>
      <DeletePackage type="cart" url="dashboard/basket" id={data.id} />
      </Stack>
    </ListItem>
  );
};

export default ProductCard;
