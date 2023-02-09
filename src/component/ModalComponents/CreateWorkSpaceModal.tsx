import React, { useCallback, useState } from "react";
import Button from "../button/Button";
import Input from "../Input/Input";
import AsyncSelect from "react-select/async";
import debounce from "debounce-promise";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import axiosInstance from "../../http";
import { hideModal } from "../../redux/features/modalslice";
import { AxiosError } from "axios";
import { RootState } from "../../redux/app/store";

interface UserObj {
  _id: string;
  username: string;
  avatar: string;
}

interface WorkSpaceObj {
  name: string;
  description: string;
}

function CreateWorkSpaceModal() {
  const [values, setValues] = useState<WorkSpaceObj>({
    name: "",
    description: "",
  });

  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const workspaceValues = {
      name: values.name,
      description: values.description,
    };

    console.log(workspaceValues);

    setIsSubmitting(true);

    axiosInstance
      .post("/workspace/create", workspaceValues)
      .then((res) => {
        const data = res.data.workspace;
        //update workspace list
        queryClient.setQueryData([`getWorkSpaces`], (oldData: any) => {
          return [...oldData, data];
        });

        setIsSubmitting(false);
        //navigate to newly created workspace
        console.log(data);
        dispatch(hideModal());
        navigate(`/home/workspace/${data.workspace._id}/boards`);
      })
      .catch((error: AxiosError) => {
        setIsSubmitting(false);

        if (error.response) {
          const response = error.response;
          const message = response.data;

          //add error toast
        } else if (error.request) {
          console.log("request has problem");
        } else {
          //add error toast
          console.log("Oops, something went wrong");
        }
      });
  };

  return (
    <>
      <div className="flex flex-col w-full justify-center">
        <h1 className="font-semibold text-xl ml-3">Create your WorkSpace</h1>

        <form className="w-full px-3" onSubmit={(e) => handleSubmit(e)}>
          <Input
            typeName="text"
            placeholder="WorkSpace Name"
            name="name"
            label="WorkSpace"
            value={values.name}
            onChange={handleInputChange}
          />

          <label htmlFor="description" className="font-semibold">
            Description
          </label>
          <br />
          <textarea
            rows={3}
            className="border-2 w-full border-black mt-3 p-2 mb-2"
            placeholder="Write description here..."
            name="description"
            value={values.description}
            onChange={handleTextChange}
          ></textarea>
          <br />

          <Button name="Submit" hoverColor="black" classes="w-full" />
        </form>
      </div>
    </>
  );
}

export default CreateWorkSpaceModal;
