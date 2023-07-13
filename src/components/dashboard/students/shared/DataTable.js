import React from "react";
import {
  Avatar,
  Button,
  Card,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { Box } from "@mui/system";
import { miladi_be_shamsi } from "../../../../helper/shamsi";

import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Link } from "react-router-dom";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
const DataTable = ({
  headers,
  data,
  type,
  totalItems,
  currentPage,
  setCurrentPage,
  ITEMS_PER_PAGE,
  courseID,
}) => {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 5px 20px rgba(112,112,112,.2)",
        padding: 2,
      }}
    >
      <TableContainer sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((head, index) => (
                <TableCell key={index}>{head.name}</TableCell>
              ))}
              <TableCell>جزییات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, i) => (
              <TableRow key={item.id ? item.id : i}>
                {headers.map((head, i) => (
                  <TableCell
                    key={i}
                    sx={{ fontFamily: "iranyekanFn", fontWeight: 400 }}
                  >
                    {head.id === "Picture1" || head.id === "Picture" ? (
                      <Avatar src={item[head.id]} />
                    ) : head.id === "description" ? (
                      item?.description?.slice(0, 50).concat("...")
                    ) : head.id === "endDateTime" ? (
                      miladi_be_shamsi(item[head?.id])
                    ) : (
                      item[head.id]
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <Stack direction="row">
                    <a
                      href={`https://api.srvschool.ir${item.fileCourse}`}
                      download
                      target="_blank"
                    >
                      <Tooltip title="دانلود">
                        <Button>
                          <FileDownloadOutlinedIcon />
                        </Button>
                      </Tooltip>
                    </a>
                    <Link to={`/panel/course/exercise/${courseID}/${item.id}`}>
                      <Tooltip title="ارسال تکلیف">
                        <Button>
                          <SendOutlinedIcon />
                        </Button>
                      </Tooltip>
                    </Link>
                  </Stack>
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

export default DataTable;
