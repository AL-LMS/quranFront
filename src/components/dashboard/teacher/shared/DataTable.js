import React from "react";
import {
  Card,
  Table,
  TableContainer,
  InputBase,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Pagination,
  Chip,
  Stack,
} from "@mui/material";
import { Box } from "@mui/system";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const DataTable = ({
  headers,
  data,
  searchTitle,
  setCurrentPage,
  currentPage,
  ITEMS_PER_PAGE,
  setSearch,
  totalItems,
  search,
}) => {
  return (
    <Card
      sx={{
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: "5px",
        padding: 2,
      }}
    >
      <Box
        component="div"
        sx={{
          border: "1px solid #e8e8e8",
          borderRadius: "5px",
          padding: 1,
          margin: "0 auto",
          width: { xs: "100%", md: "50%" },
        }}
      >
        <InputBase
          value={search}
          fullWidth
          sx={{ fontFamily: "iranyekanFn", fontWeight: 400 }}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchTitle}
        />
      </Box>
      <TableContainer sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((head, index) => (
                <TableCell
                  key={index}
                  sx={{ border: "none", textAlign: "center" }}
                >
                  {head.name}
                </TableCell>
              ))}
              <TableCell sx={{ border: "none", textAlign: "center" }}>
                <MoreHorizIcon />
              </TableCell>
            </TableRow>
          </TableHead>
          {data?.length > 0 && (
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  {headers.map((head, i) => (
                    <TableCell
                      key={i}
                      sx={{
                        fontFamily: "iranyekanFn",
                        fontWeight: 400,
                        textAlign: "center",
                        border: "none",
                      }}
                    >
                      {head.id === "Picture1" || head.id === "picture" ? (
                        <Avatar src={item[head.id]} />
                      ) : head.id === "Active" ? (
                        <Chip
                          sx={{ width: "66.14px" }}
                          label={item.Active ? "فعال" : "غیرفعال"}
                          color={item.Active ? "success" : "error"}
                        />
                      ) : (
                        item[head.id]
                      )}
                    </TableCell>
                  ))}
                  <TableCell
                    sx={{ border: "none", textAlign: "center" }}
                  ></TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
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

export default DataTable;
