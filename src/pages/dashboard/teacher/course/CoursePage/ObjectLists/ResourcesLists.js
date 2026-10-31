import { legacyAssetUrl } from "../../../../../../api/localAssets.js";
import React from "react";
import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const ResourcesLists = ({ data }) => {
  const onButtonClick = () => {
    const pdfUrl = "Sample.pdf";
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "document.pdf"; // specify the filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
  return (
    <Card
      sx={{
        padding: 2,
        // boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
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
                فایل
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((item, index) => (
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
                  {item?.file !== "" ? (
                    <a
                      download={'xzcfghjk'}
                      href={legacyAssetUrl(`/back_request/get_resource/${item?.file}`)}
                    >
                      {console.log({item})}
                      <Button
                        // variant="contained"
                        // sx={{ boxShadow: "none", borderRadius: "5px" }}
                      >
                        <DownloadIcon />
                      </Button>
                    </a>
                  ) : (
                    <>---</>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default ResourcesLists;
