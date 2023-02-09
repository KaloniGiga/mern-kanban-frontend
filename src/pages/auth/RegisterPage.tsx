import Input from "../../component/Input/Input";
import Button from "../../component/button/Button";
import GoogleAuthButton from "../../component/GoogleAuth/GoogleAuthButton";
import { useNavigate, Navigate, NavLink, useLocation } from "react-router-dom";
import React, { useState } from "react";
import axiosInstance from "../../http";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/features/authSlice";
import { AxiosError } from "axios";
import Error from "../../component/Error/Error";

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const user = {
      username: values.username,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    //post the data to the server
    axiosInstance
      .post("/register", user)
      .then((response) => {
        const data = response.data;

        setError("");

        dispatch(
          loginUser({
            accessToken: data.token.accessToken,
            refreshToken: data.token.refreshToken,
          })
        );

        setIsSubmitting(false);
        navigate("/home/page");
      })
      .catch((error: AxiosError<any, any>) => {
        setIsSubmitting(false);

        if (error.response) {
          const response = error.response;
          const { message } = response.data.message;

          switch (response.status) {
            case 400:
            case 401:
            case 500:
              setError(message);
              break;
            default:
              setError("Oops, something went wrong");
              break;
          }
        } else if (error.request) {
          setError("Oops, something went wrong");
        } else {
          setError(`Error:${error.message}`);
        }
      });
  };

  return (
    <div
      className={`flex justify-center items-center bg-slate-300 ${
        location.pathname === "/auth/register" ? "pt-[35px]" : "pt-32"
      } pb-16`}
    >
      <form
        onSubmit={handleSubmit}
        className="  flex flex-col w-full max-w-sm px-8 py-8 mb-8 bg-white rounded"
      >
        <h1 className="font-bold text-center mb-3 text-2xl">Sign Up</h1>
        {error && (
          <div className="mt-2 mb-2 text-center">
            <Error message={error} />
          </div>
        )}

        <Input
          typeName="text"
          value={values.username}
          onChange={handleChange}
          placeholder="Enter you user name"
          name="username"
          label="User Name"
        />

        <Input
          typeName="email"
          value={values.email}
          onChange={handleChange}
          placeholder="Enter you email"
          name="email"
          label="Email address"
        />

        <Input
          typeName="password"
          value={values.password}
          onChange={handleChange}
          placeholder="Enter you password"
          name="password"
          label="Enter Password"
        />

        <Input
          typeName="password"
          value={values.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          name="confirmPassword"
          label="Confirm Password"
        />

        <Button
          name="Sign Up"
          color="secondary"
          hoverColor="secondary_dark"
          isSubmitting={isSubmitting}
        />

        <h2 className="text-center w-full border-b-2 border-solid border-black mt-3 mb-3">
          <span className="px-5 py-5 bg-white text-semibold tracking widest leading-0">
            OR
          </span>
        </h2>

        <GoogleAuthButton setError={setError} />

        <NavLink
          to="/auth/login"
          className={
            "text-center mt-4 hover:text-black text-link font-semibold"
          }
        >
          Already have an account.
        </NavLink>
      </form>
    </div>
  );
}

export default RegisterPage;
