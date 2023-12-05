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
  // TablePagination,
} from "@mui/material";
import UploadExercisesForm from "../../../../../../components/dashboard/students/course/CourseHomeworkForm";
import DownloadIcon from "@mui/icons-material/Download";
import { checkHomeWorkDeadLine } from "../../../../../../helper/checkdeadline";
const HomeWorksLists = ({ data, setReload }) => {
  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(5);
  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };
  return (
    <Card
      sx={{
        padding: 2,
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: "5px",
        marginTop: "1rem",
        minWidth: "75%",
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
              <TableCell
                sx={{ border: "none", fontSize: "16px", textAlign: "center" }}
              >
                آپلود
              </TableCell>
              <TableCell
                sx={{ border: "none", fontSize: "16px", textAlign: "center" }}
              >
                نمره
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((item, index) => (
              <TableRow
                key={item?.id}
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
                  {item?.title}
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
                  {item?.file !== "" ? (
                    <a
                      // download={item?.title}
                      href={`http://daarolquran.com/back_request/get_homework/${item?.file}`}
                    >
                      <Button>
                        <DownloadIcon />
                      </Button>
                    </a>
                  ) : (
                    <>---</>
                  )}
                </TableCell>
                <TableCell sx={{ border: "none", textAlign: "center" }}>
                  <Chip
                    label={
                      item?.is_upload ? "تحویل داده شده" : "تحویل داده نشده"
                    }
                    color={item?.is_upload ? "success" : "error"}
                    variant="outlined"
                    sx={{ width: "auto" }}
                  />
                </TableCell>
                <TableCell sx={{ border: "none" }}>
                  <Stack direction="row" justifyContent="center">
                    <Tooltip title="دوره">
                      {checkHomeWorkDeadLine(item?.deadline) ? (
                        <TableCell sx={{ border: "none", textAlign: "center" }}>
                          <Chip
                            label={"اتمام مهلت"}
                            color={"warning"}
                            variant="outlined"
                            sx={{ width: "auto" }}
                          />
                        </TableCell>
                      ) : item?.is_upload ? (
                        <UploadExercisesForm
                          type="edit"
                          homeworkId={item?.id}
                          answer_id={item?.answer_id}
                          teacher_id={item?.teacher_id}
                          setReload={setReload}
                        />
                      ) : (
                        <UploadExercisesForm
                          type="create"
                          homeworkId={item?.id}
                          answer_id={item?.answer_id}
                          teacher_id={item?.teacher_id}
                          setReload={setReload}
                        />
                      )}
                    </Tooltip>
                  </Stack>
                </TableCell>

                <TableCell sx={{ border: "none", textAlign: "center" }}>
                  <Tooltip title={item?.explain}>
                    {item?.score ? item.score : "نمره داده نشده"}
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* <TablePagination
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
        </Table>
      </TableContainer>
    </Card>
  );
};

export default HomeWorksLists;
