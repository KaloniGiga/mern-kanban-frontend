import axios from "axios";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import axiosInstance from "../../http";
import { hideModal } from "../../redux/features/modalslice";
import SelectLabelColor from "../Board/BoardMenu/SelectLabelColor";
import Button from "../button/Button";
import Input from "../Input/Input";

interface Props {
  modalProps: {
    boardId: string;
  };
}

function BoardLabelModal({ modalProps }: Props) {
  const [values, setValues] = useState({
    labelName: "",
    labelColor: "",
  });

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    console.log(values);
  };

  const handleSubmit = () => {
    const label = {
      name: values.labelName,
      color: values.labelColor,
    };
    console.log(values);

    axiosInstance
      .post(`/board/${modalProps.boardId}/labels`, label)
      .then((response) => {
        console.log(response.data.label);
        dispatch(hideModal());

        queryClient.invalidateQueries(["getAllLabels", modalProps.boardId]);
      })
      .catch((error) => {});
  };

  return (
    <div>
      <Input
        label="Label Name"
        typeName="text"
        placeholder="Enter Label Name"
        name="labelName"
        value={values.labelName}
        onChange={handleInputChange}
      />

      <h2 className="my-2 font-semibold">Choose Label Color</h2>
      <SelectLabelColor values={values} setValues={setValues} />

      <Button classes=" w-full" name="Create Label" onClick={handleSubmit} />
    </div>
  );
}

export default BoardLabelModal;
