// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import useAuth from "../../../hooks/useAuth";
// import {
//   Autocomplete,
//   Button,
//   Dialog,
//   DialogTitle,
//   Divider,
//   Grid,
//   Input,
//   TextField,
// } from "@mui/material";
// import { toastify } from "../../../helper/toast";
// import { DefiContext } from "../../../context/DefiContext";
// import Checkbox from "@mui/material/Checkbox";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import FormGroup from "@mui/material/FormGroup";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   useMapEvents,
// } from "react-leaflet";
// import { DatePicker } from "zaman";
// import "./style.css";
// import "react-datepicker/dist/react-datepicker.css";

// const CreateLive = () => {
//   const { auth, user } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [courseID, setCourseID] = useState([]);
//   const [open, setOpen] = useState(false);
//   const { setReload } = useContext(DefiContext);
//   const [form, setForm] = useState({
//     course: "",
//   });
//   useEffect(() => {
//     // const fetchCoursID = async () => {
//     //   const response = await axios.get(`course/teacherCourse/?id=${user.pk}`, {
//     //     headers: { Authorization: `Bearer ${auth}` },
//     //   });
//     //   const data = await response.data;
//     //   setCourseID(data);
//     // };
//     // fetchCoursID();
//   }, []);

//   const [isOnline, setIsOnline] = useState(false);

//   const handleCheckboxChange = (event) => {
//     setIsOnline(event.target.checked);
//   };
//   const submitHandler = async () => {
//     // if (form.course) {
//     //   try {
//     //     const response = await axios.post(
//     //       "live/create/",
//     //       {
//     //         id: form.course.id,
//     //         name: form.course.name,
//     //       },
//     //       {
//     //         headers: { Authorization: `Bearer ${auth}` },
//     //       }
//     //     );
//     //     toastify("success");
//     //     setLoading(false);
//     //     setOpen(false);
//     //     setReload((prevState) => !prevState);
//     //   } catch (err) {
//     //     toastify("error");
//     //     setLoading(false);
//     //   }
//     // } else {
//     //   toastify("warning");
//     // }
//   };
//   const [position, setPosition] = useState([51.505, -0.09]);

//   const handleMapClick = (e) => {
//     setPosition([e.latlng.lat, e.latlng.lng]);
//   };
//   const [calendarValue, setCalendarValue] = useState(new Date());

//   return (
//     <div>
//       <Button
//         variant="contained"
//         sx={{ boxShadow: "none" }}
//         onClick={() => setOpen(true)}
//       >
//         ایجاد دوره جدید
//       </Button>
//       {/* <Dialog
//         open={open}
//         onClose={() => setOpen(false)}
//         fullWidth
//         maxWidth="sm"
//       >
//         <DialogTitle sx={{ textAlign: "center" }}>ایجاد دوره</DialogTitle> */}
//       <Grid container spacing={3} padding={2}>
//         <Grid item xs={12}>
//           <Autocomplete
//             fullWidth
//             value={form.course}
//             onChange={(event, newValue) => {
//               setForm({ ...form, course: newValue });
//             }}
//             id="controllable-states-demo"
//             options={courseID}
//             getOptionLabel={(option) => option.name || ""}
//             renderInput={(params) => (
//               <TextField {...params} label="دسته بندی موضوعی" />
//             )}
//           />
//           <TextField
//             fullWidth
//             label="نام دوره"
//             name="name"
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//             value={form.name}
//             sx={{ marginTop: 1 }}
//           />
//           <TextField
//             fullWidth
//             label="توضیحات"
//             name="name"
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//             value={form.name}
//             sx={{ marginTop: 1 }}
//           />
//           <FormGroup>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={isOnline}
//                   onChange={handleCheckboxChange}
//                   name="isOnline"
//                   color="primary"
//                 />
//               }
//               label="کلاس به صورت حضوری است."
//               sx={{
//                 padding: "4px 15px",
//                 marginBottom: "2rem",
//               }}
//             />
//           </FormGroup>
//           {isOnline && (
//             <div>
//               <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
//                 <TileLayer
//                   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />
//                 <Marker position={position}>
//                   <Popup>
//                     A pretty CSS3 popup. <br /> Easily customizable.
//                   </Popup>
//                 </Marker>
//               </MapContainer>
//             </div>
//           )}
//         </Grid>
//         <Grid item xs={12}>
//           <Divider />
//         </Grid>

//         <div className="libWrapper">
//           <DatePicker
//             round="x2"
//             accentColor="#6374ae"
//             inputAttributes={{
//               placeholder: "start date -- end date",
//             }}
//             range
//           />
//           /
//         </div>
//         <Grid item xs={12}>
//           <Button
//             variant="contained"
//             onClick={submitHandler}
//             fullWidth
//             disabled={loading}
//             sx={{ boxShadow: "none", padding: "12px 0" }}
//           >
//             ثبت اطلاعات
//           </Button>
//         </Grid>
//       </Grid>
//       {/* </Dialog> */}
//     </div>
//   );
// };

// export default CreateLive;

// The feature was fully commented out before the Vite migration. Keep the
// existing teacher live page renderable while its create form remains inactive.
export default function CreateLive() {
  return null;
}
