import React from "react";
import {
  Button,
  Card,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { miladi_be_shamsi } from "../../../../helper/shamsi";

const statusTable = (item) => {
  if (item) {
    return "فعال";
  } else {
    return "غیرفعال";
  }
};

const CourseList = ({ data }) => {
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
              <TableCell
                sx={{ border: "none", fontSize: "16px", textAlign: "center" }}
              >
                عنوان
              </TableCell>
              <TableCell
                sx={{ border: "none", fontSize: "16px", textAlign: "center" }}
              >
                قیمت
              </TableCell>
              <TableCell
                sx={{ border: "none", fontSize: "16px", textAlign: "center" }}
              >
                کددوره
              </TableCell>
              <TableCell
                sx={{ border: "none", fontSize: "16px", textAlign: "center" }}
              >
                تاریخ شروع
              </TableCell>
              <TableCell
                sx={{ border: "none", fontSize: "16px", textAlign: "center" }}
              >
                وضعیت
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
                <TableCell sx={{ border: "none", textAlign: "center" }}>
                  {item.name}
                </TableCell>
                <TableCell
                  sx={{
                    border: "none",
                    fontFamily: "iranyekanFn",
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  {item.price2
                    ? item.price2?.toLocaleString()
                    : item.price1?.toLocaleString()}
                  تومان
                </TableCell>
                <TableCell
                  sx={{
                    border: "none",
                    fontFamily: "iranyekanFn",
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  {item.code}
                </TableCell>
                <TableCell
                  sx={{
                    border: "none",
                    fontFamily: "iranyekanFn",
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  {item?.startTime && miladi_be_shamsi(item?.startTime)}
                </TableCell>
                <TableCell sx={{ border: "none", textAlign: "center" }}>
                  <Chip
                    label={statusTable(item.active)}
                    color={item.active ? "success" : "error"}
                    variant="outlined"
                    sx={{ width: "82px" }}
                  />
                </TableCell>
                <TableCell sx={{ border: "none" }}>
                  <Stack direction="row" justifyContent="center">
                    <Tooltip title="تکالیف">
                      <Link to={`/panel/course/course-homework/${item.id}`}>
                        <Button>
                          <MenuBookOutlinedIcon />
                        </Button>
                      </Link>
                    </Tooltip>
                    <Tooltip title="آزمون">
                      <Link to={`/panel/course/quiz/${item.id}`}>
                        <Button>
                          <LibraryBooksOutlinedIcon />
                        </Button>
                      </Link>
                    </Tooltip>
                    <Tooltip title="فروم">
                      <Link to={`/panel/course/forum/${item.id}`}>
                        <Button>
                          <SmsOutlinedIcon />
                        </Button>
                      </Link>
                    </Tooltip>
                    <Tooltip title="دانش آموزان">
                      <Link to={`/panel/course/students/${item.id}`}>
                        <Button>
                          <GroupsOutlinedIcon />
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

export default CourseList;
