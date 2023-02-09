import { AxiosError } from "axios";
import React from "react";
import axiosInstance from "../../http";
import { CardDetailObj, LabelObj } from "../../types/component.types";
import { QueryClient, useQuery, useQueryClient } from "react-query";
import { HiOutlineX } from "react-icons/hi";
import { AiOutlinePlus, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { leaveScope } from "immer/dist/internal";

export interface Props {
  setShowLabel: React.Dispatch<React.SetStateAction<boolean>>;
  Cardlabels?: LabelObj[];
  CardRole: string;
  boardId: string;
  cardId: string;
}

function LabelUpdate({
  setShowLabel,
  Cardlabels,
  CardRole,
  cardId,
  boardId,
}: Props) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const addLabel = (labelId: string) => {
    axiosInstance
      .put(`/card/${cardId}/labels`, { labelId })
      .then((response) => {
        const data = response.data;

         setShowLabel(false);

        queryClient.setQueryData(["getCard", cardId], (oldData: any) => {
          return {
            ...oldData,
            labels: oldData.labels
              ? [...oldData.labels, data.label]
              : [data.label],
          };
        });

        queryClient.invalidateQueries(["getAllMyCards"]);
        queryClient.invalidateQueries(["getLists", boardId]);
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          console.log(error.response);
        } else if (error.request) {
          console.log("something went wrong");
        } else {
          console.log(error);
        }
      });
  };

  const removeLabel = (labelId: string) => {
    axiosInstance
      .delete(`/card/${cardId}/labels`, { data: { labelId } })
      .then((response) => {

        setShowLabel(false)
        queryClient.setQueryData(["getCard", cardId], (oldData: any) => {
          return {
            ...oldData,
            labels: oldData.labels
              ? oldData.labels.filter((label: any) => label._id !== labelId)
              : [],
          };
        });

        queryClient.invalidateQueries(["getAllMyCards"]);
        queryClient.invalidateQueries(["getLists", boardId]);
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          console.log(error.response);
        } else if (error.request) {
          console.log("something went wrong");
        } else {
          console.log(error);
        }
      });
  };

  const getAllLabels = async ({ queryKey }: any) => {
    const response = await axiosInstance.get(`board/${queryKey[1]}/labels`);
    const data = response.data;
    console.log(data.AllLabels);
    return data.labels;
  };

  const {
    data: AllLabels,
    isLoading,
    error,
  } = useQuery<LabelObj[] | undefined, any, LabelObj[], string[]>(
    ["getAllLabels", boardId],
    getAllLabels
  );

  return (
    <div className="rounded absolute top-8 left-0 z-10 w-full bg-white shadow-lg p-2">
      <div>
        <div className="flex items-center justify-between px-2 py-1 ">
          <span className="font-semibold">Labels</span>
          <button onClick={() => setShowLabel(false)}>
            <HiOutlineX size={15} />
          </button>
        </div>

        <div className="px-2 rounded ">
          {AllLabels && AllLabels.length > 0 ? (
            AllLabels.map((label: any) => (
              <div
                key={label._id}
                className="flex items-center w-full  justify-between"
              
              >
                <span className="font-semibold w-1/2 px-2 py-1 " style={{
                  background: label.color,
                }}>
                  {label.name && label.name.length > 20
                    ? label.name.slice(0, 20) + "..."
                    : label.name}
                </span>

                {Cardlabels?.map((cardLabel: any) => cardLabel._id.toString()).includes(
                  label._id.toString()
                ) ? (
                  <button onClick={() => removeLabel(label._id)}>
                    <AiOutlineDelete size={20} />
                  </button>
                ) : (
                  <button onClick={() => addLabel(label._id)}>
                    <AiOutlinePlus size={20} />
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

export default LabelUpdate;
