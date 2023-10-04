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
import DownloadIcon from "@mui/icons-material/Download";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { miladi_be_shamsi } from "../../../../../../helper/shamsi";
import CourseQuizAnswerForm from "../../../../../../components/dashboard/teacher/course/CourseQuizAnswerForm";
const QuizAnswerLists = ({ data, setReload }) => {
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
                نام قرآن‌آموز
              </TableCell>
              <TableCell
                sx={{ border: "none", fontSize: "16px", textAlign: "center" }}
              >
                زمان ارسال
              </TableCell>
              <TableCell
                sx={{ border: "none", fontSize: "16px", textAlign: "center" }}
              >
                فایل
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
                  {item?.send_time &&
                    miladi_be_shamsi(item?.send_time.slice(0, 10))}
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
                    <a download={item?.name} href={item?.file}>
                      <Button>
                        <DownloadIcon />
                      </Button>
                    </a>
                  ) : (
                    <>---</>
                  )}
                </TableCell>
                <TableCell sx={{ border: "none" }}>
                  <Stack direction="row" justifyContent="center">
                    <Tooltip title="وضعیت ارسال">
                      <CourseQuizAnswerForm
                        type="create"
                        answer_id={item.answer_id}
                        setReload={setReload}
                      />
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

export default QuizAnswerLists;
