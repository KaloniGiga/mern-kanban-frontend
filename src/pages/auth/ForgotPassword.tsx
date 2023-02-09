import React, { useEffect } from "react";
import Input from "../../component/Input/Input";
import Button from "../../component/button/Button";
import { useState } from "react";
import axiosInstance from "../../http";
import { useDispatch } from "react-redux";
import { addToast } from "../../redux/features/toastSlice";
import { ToastKind } from "../../types/component.types";
import { logOutUser } from "../../redux/features/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/app/store";

function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {accessToken, refreshToken} = useSelector((state:RootState) => state.auth);

  const [values, setValues] = useState({
    email: "",
  });

  const dispatch = useDispatch();

  useEffect(() => {
     if(accessToken || refreshToken){
        dispatch(logOutUser())
     }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
   
    e.preventDefault();

    setIsSubmitting(true);
    const data = {
      email: values.email,
    };

    axiosInstance
      .post(`/password/forget`, data)
      .then((response) => {
        const data = response.data;

        dispatch(addToast({ kind: ToastKind.SUCCESS, msg: "A email has been send. Check inbox!" }));
        setIsSubmitting(false);
      })
      .catch((error) => {
        setIsSubmitting(false);

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
      });
  };

  return (
    <div className="h-full bg-surface flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-sm px-8 py-6 bg-white drop-shadow-2xl rounded-2xl"
      >
        <h3 className="text-center mb-2 text-xl font-semibold">
          Find you email
        </h3>
        <p className="mb-3 text-md text-primary">
          A link will be sent to email. Check your inbox after submitting.
        </p>

        <Input
          typeName="email"
          placeholder="Enter your Email"
          name="email"
          label="Email Address"
          onChange={handleChange}
          value={values.email}
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

export default ForgotPassword;
