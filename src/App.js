import { CacheProvider } from "@emotion/react";
import { prefixer } from "stylis";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";

import Navbar from "./layouts/site/Navbar";
import HomePage from "./pages/site/HomePage";
import Footer from "./layouts/site/Footer";
import { ToastContainer } from "react-toastify";

import CourseDetails from "./pages/site/CourseDetails";
import Packages from "./pages/site/Packages";
import Applications from "./pages/site/Applications";
import FAQ from "./pages/site/FAQ";
import PrivateRoutes from "./utils/PrivateRoutes";
import Login from "./pages/site/Login";
//Students dahboard
import StudentDash from "./pages/site/Course";
import Dashboard from "./pages/dashboard/students/Dashboard";
import Wallet from "./pages/dashboard/students/Wallet";
import Profile from "./pages/dashboard/students/Profile";
import Cart from "./pages/dashboard/students/Cart";
import MyCourse from "./pages/dashboard/students/MyCourse";
import Forum from "./pages/dashboard/students/myCourse/Forum";
import Exercise from "./pages/dashboard/students/myCourse/Exercise";
import Files from "./pages/dashboard/students/myCourse/Files";
import Videos from "./pages/dashboard/students/myCourse/Videos";
import Report from "./pages/dashboard/students/myCourse/Report";
import Payments from "./pages/dashboard/students/Payments";
import Quiz from "./pages/dashboard/students/Quiz";
import QuizDetails from "./pages/dashboard/students/quiz/QuizDetails";
import StartQuiz from "./pages/dashboard/students/quiz/StartQuiz";
import PrivacyPolicy from "./pages/dashboard/students/PrivacyPolicy";
import Notifications from "./pages/dashboard/students/Notifications";
import Register from "./pages/site/Register";
import useAuth from "./hooks/useAuth";
import StudentCoursePage from "./pages/dashboard/students/myCourse/CoursePage";
import SCourseHomeWorks from "./pages/dashboard/students/myCourse/CoursePage/ObjectsAllShow/CourseHomeWorks";
import SCourseResources from "./pages/dashboard/students/myCourse/CoursePage/ObjectsAllShow/CourseResources";
import SCourseQuize from "./pages/dashboard/students/myCourse/CoursePage/ObjectsAllShow/CourseQuize";
import SCourseNotifes from "./pages/dashboard/students/myCourse/CoursePage/ObjectsAllShow/CourseNotifes";
//Teacher dashboard
import TeacherDash from "./pages/dashboard/teacher/Dashboard";
import TeacherCourse from "./pages/dashboard/teacher/MyCourse";
import TeacherBuyCourse from "./pages/dashboard/teacher/Course";
import TeacherNewCourse from "./pages/dashboard/teacher/createNewCourse";
import CourseHomework from "./pages/dashboard/teacher/course/CourseHomework";
import TeacherCoursePage from "./pages/dashboard/teacher/course/CoursePage";
import TeacherQuiz from "./pages/dashboard/teacher/course/Quiz";
import QuizForm from "./pages/dashboard/teacher/course/QuizForm";
import Students from "./pages/dashboard/teacher/course/Students";
import ConfirmPhone from "./pages/site/ConfirmPhone";
import ForumList from "./pages/dashboard/students/myCourse/ForumList";
import SingleAnswer from "./pages/dashboard/students/quiz/SingleAnswer";
import Package from "./pages/dashboard/students/Package";
import PackageCourseList from "./pages/dashboard/students/PackageCoursList";
import PackageDetails from "./pages/site/PackageDetails";
import QuizQuestion from "./pages/dashboard/teacher/course/QuizQuestion";
import Live from "./pages/dashboard/teacher/Live";
import CourseTag from "./pages/dashboard/students/myCourse/CourseTag";
import TimingPackage from "./pages/site/TimingPackage";
import TimingPackageDetails from "./pages/site/TimingPackageDetails";
import EndQuiz from "./pages/dashboard/students/quiz/EndQuiz";
import QuizTDetails from "./pages/dashboard/students/quiz/QuizTDetails";
import StartTQuiz from "./pages/dashboard/students/quiz/StartTQuiz";
import EndQT from "./pages/dashboard/students/quiz/EndQT";
import Search from "./pages/site/Search";
import Auth from "./pages/site/Auth";
import MyExercise from "./pages/dashboard/students/myCourse/MyExercise";
import QuizScore from "./pages/dashboard/students/quiz/QuizScore";
import ProfileTeacher from "./pages/dashboard/teacher/Profile";
import StudentList from "./pages/dashboard/teacher/StudentList";
import CourseHomeWorks from "./pages/dashboard/teacher/course/CoursePage/ObjectsAllShow/CourseHomeWorks";
import CourseResources from "./pages/dashboard/teacher/course/CoursePage/ObjectsAllShow/CourseResources";
import CourseQuize from "./pages/dashboard/teacher/course/CoursePage/ObjectsAllShow/CourseQuize";
import CourseNotifes from "./pages/dashboard/teacher/course/CoursePage/ObjectsAllShow/CourseNotifes";
import Meet from "./pages/site/Meet";
import CourseHomeWorksAnswer from "./pages/dashboard/teacher/course/CoursePage/ObjectsAllShow/CourseHomeWorksAnswer";
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

function App() {
  const location = useLocation();
  const { auth, user } = useAuth();
  return (
    <CacheProvider value={cacheRtl}>
      {!location.pathname.includes("panel") && <Navbar />}
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirm-phone" element={<ConfirmPhone />} />
        <Route path="/meet" element={<Meet />} />
        {/* <Route path="/course" element={<Course />} />
        <Route path="/course/details/:id" element={<CourseDetails />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/details/:id" element={<PackageDetails />} />
        <Route path="/applications" element={<Applications />} /> */}
        <Route path="/FAQ" element={<FAQ />} />
        {/* <Route path="/search/*" element={<Search />} /> */}
        {/* <Route path="/auth/:token" element={<Auth />} /> */}
        {/* <Route path="/timing-package" element={<TimingPackage />} /> */}
        {/* <Route
          path="/timing-package/details/:id"
          element={<TimingPackageDetails />}
        /> */}
        {user?.role?.toLowerCase() === "student" ? (
          <Route element={<PrivateRoutes />}>
            <Route path="/panel/dashboard" element={<StudentDash />} />
            <Route
              path="/panel/course/details/:id"
              element={<CourseDetails />}
            />
            {/* <Route path="/panel/dashboard" element={<Dashboard />} /> */}
            <Route path="/panel/wallet" element={<Wallet />} />
            <Route path="/panel/profile" element={<Profile />} />
            <Route path="/panel/cart" element={<Cart />} />
            <Route path="/panel/my-course" element={<MyCourse />} />
            <Route
              path="/panel/course-page/:id"
              element={<StudentCoursePage />}
            />
            <Route
              path="/panel/course/home-works/:id"
              element={<SCourseHomeWorks />}
            />
            <Route
              path="/panel/course/resources/:id"
              element={<SCourseResources />}
            />
            <Route path="/panel/course/quizes/:id" element={<SCourseQuize />} />
            <Route
              path="/panel/course/notifs/:id"
              element={<SCourseNotifes />}
            />
            <Route
              path="/panel/my-course/forumlist/:id"
              element={<ForumList />}
            />
            <Route path="/panel/my-course/forum/:id" element={<Forum />} />
            <Route
              path="/panel/my-course/exercise/:id"
              element={<Exercise />}
            />
            <Route path="/panel/my-course/tags/file/:id" element={<Files />} />
            <Route path="/panel/my-course/videos/:id" element={<Videos />} />
            <Route path="/panel/my-course/report/:id" element={<Report />} />
            <Route path="/panel/my-course/tags/:id" element={<CourseTag />} />
            <Route
              path="/panel/course/exercise/:cid/:hid"
              element={<MyExercise />}
            />
            <Route path="/panel/payments" element={<Payments />} />
            <Route path="/panel/quiz" element={<Quiz />} />
            <Route
              path="/panel/quiz/quiz-details/:id"
              element={<QuizDetails />}
            />
            <Route
              path="/panel/quiz/quizt-details/:id"
              element={<QuizTDetails />}
            />
            <Route path="/panel/quiz/start/:id" element={<StartQuiz />} />
            <Route path="/panel/quiz/start-t/:id" element={<StartTQuiz />} />
            <Route path="/panel/quiz/end-t-quiz/:id" element={<EndQT />} />
            <Route
              path="/panel/quiz/start-single/:id"
              element={<SingleAnswer />}
            />
            <Route path="/panel/quiz/end/:id" element={<EndQuiz />} />
            <Route path="/panel/quiz/score/:id" element={<QuizScore />} />
            <Route path="/panel/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/panel/notifications" element={<Notifications />} />
            <Route path="/panel/package" element={<Package />} />
            <Route
              path="/panel/packages/course/:id"
              element={<PackageCourseList />}
            />
            <Route path="/*" element={<Navigate to="/panel/dashboard" />} />
          </Route>
        ) : (
          <Route element={<PrivateRoutes />}>
            <Route path="/panel/dashboard" element={<TeacherDash />} />
            <Route path="/panel/profile" element={<ProfileTeacher />} />
            <Route path="/panel/my-coures" element={<TeacherCourse />} />
            <Route path="/course/details/:id" element={<CourseDetails />} />
            <Route
              path="/panel/course/course-page/:id"
              element={<TeacherCoursePage />}
            />
            <Route
              path="/panel/course/home-works/:id"
              element={<CourseHomeWorks />}
            />
            <Route
              path="/panel/uploaded_homework/:id"
              element={<CourseHomeWorksAnswer />}
            />
            <Route
              path="/panel/course/resources/:id"
              element={<CourseResources />}
            />
            <Route path="/panel/course/quizes/:id" element={<CourseQuize />} />
            <Route
              path="/panel/course/notifs/:id"
              element={<CourseNotifes />}
            />
            <Route
              path="/panel/course/students/:id"
              element={<StudentList />}
            />
            <Route path="/panel/new-coures" element={<TeacherNewCourse />} />
            <Route path="/panel/coures" element={<TeacherBuyCourse />} />
            <Route path="/panel/live" element={<Live />} />
            <Route path="/panel/wallet" element={<Wallet />} />
            <Route path="/panel/payments" element={<Payments />} />
            <Route
              path="/panel/course/course-homework/:id"
              element={<CourseHomework />}
            />
            <Route path="/panel/course/quiz/:id" element={<TeacherQuiz />} />
            <Route
              path="/panel/course/quiz/new/:courseid"
              element={<QuizForm />}
            />
            <Route
              path="/panel/course/quiz/edit/:courseid/:id"
              element={<QuizForm />}
            />
            <Route
              path="/panel/course/quiz/questions/:id"
              element={<QuizQuestion />}
            />
            <Route path="/panel/course/forum/:id" element={<Forum />} />
            <Route path="/panel/course/students/:id" element={<Students />} />
            <Route path="/*" element={<Navigate to="/panel/dashboard" />} />
          </Route>
        )}
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer rtl={true} />

      {!location.pathname.includes("panel") && <Footer />}
    </CacheProvider>
  );
}

export default App;
