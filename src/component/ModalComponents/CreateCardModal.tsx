import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import axiosInstance from "../../http";
import { hideModal } from "../../redux/features/modalslice";
import Input from "../Input/Input";
import Button from "../button/Button";
import { AxiosError } from "axios";
import AddCoverImage from "../Board/CreateCardComponents/AddCoverImage";
import AddColor from "../Board/CreateCardComponents/AddColor";

export interface modalProps {
  modalProps: {
    listId: string;
    boardId: string;
    cardLength: number;
  };
}

export interface valueProps {
  name: string;
  listId: string | undefined;
  position: string;
  description: string;
  color: string;
  coverImage: string;
  expireDate: string;
}

function CreateCardModal({ modalProps }: modalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const { boardId } = useParams();

  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  const [values, setValues] = useState<valueProps>({
    name: "",
    listId: "",
    description: "",
    color: "",
    coverImage: "",
    position: "",
    expireDate: "",
  });

  useEffect(() => {
    console.log(modalProps);
    setValues({
      ...values,
      listId: modalProps.listId,
      position: String(modalProps?.cardLength),
    });
  }, [modalProps.listId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: String(e.target.value) });
  };

  const handleCoverChange = (currChoosen: any) => {
    setValues({ ...values, coverImage: currChoosen });
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleColorChange = (currChoosen: any) => {
    setValues({ ...values, color: currChoosen });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const list = {
      name: values.name,
      listId: values.listId,
      description: values.description,
      position: values.position,
      color: values.color,
      coverImage: values.coverImage,
      expireDate: values.expireDate,
    };

    console.log(list);

    axiosInstance
      .post(`/card/create`, list)
      .then((response) => {
        const data = response.data;
        console.log(data);
        queryClient.invalidateQueries(["getBoardList", boardId]);
        //  queryClient.setQueryData(["getBoardList", modalProps.boardId], (oldData:any) => {
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
    <div className=" flex flex-col px-4 items-center ">
      <h1 className="font-semibold text-2xl mb-1">Create a Card</h1>

      <form action="" onSubmit={handleSubmit} className="w-full">
        <Input
          label="List Name"
          typeName="text"
          placeholder="Enter List Name"
          name="name"
          value={values.name}
          onChange={handleInputChange}
        />

        <div className="flex flex-col ">
          <label htmlFor="description" className="font-semibold">
            Description
          </label>
          <textarea
            rows={2}
            cols={8}
            name="description"
            id="description"
            className="p-2 text-md border-2 mt-1"
            onChange={handleTextAreaChange}
          />
        </div>

        <AddCoverImage
          label="Add a Cover Image"
          changeCover={handleCoverChange}
        />

        <AddColor
          label="Add Background Color"
          changeColor={handleColorChange}
        />

        <Input
          label="Due Date"
          typeName="Date"
          placeholder="Enter Due Date"
          name="expireDate"
          value={values.expireDate}
          onChange={handleInputChange}
        />

        <div className="flex justify-center">
          <Button
            name="Create Card"
            classes="w-full mx-4 mt-1"
            isSubmitting={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}

export default CreateCardModal;
