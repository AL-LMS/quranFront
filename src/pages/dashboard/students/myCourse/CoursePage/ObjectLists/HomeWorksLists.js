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
import Image from "../../../../../../assets/img/image.png";
import PDF from "../../../../../../assets/img/pdf.png";
import Video from "../../../../../../assets/img/video.png";
import UploadExercisesForm from "../../../../../../components/dashboard/students/course/CourseHomeworkForm";
import DownloadIcon from "@mui/icons-material/Download";
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
              {/* <TableCell
                sx={{ border: "none", fontSize: "16px", textAlign: "center" }}
              >
                وضعیت
              </TableCell> */}
              <TableCell
                sx={{ border: "none", fontSize: "16px", textAlign: "center" }}
              >
                آپلود
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
                  {item?.file !== "" ? (
                    <a download={item?.title} href={item?.file}>
                      <Button
                        variant="contained"
                        sx={{ boxShadow: "none", borderRadius: 3 }}
                      >
                        <DownloadIcon />
                      </Button>
                    </a>
                  ) : (
                    <>---</>
                  )}
                </TableCell>
                {/* <TableCell sx={{ border: "none", textAlign: "center" }}>
                  <Chip
                    label={
                      item.is_upload ? "تحویل داده شده" : "تحویل داده نشده"
                    }
                    color={item.is_upload ? "success" : "error"}
                    variant="outlined"
                    sx={{ width: "auto" }}
                  />
                </TableCell> */}
                <TableCell sx={{ border: "none" }}>
                  <Stack direction="row" justifyContent="center">
                    <Tooltip title="دوره">
                      {item.is_upload ? (
                        <Chip
                          label={
                            item.is_upload
                              ? "تحویل داده شده"
                              : "تحویل داده نشده"
                          }
                          color={item.is_upload ? "success" : "error"}
                          variant="outlined"
                          sx={{ width: "auto" }}
                        />
                      ) : (
                        <UploadExercisesForm
                          type="create"
                          homeworkId={item.id}
                        />
                      )}
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

export default HomeWorksLists;
