import React, { ReducerStateWithoutAction, useState } from "react";
import GoogleAuthButton from "../../component/GoogleAuth/GoogleAuthButton";
import Button from "../../component/button/Button";
import Input from "../../component/Input/Input";
import { NavLink } from "react-router-dom";
import axiosInstance from "../../http";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/features/authSlice";
import { RootState } from "../../redux/app/store";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import Error from "../../component/Error/Error";

function LoginPage() {
  const dispatch = useDispatch();
 
  const location = useLocation();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    const user = {
      email: values.email,
      password: values.password,
    };

    axiosInstance
      .post("/login", user)
      .then((response) => {
        const data = response.data;

        dispatch(
          loginUser({
            accessToken: data.token.accessToken,
            refreshToken: data.token.refreshToken,
          })
        );

        setError("");

        setIsSubmitting(false);
        navigate("/home/page");
      })
      .catch((error) => {
        setIsSubmitting(false);
        if (error.response) {
          const response = error.response;
          const message  = response.data.message;

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
    <div className="h-full bg-slate-300 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full flex flex-col max-w-sm px-8 py-4 rounded"
      >
        <h3 className="text-center text-2xl mb-2 font-semibold">Sign In</h3>
        {error && (
          <div className="mt-1 mb-1 text-center">
            <Error message={error} />
          </div>
        )}
  
        <Input
          typeName="text"
          onChange={handleChange}
          value={values.email}
          placeholder="Enter your email"
          name="email"
          label="Email address"
        />

        <Input
          typeName="password"
          onChange={handleChange}
          value={values.password}
          placeholder="Enter your password"
          name="password"
          label="Password"
        />

        <Button
          name="Sign In"
          color="secondary"
          hoverColor="secondary_dark"
          isSubmitting={isSubmitting}
        />

        <h2 className="text-center  border-b-2 border-solid border-black mt-3 mb-1">
          <span className="px-5 py-5 bg-white text-semibold tracking widest leading-0">
            OR
          </span>
        </h2>

        <GoogleAuthButton setError={setError} />

        <div className="flex justify-between mb-3 mt-4">
          <NavLink
            to={"/auth/register"}
            className={"text-center  hover:text-black text-link font-semibold"}
          >
            Don't have an account?
          </NavLink>

          <NavLink
            to={"/auth/forget/password"}
            className={"text-center  hover:text-black font-semibold text-link"}
          >
            Forgot Password
          </NavLink>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
