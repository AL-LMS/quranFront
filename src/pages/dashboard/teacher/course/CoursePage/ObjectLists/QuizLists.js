import React from "react";
import {
  Button,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
const QuizLists = ({ data }) => {
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
                روز آزمون
              </TableCell>
              <TableCell
                sx={{ border: "none", fontSize: "16px", textAlign: "center" }}
              >
                ساعت آزمون
              </TableCell>
              <TableCell
                sx={{ border: "none", fontSize: "16px", textAlign: "center" }}
              >
                نوع آزمون
              </TableCell>
              <TableCell
                sx={{
                  border: "none",
                  fontSize: "16px",
                  textAlign: "center",
                }}
              >
                <MoreHorizIcon color="#eee" />
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
                  {item?.day && item?.day.slice(0, 10)}
                </TableCell>
                <TableCell sx={{ border: "none", textAlign: "center" }}>
                  {item.start_time.slice(0, 5) +
                    "-" +
                    item.end_time.slice(0, 5)}
                </TableCell>
                <TableCell sx={{ border: "none", textAlign: "center" }}>
                  {item.type}
                </TableCell>
                <TableCell sx={{ border: "none" }}>
                  <Stack direction="row" justifyContent="center">
                    <Tooltip title="وضعیت ارسال">
                      <Link to={`/panel/uploaded_homework/${item.id}`}>
                        <Button>
                          <DriveFolderUploadIcon />
                        </Button>
                      </Link>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default QuizLists;
