import React from "react";
import {
  Box,
  Card,
  Chip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { miladi_be_shamsi } from "../../../../helper/shamsi";

const PayTable = ({
  data,
  totalItems,
  setCurrentPage,
  ITEMS_PER_PAGE,
  currentPage,
}) => {
  console.log(data);
  return (
    <Card
      sx={{
        padding: 2,
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: "30px",
      }}
    >
      <TableContainer sx={{ padding: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: "none", fontSize: "16px" }}>
                عنوان
              </TableCell>
              <TableCell sx={{ border: "none", fontSize: "16px" }}>
                مبلغ
              </TableCell>
              <TableCell sx={{ border: "none", fontSize: "16px" }}>
                تاریخ
              </TableCell>
              <TableCell sx={{ border: "none", fontSize: "16px" }}>
                وضعیت
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={item.id}
                sx={{
                  transition: "0.3s",
                  borderRadius: "20px",
                  "&:hover": {
                    boxShadow: "0 5px 15px rgba(112,112,112,0.3)",
                  },
                }}
              >
                <TableCell sx={{ border: "none" }}>شارژ کیف پول</TableCell>
                <TableCell
                  sx={{
                    border: "none",
                    fontFamily: "iranyekanFn",
                    fontWeight: 500,
                  }}
                >
                  {item?.amount?.toLocaleString()} تومان
                </TableCell>
                <TableCell
                  sx={{
                    border: "none",
                    fontFamily: "iranyekanFn",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CalendarMonthIcon color="primary" />
                  {miladi_be_shamsi(item.created_at.slice(0, 10))}
                </TableCell>
                <TableCell sx={{ border: "none" }}>
                  <Chip
                    label="موفق"
                    color="success"
                    variant="outlined"
                    sx={{ width: "82px" }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        component="div"
        sx={{ padding: 2, display: "flex", justifyContent: "center" }}
      >
        <Pagination
          count={Math.ceil(totalItems / ITEMS_PER_PAGE)}
          onChange={(e, n) => setCurrentPage(n)}
          page={currentPage}
          color="primary"
        />
      </Box>
    </Card>
  );
};

export default PayTable;
