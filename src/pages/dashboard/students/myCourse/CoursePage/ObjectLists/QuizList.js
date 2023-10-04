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
import DownloadIcon from "@mui/icons-material/Download";
import UploadQuizzesForm from "../../../../../../components/dashboard/students/course/CourseQuizForm";
import { checkQuizLine } from "../../../../../../helper/checkdeadline";

const statusTable = (item) => {
  if (item) {
    return "فعال";
  } else {
    return "غیرفعال";
  }
};

const QuizList = ({ data, setReload }) => {
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
                توضیحات
              </TableCell>
              <TableCell
                sx={{ border: "none", fontSize: "16px", textAlign: "center" }}
              >
                روز آزمون
              </TableCell>
              <TableCell
                sx={{ border: "none", fontSize: "16px", textAlign: "center" }}
              >
                زمان آزمون
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

                <TableCell sx={{ border: "none", textAlign: "center" }}>
                  {item.explain}
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
                <TableCell
                  sx={{
                    border: "none",
                    fontFamily: "iranyekanFn",
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  {item?.start_time.slice(0, 5) +
                    "-" +
                    item?.end_time.slice(0, 5)}
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
                    <a download={item?.title} href={item?.file}>
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
                      item.is_upload ? "تحویل داده شده" : "تحویل داده نشده"
                    }
                    color={item.is_upload ? "success" : "error"}
                    variant="outlined"
                    sx={{ width: "auto" }}
                  />
                </TableCell>
                <TableCell sx={{ border: "none" }}>
                  <Stack direction="row" justifyContent="center">
                    <Tooltip title="دوره">
                      {checkQuizLine(
                        item.day,
                        item.start_time,
                        item.end_time
                      ) === 0 ? (
                        <TableCell sx={{ border: "none", textAlign: "center" }}>
                          <Chip
                            label={"اتمام مهلت"}
                            color={"warning"}
                            variant="outlined"
                            sx={{ width: "auto" }}
                          />
                        </TableCell>
                      ) : checkQuizLine(
                          item.day,
                          item.start_time,
                          item.end_time
                        ) === 2 ? (
                        <TableCell sx={{ border: "none", textAlign: "center" }}>
                          <Chip
                            label={"آزمون فرانرسیده"}
                            color={"warning"}
                            variant="outlined"
                            sx={{ width: "auto" }}
                          />
                        </TableCell>
                      ) : item.is_upload ? (
                        <UploadQuizzesForm
                          type="edit"
                          quizId={item.id}
                          answer_id={item.answer_id}
                          setReload={setReload}
                        />
                      ) : (
                        <UploadQuizzesForm
                          type="create"
                          quizId={item.id}
                          answer_id={item.answer_id}
                          setReload={setReload}
                        />
                      )}
                    </Tooltip>
                  </Stack>
                </TableCell>

                <TableCell sx={{ border: "none", textAlign: "center" }}>
                  <Tooltip title={item.explain}>
                    {item.score ? item.score : "نمره داده نشده"}
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default QuizList;
