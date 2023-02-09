import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserProfile from "./component/UserProfile/UserProfile";
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { ToastContainer } from "react-toastify";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AuthenticationLayout from "./pages/Layout/AuthenticationLayout";
import { PrivateRoute } from "./PrivateRoute";
import MainLayout from "./pages/Layout/MainLayout";
import VerifyEmail from "./pages/emailVerification/VerifyEmail";
import { useState } from "react";
import { Suspense, lazy } from "react";
import WorkSpaceLayout from "./pages/Layout/WorkSpaceLayout";
import Error404 from "./pages/Error/Error404";
import Sidebar from "./component/Sidebar/Sidebar";
import WorkSpaceBoards from "./component/WorkSpace/WorkSpaceBoards";
import WorkSpaceMembers from "./component/WorkSpace/WorkSpaceMembers";
import WorkSpaceSettings from "./component/WorkSpace/WorkSpaceSettings";

import SelectMembersAsync from "./component/SelectMembersAsync/SelectMembersAsync";
import { useDispatch } from "react-redux";
import { showModal } from "./redux/features/modalslice";
import RecentBoards from "./component/RecentlyViewed/recentBoards";
import Toasts from "./component/Toast/Toast";
import 'react-toastify/dist/ReactToastify.css';

const HomePage = lazy(() => import("./pages/LandingPage/HomePage"));
const BoardDetail = lazy(() => import("./component/Board/BoardDetail"));

function App() {
  const [show, setShow] = useState(true);

  const handleClick = () => {
    setShow(!show);
  };

  const dispatch = useDispatch();

  return (
    <div>
      <Toasts />
      <ToastContainer />
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Authentication Route */}

            <Route path="recentBoard" element={<RecentBoards />} />

            <Route path="auth" element={<AuthenticationLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forget/password" element={<ForgotPassword />} />
            </Route>
            {/* Reset Password */}
            <Route path="reset/password/:token" element={<ResetPassword />} />
            <Route
              path="email/verify/:token"
              element={
                <PrivateRoute>
                  <VerifyEmail />
                </PrivateRoute>
              }
            />

            <Route path="/" element={<LandingPage />} />

            <Route
              path="home"
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            >
              <Route path="page" element={<HomePage />} />
              <Route path="profile" element={<UserProfile />} />
              <Route
                path="showModal"
                element={
                  <button
                    onClick={() =>
                      dispatch(
                        showModal({
                          modalType: "CONFIRM_REMOVE_WORKSPACE_MEMBER_MODAL",
                        })
                      )
                    }
                  >
                    Show Modal
                  </button>
                }
              />
              {/* <Route path='settings' element={<Setting />} /> */}

              <Route path="workspace" element={<WorkSpaceLayout />}>
                <Route
                  index
                  path=":id/boards"
                  element={<WorkSpaceBoards />}
                ></Route>
                <Route
                  path=":id/members"
                  element={<WorkSpaceMembers />}
                ></Route>
                <Route
                  path=":id/settings"
                  element={<WorkSpaceSettings />}
                ></Route>
              </Route>

              <Route path="board/:boardId" element={<BoardDetail />} />
              <Route path="*" element={<Error404 />} />
            </Route>

            <Route
              path="*"
              element={<Navigate to={"/auth/login"} replace={true} />}
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
