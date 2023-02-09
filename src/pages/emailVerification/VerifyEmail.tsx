import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Toast } from "react-toastify/dist/components";
import axiosInstance from "../../http";
import { RootState } from "../../redux/app/store";
import { addToast } from "../../redux/features/toastSlice";
import { ToastKind } from "../../types/component.types";

function VerifyEmail() {
  const { token } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {accessToken, refreshToken} = useSelector((state: RootState) => state.auth);
  const {user} = useSelector((state:RootState) => state.auth);

  useEffect(() => {

    if(!accessToken || !refreshToken){
        navigate('/auth/login')
        dispatch(addToast({kind: ToastKind.WARNING, msg: "First Login to your account"}))
    }else if(!user?.email){
      navigate('/auth/login')
      dispatch(addToast({kind: ToastKind.WARNING, msg: "First Login to your account"}))
    }

    axiosInstance
      .get(`/email/verify/${token}?userId=${searchParams.get("userId")}`)
      .then((response) => {
        const data = response.data;
        dispatch(addToast({ kind: ToastKind.SUCCESS, msg: data.message }));
        navigate("/home/page", { replace: true });
      })
      .catch((error) => {
        if (error.response) {
          const response = error.response;
          const { message } = response.data;

          switch (response.status) {
            case 400:
            case 500:
              dispatch(addToast({ kind: ToastKind.ERROR, msg: message }));
              break;
            default:
              dispatch(
                addToast({
                  kind: ToastKind.ERROR,
                  msg: "Oops, something went wrong",
                })
              );
              break;
          }
        } else if (error.request) {
          dispatch(
            addToast({
              kind: ToastKind.ERROR,
              msg: "Oops, something went wrong",
            })
          );
        } else {
          dispatch(
            addToast({ kind: ToastKind.ERROR, msg: `Error: ${error.message}` })
          );
        }

        navigate("/home/page", { replace: true });
      });
  }, []);

  return <div></div>;
}

export default VerifyEmail;
