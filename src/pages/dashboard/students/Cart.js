import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Grid, List, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Container } from "@mui/system";
import Pay from "../../../components/dashboard/students/cart/Pay";
import ProductCard from "../../../components/dashboard/students/cart/ProductCard";
import Loader from "../../../components/site/shared/Loader";

import NoDataImage from "../../../assets/img/cart.svg";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import { DefiContext } from "../../../context/DefiContext";

const Cart = () => {
  const { auth } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState("");
  const {reload} = useContext(DefiContext)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get("dashboard/basket", {
        headers: { Authorization: `Bearer ${auth}` },
      });
      setData(response.data);
      setLoading(false);
    };
    const fetchWallet = async () => {
      setLoading(true);
      const response = await axios.get("dashboard/wallet", {
        headers: { Authorization: `Bearer ${auth}` },
      });
      setWallet(response.data);
      setLoading(false);
    };
    fetchData();
    fetchWallet();
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
        <Grid item xs={12}>
          <Typography
            component="h5"
            variant="h6"
            fontWeight={500}
            color="textMain"
          >
            سبد خرید
          </Typography>
        </Grid>
        {data.basket?.length > 0 ? (
          <>
            {data.basket?.map((item) => (
              <Grid item xs={12} key={item.id}>
                <List>
                  <ProductCard data={item} />
                </List>
              </Grid>
            ))}
            <Grid item xs={12} md={5} sx={{ marginLeft: "auto" }}>
              <Pay wallet={wallet} data={data} />
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <img
              src={NoDataImage}
              alt="no-data"
              style={{
                width: "220px",
                height: "220px",
                display: "block",
                margin: "0 auto",
              }}
            />
            <Typography
              variant="h5"
              color="#ccc"
              fontWeight={500}
              textAlign="center"
              marginTop={1}
            >
              سبد خرید شما خالی است
            </Typography>
            <Link to="/course">
              <Button
                variant="contained"
                sx={{
                  boxShadow: "none",
                  display: "block",
                  margin: "1rem auto",
                  padding: "8px 25px",
                  borderRadius: 3,
                }}
              >
                خرید دوره
              </Button>
            </Link>
          </Grid>
        )}
      </Grid>
      <ToastContainer />
    </Container>
  );
};

export default Cart;
