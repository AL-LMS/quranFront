import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Grid, Typography } from "@mui/material";
import { Container } from "@mui/system";
import PayTable from "../../../components/dashboard/students/payments/PayTable";

import Loader from "../../../components/site/shared/Loader";

import NoDataImage from "../../../assets/img/no-data.png";

const Payments = () => {
  const { auth, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      const response = await axios.get(`zarinpal/report/?s_id=${user.phone}`, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      setData(response.data.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const itemsData = useMemo(() => {
    let computedItems = data;
    setTotalItems(computedItems.length);

    return (
      computedItems?.length > 0 &&
      computedItems?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
      )
    );
  }, [currentPage, data]);

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

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <Typography
            component="h5"
            variant="h6"
            fontWeight={500}
            color="mainText"
          >
            پرداخت ها
          </Typography>
        </Grid>
        {data.length > 0 ? (
          <Grid item xs={12}>
            <PayTable
              data={itemsData}
              totalItems={totalItems}
              setCurrentPage={setCurrentPage}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
              currentPage={currentPage}
            />
          </Grid>
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
              اطلاعاتی یافت نشد
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Payments;
