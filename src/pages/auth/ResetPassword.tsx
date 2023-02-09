import Input from "../../component/Input/Input";
import React, { useEffect, useState } from "react";
import Button from "../../component/button/Button";
import axiosInstance from "../../http";
import { useNavigate, useParams } from "react-router-dom";
import { loginUser } from "../../redux/features/authSlice";
import { useDispatch } from "react-redux";
import { Axios, AxiosError } from "axios";
import { addToast } from "../../redux/features/toastSlice";
import { ToastKind } from "../../types/component.types";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/app/store";

function ResetPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
  });

  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { accessToken, refreshToken } = useSelector(
    (state: RootState) => state.auth
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const FORGOT_PASSWORD_TOKEN_LENGTH = import.meta.env
    .VITE_FORGOT_PASSWORD_TOKEN_LENGTH;

  useEffect(() => {
    if (!params.token ) {
      dispatch(
        addToast({
          kind: ToastKind.ERROR,
          msg: "Your password reset link has expired.",
        })
      );
    }

    if (accessToken || refreshToken) {
      navigate("/home/page", { replace: true });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault()
    setIsSubmitting(true);

    const data = {
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    axiosInstance
      .post(`/password/reset/${params.token}`, data)
      .then((response) => {
        const data = response.data;

        setIsSubmitting(false);
        dispatch(
          loginUser({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          })
        );

        setError("");
        navigate("/home/page", { replace: true });
      })
      .catch((error: AxiosError<any, any>) => {
        setIsSubmitting(false);

        if (error.response) {
          const response = error.response;
          const { message } = response.data;

          switch (response.status) {
            case 404:
              dispatch(addToast({ kind: ToastKind.ERROR, msg: message }));
              // if authenticated
              if (accessToken || refreshToken) {
                navigate("/home/page", { replace: true });
              } else {
                navigate("/auth/forget/password", { replace: true });
              }
              break;
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
      });
  };

  return (
    <div className="h-screen w-full bg-surface flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-sm px-8 py-6 bg-white drop-shadow-2xl rounded-2xl"
      >
        <h3 className="text-center mb-2 text-xl font-semibold">
          Reset your password.
        </h3>

        <Input
          typeName="password"
          placeholder="Enter New Password"
          name="password"
          label="New Password"
          onChange={handleChange}
          value={values.password}
        />
        <Input
          typeName="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          label="Confirm Password"
          onChange={handleChange}
          value={values.confirmPassword}
        />

        <Button
          name="Submit"
          color="secondary"
          hoverColor="secondary_dark"
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
}

export default ResetPassword;
