import React, { useEffect, useState, useMemo } from "react";
import useAuth from "../../../../hooks/useAuth";
import axios from "axios";
import { Grid, Typography } from "@mui/material";
import { Container } from "@mui/system";
import DataTable from "../../../../components/dashboard/students/shared/DataTable";
import { useParams } from "react-router-dom";

import NoDataImage from "../../../../assets/img/no-data.png";

const headers = [
  { name: "عنوان", id: "title" },
  { name: "تاریخ تحویل", id: "endDateTime" },
  { name: "توضیحات", id: "description" },
];

const Exercise = () => {
  const { auth, user } = useAuth();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`course/coursehw/?id=${id}`, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      const data = await response.data;
      setData(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setLoading(false);
    }
  }, [data]);

  const ITEMS_PER_PAGE = 10;
  const itemsData = useMemo(() => {
    let computedItems = data;
    setTotalItems(computedItems.length);

    return computedItems.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [currentPage, data]);

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
            تکالیف
          </Typography>
        </Grid>
        {data.length > 0 ? (
          <Grid item xs={12}>
            <DataTable
              type="exercise"
              headers={headers}
              data={itemsData}
              totalItems={totalItems}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
              courseID={id}
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
              تکلیفی برای دوره ثبت نشده
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Exercise;
