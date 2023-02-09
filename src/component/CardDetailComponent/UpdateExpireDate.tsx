import { AxiosError } from "axios";
import React from "react";
import axiosInstance from "../../http";
import { BoardLabel, CardDetailObj, CardObj, LabelObj } from "../../types/component.types";
import { useQuery } from "react-query";
import { HiOutlineX } from "react-icons/hi";
import { AiOutlineCheck, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

export interface Props {
  CardRole: string;
  setShowLabel: React.Dispatch<React.SetStateAction<boolean>>,
  CardLabels: BoardLabel[]
}


function UpdateExpireDate({setShowLabel, CardLabels, CardRole }: Props) {
 
  const addLabel = ({ queryKey }: any) => {
    axiosInstance
      .put(`/cards/${queryKey[1]}/labels`, { labelId: queryKey[1] })
      .then((response) => {})
      .catch((error: AxiosError) => {});
  };

  const removeLabel = ({ queryKey }: any) => {
    axiosInstance
      .delete(`/cards/${queryKey[1]}/labels`)
      .then((response) => {})
      .catch((error: AxiosError) => {});
  };

  const getAllLabels = async ({ queryKey }: any) => {
    const response = await axiosInstance.get(`cards/${queryKey[1]}/labels`);
    const data = response.data;
    return data.AllLabels;
  };

  const {
    data: AllLabels,
    isLoading,
    error,
  } = useQuery<LabelObj[] | undefined, any, LabelObj[], string[]>(
    ["getAllLabels"],
    getAllLabels
  );

  return (
    <div>
      <div className="rounded absolute top-5 left=0 z-100">
        <div className="flex items-center justify-between px-2 py-1 ">
          <span className="font-semibold">Labels</span>
          <button onClick={() => setShowLabel(false)}>
            <HiOutlineX size={15} />
          </button>
        </div>

        <div className="px-2 rounded text-white">
          {AllLabels && AllLabels.length > 0 ? (
            AllLabels.map((label: any) => (
              <div
                key={label._id}
                className="flex items-center w-full hover:bg-slate-700 justify-between"
                style={{
                  background: label.color,
                }}
              >
                <span className="font-semibold w-full">
                  {label.name && label.name.length > 30
                    ? label.name.slice(0, 30) + "..."
                    : label.name}
                </span>

                {CardLabels?.map((cardLabel: any) => cardLabel._id).includes(
                  label._id
                ) ? (
                  <button onClick={() => addLabel(label._id)}>
                    <AiOutlineCheck size={15} />
                  </button>
                ) : (
                  <button onClick={() => removeLabel(label._id)}>
                    <AiOutlineDelete />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div>There are no labels to add.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdateExpireDate;
