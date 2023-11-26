import React from "react";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const NotifsLists = ({ data }) => {
  return (
    <Card
      sx={{
        padding: 2,
        // boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: "5px",
        marginTop: "1rem",
      }}
    >
      <TableContainer sx={{ padding: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ border: "none", fontSize: "16px", textAlign: "center" }}
              >
                ردیف
              </TableCell>
              <TableCell
                sx={{ border: "none", fontSize: "16px", textAlign: "center" }}
              >
                عنوان
              </TableCell>
              <TableCell
                sx={{ border: "none", fontSize: "16px", textAlign: "center" }}
              >
                توضیحات
              </TableCell>
              <TableCell
                sx={{ border: "none", fontSize: "16px", textAlign: "center" }}
              >
                نویسنده
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={item.id}
                sx={{
                  transition: "0.3s",
                  borderRadius: "5px",
                  "&:hover": {
                    boxShadow: "0 5px 15px rgba(112,112,112,0.3)",
                  },
                }}
              >
                <TableCell sx={{ border: "none", textAlign: "center" }}>
                  {index + 1}
                </TableCell>
                <TableCell sx={{ border: "none", textAlign: "center" }}>
                  {item.title}
                </TableCell>
                <TableCell sx={{ border: "none", textAlign: "center" }}>
                  {item.description}
                </TableCell>
                <TableCell sx={{ border: "none", textAlign: "center" }}>
                  {item.sender_name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default NotifsLists;
