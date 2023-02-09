import React from "react";
import Input from "../Input/Input";
import Button from "../button/Button";
import { useState, useEffect } from "react";
import { hideModal } from "../../redux/features/modalslice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import { RootState } from "../../redux/app/store";
import axiosInstance from "../../http";
import { AxiosError } from "axios";
import { WorkSpace, WorkSpaceObj } from "../../types/component.types";

interface Props {
  modalProps: {
    workspaceId: string;
    name: string;
    description: string;
  };
}

function EditWorkSpaceModal({ modalProps }: Props) {
  const [values, setValues] = useState({
    name: modalProps.name,
    description: modalProps.description,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //  useEffect(() => {

  //    async function fetchWorkspace() {
  //     const data = await queryClient.fetchQuery<WorkSpace, any>(["getWorkSpaceDetail", workspaceId])
  //     setValues({
  //       ...values,
  //       name: data.name,
  //       description: data.description,
  //       picture: data.picture
  //     })
  //   }

  //   fetchWorkspace();

  //  }, [])

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
      .put(`/workspace/${modalProps.workspaceId}/settings`, workspaceValues)
      .then((res) => {
        const data = res.data.workspace;
        //update workspace list
        queryClient.setQueryData([`getWorkSpaces`], (oldData: any) => {
          return oldData.map((workspace: any) => {
            if (workspace._id === modalProps.workspaceId) {
              return {
                ...workspace,
                name: data.name,
                description: data.description,
                picture: data.picture,
              };
            } else {
              return workspace;
            }
          });
        });

        queryClient.invalidateQueries([
          "getWorkSpaceDetail",
          modalProps.workspaceId,
        ]);
        setIsSubmitting(false);
        //navigate to newly created workspace
        console.log(data);
        dispatch(hideModal());
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
        <h1 className="font-semibold text-lg pl-2">Update WorkSpace Detail</h1>

        <form className="pt-3 pl-3 pr-2" onSubmit={handleSubmit}>
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

          <Button name="Update" hoverColor="black" classes="w-full" />
        </form>
      </div>
    </>
  );
}

export default EditWorkSpaceModal;
