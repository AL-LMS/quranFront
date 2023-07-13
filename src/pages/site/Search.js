import React, { useState } from "react";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Loader from "../../components/site/shared/Loader";
import NotFound from "../../components/site/shared/NotFound";

const searchType = {
  normal: "packages",
  course: "course",
  timing:"timing-package"
};

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get(`/dashboard/search${location.search}`);
      setData(response.data);
      setLoading(false);
    };
    fetchData();
  }, [location.search]);

  console.log(data);

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
      <Grid container mt={3}>
        <Grid item xs={12}>
          {data.length > 0 ? (
            <Grid container spacing={3}>
              {data.map((item) => (
                <Grid item xs={12} md={4} key={item.id}>
                  <Link to={`/${searchType[item.type]}/details/${item.id}`}>
                    <Card
                      sx={{
                        boxShadow: "0 5px 20px rgba(112,112,112,0.2)",
                        padding: 2,
                        borderRadius: "15px",
                      }}
                    >
                      <CardContent>
                        <Typography>نام دوره:{item.name}</Typography>
                        <Typography mt={2} color="error">
                          قیمت:{item.price} تومان
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <NotFound />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Search;
