import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import { Grid, Typography } from "@mui/material";
import { Container } from "@mui/system";

import DataTable from "../../../../components/dashboard/teacher/shared/DataTable";
import { ToastContainer } from "react-toastify";
import Loader from "../../../../components/site/shared/Loader";

const headers = [
  { name: "نام", id: "name" },
  { name: "نام خانوادگی", id: "l_name" },
  { name: "نام کاربری", id: "phone" },
];

const Students = () => {
  const { auth } = useAuth();
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const ITEMS_PER_PAGE = 10;
  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(`course/courseStudent/?c_id=${id}`, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      const data = await response.data;
      setStudents(data);
      setLoading(false);
    };
    fetchUser();
  }, []);
  const itemsData = useMemo(() => {
    let computedItems = students;
    if (search) {
      computedItems = computedItems.filter((item) =>
        item.phone.includes(search)
      );
    }
    setTotalItems(computedItems.length);

    return (
      computedItems?.length > 0 &&
      computedItems?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
      )
    );
  }, [currentPage, search, students]);
  if (loading)
    return (
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader />
      </Grid>
    );
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} mt={3}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            component="h6"
            variant="h5"
            color="mainText"
            fontWeight={500}
          >
            لیست دانش‌آموزان دوره
          </Typography>
        </Grid>
        {students.length === 0 ? (
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography textAlign="center">دوره دانش آموزی ندارد</Typography>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <DataTable
              type="courseStudent"
              headers={headers}
              data={itemsData}
              searchTitle="جستجو براساس نام کاربری"
              totalItems={totalItems}
              setCurrentPage={setCurrentPage}
              search={search}
              setSearch={setSearch}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
            />
          </Grid>
        )}
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default Students;
