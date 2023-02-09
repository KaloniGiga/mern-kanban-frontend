import React, { useState } from "react";
import { AxiosError } from "axios";
import Input from "../Input/Input";
import SelectBackground from "../CustomSelectButton/SelectBackground";
import SelectWorkSpace from "../CustomSelectButton/SelectWorkSpace";
import SelectBoardVisibility from "../CustomSelectButton/SelectBoardVisibility";
import Button from "../button/Button";
import axiosInstance from "../../http";
import { CgSpaceBetween } from "react-icons/cg";
import { SelectOption, WorkSpaceObj } from "../../types/component.types";
import { QueryClient, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { hideModal } from "../../redux/features/modalslice";

interface ModalProps {
  modalType: string | null;
  modalProps?: Object;
  title?: string;
  showCloseBtn?: boolean;
  textColor?: string;
  bg?: string;
}

function CreateBoardModal({ modalProps }: ModalProps) {
  const [values, setValues] = useState({
    name: "",
    bgImage: "",
    color: "",
    workspaceId: "",
    boardVisibility: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  //handleChange in input values
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  //handleChange in select Elements
  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  //change workspace
  const handleWorkSpaceChange = (choosenValue: any) => {
    setValues({ ...values, workspaceId: choosenValue });
  };

  const handleVisibilityChange = (choosenValue: any) => {
    console.log("this is the choosen value", choosenValue);
    setValues({ ...values, boardVisibility: choosenValue });
  };
  //handleChange in boardBackground
  const handleChangeBackground = (choosenValue: any, isColor: boolean) => {
    if (!isColor) {
      setValues({ ...values, bgImage: choosenValue });
    } else {
      setValues({ ...values, color: choosenValue });
    }
  };

  //handles the form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const board = {
      name: values.name,
      bgImage: values.bgImage,
      workspaceId: values.workspaceId,
      color: values.color,
      boardVisibility: values.boardVisibility,
    };

    console.log(board);

    axiosInstance
      .post("/board/create", board)
      .then((response) => {
        const data = response.data;
        console.log(data.board._id);
        queryClient.invalidateQueries(["getWorkSpaceBoards", data.workspaceId]);

        //update Workspacedata

        setIsSubmitting(false);
        dispatch(hideModal());

        //navigate to the new board
        navigate(`/home/board/${data.board._id}`);
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

  const visibilityOptions = [
    {
      value: "PUBLIC",
      name: "Public - All members of this workspace can see and edit this board",
    },
    {
      value: "PRIVATE",
      name: "Private - Only board members and workspace admins can see and edit this board",
    },
  ];

  const getMyWorkSpaces = async () => {
    const response = await axiosInstance.get("/workspace/me/owned");
    console.log(response);
    const data = response.data;

    return data.myWorkSpaces.map((w: any) => {
      return { id: w._id, name: w.name };
    });
  };

  const { data, isLoading, isFetching, error } = useQuery<
    SelectOption[] | undefined,
    any,
    SelectOption[],
    string[]
  >(["getMyWorkSpaces"], getMyWorkSpaces, { cacheTime: 0, staleTime: 0 });

  return (
    <div className="px-2">
      <h1 className="font-semibold text-xl mb-2">Create a Board</h1>

      <form onSubmit={handleSubmit}>
        {/* Enter Board Title */}
        <Input
          label="Board Title"
          typeName="text"
          placeholder="Enter Board Title"
          name="name"
          value={values.name}
          onChange={handleChangeInput}
        />

        {/* Choose Background color */}
        <SelectBackground
          label="Choose_Background"
          changeBackgound={handleChangeBackground}
        />

        {/*Select Workspace  */}
        <SelectWorkSpace
          label="Choose WorkSpace"
          options={data}
          value={values.workspaceId}
          defaultWorkSpace={id}
          isFetching={false}
          isLoading={isLoading}
          handleWorkSpaceChange={handleWorkSpaceChange}
        />

        {/* Select Board visibility */}
        <SelectBoardVisibility
          label="Choose Board Visibility"
          options={visibilityOptions}
          defaultVisibility="PUBLIC"
          value={values.boardVisibility}
          handleVisibilityChange={handleVisibilityChange}
        />

        <div className="flex justify-center">
          <Button name="Create Board" classes="w-full mx-4" />
        </div>
      </form>
    </div>
  );
}

export default CreateBoardModal;
