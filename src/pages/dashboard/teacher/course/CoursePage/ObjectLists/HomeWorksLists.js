import React from "react";
import {
  Card,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Image from "../../../../../../assets/img/image.png";
import PDF from "../../../../../../assets/img/pdf.png";

const HomeWorksLists = ({ data }) => {
  return (
    <Card
      sx={{
        padding: 2,
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: "30px",
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
                مهلت ارسال
              </TableCell>
              <TableCell
                sx={{ border: "none", fontSize: "16px", textAlign: "center" }}
              >
                فایل
              </TableCell>
              <TableCell
                sx={{ border: "none", fontSize: "16px", textAlign: "center" }}
              >
                وضعیت
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
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
                <TableCell sx={{ border: "none", textAlign: "center" }}>
                  {index + 1}
                </TableCell>
                <TableCell sx={{ border: "none", textAlign: "center" }}>
                  {item.title}
                </TableCell>
                <TableCell
                  sx={{
                    border: "none",
                    fontFamily: "iranyekanFn",
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  {item?.deadline && item?.deadline.slice(0, 10)}
                </TableCell>
                <TableCell
                  sx={{
                    border: "none",
                    fontFamily: "iranyekanFn",
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  <a download={item?.title} href={item?.file}>
                    <img src={item?.type === "pdf" ? PDF : Image} />
                  </a>
                </TableCell>
                <TableCell sx={{ border: "none", textAlign: "center" }}>
                  <Chip
                    label={item.type}
                    color={item.type ? "success" : "error"}
                    variant="outlined"
                    sx={{ width: "82px" }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default HomeWorksLists;
