import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../http";
import { hideModal } from "../../redux/features/modalslice";
import Input from "../Input/Input";
import Button from "../button/Button";
import { is } from "immer/dist/internal";

export interface Props {
  modalProps: {
    boardName: string;
    listLength: number;
  };
}

export interface valueProps {
  name: string;
  boardId: string | undefined;
  position: string;
}

function CreateListModal({ modalProps }: Props) {
  const { boardId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [values, setValues] = useState<valueProps>({
    name: "",
    boardId: "",
    position: "",
  });

  useEffect(() => {
    console.log(modalProps);
    setValues({
      ...values,
      boardId: boardId,
      position: String(modalProps?.listLength),
    });
  }, [boardId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) > modalProps?.listLength + 1) {
      //give error
      return;
    }
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const list = {
      name: values.name,
      boardId: boardId,
      position: values.position,
    };

    console.log(list);

    axiosInstance
      .post(`/list/create`, list)
      .then((response) => {
        const data = response.data;
        queryClient.invalidateQueries(["getBoardList", boardId]);
        //  queryClient.setQueryData(["getBoardList", boardId], (oldData:any) => {
        //       return [...oldData, data.list]
        //  })

        setIsSubmitting(false);
        dispatch(hideModal());
      })
      .catch((error: AxiosError) => {
        setIsSubmitting(false);

        if (error.response) {
          const message = error.response.data;
        } else if (error.request) {
        } else {
        }
      });
  };

  return (
    <div className=" flex flex-col p-4 items-center ">
      <h1 className="font-semibold text-2xl mb-2">Create a List</h1>

      <form action="" onSubmit={handleSubmit} className="w-full">
        <Input
          label="List Name"
          typeName="text"
          placeholder="Enter List Name"
          name="name"
          value={values.name}
          onChange={handleInputChange}
        />

        <Input
          label="Board Name"
          typeName="text"
          placeholder="Enter Board Name"
          name="boardId"
          value={modalProps?.boardName}
        />

        <Input
          label="Position"
          typeName="text"
          placeholder="Enter Position"
          name="position"
          value={values.position}
          onChange={handlePositionChange}
        />

        <div className="flex justify-center">
          <Button
            name="Create List"
            classes="w-full mx-4"
            isSubmitting={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}

export default CreateListModal;
