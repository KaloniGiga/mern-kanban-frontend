import { useQuery } from "react-query";
import React from "react";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import axiosInstance from "../../../http";
import Loader from "../../Loader/loader";
import WorkSpaceItem from "./WorkSpaceItem";
import WorkSpaceBoardItem from "./WorkSpaceBoardItem";
import { WorkSpaceObj } from "../../../types/component.types";
import { showModal } from "../../../redux/features/modalslice";

export interface WorkSpaceListProps {
  isInSideBar: boolean;
}

function WorkSpaceList({ isInSideBar }: WorkSpaceListProps) {
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const getWorkSpaces = async () => {
    const response = await axiosInstance.get("/workspaces");
    const data = response.data;
    return data.workspaces;
  };

  const { isLoading, data, error } = useQuery<WorkSpaceObj[] | undefined, any>(
    ["getWorkSpaces"],
    getWorkSpaces
  );

  if (isLoading) {
    return (
      <div className="h-15 w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-15 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm text-primary">
            Oops! Something went wrong.
          </span>
          <button
            type="button"
            onClick={() => {
              queryClient.invalidateQueries(["getWorkSpaces"]);
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isInSideBar && (
        <h3 className="mb-2 text-xl font-semibold">Your Workspaces</h3>
      )}

      {data && data.length > 0 ? (
        isInSideBar ? (
          data.map((workspace) => {
            return (
              <WorkSpaceItem
                key={workspace._id}
                id={workspace._id}
                name={workspace.name}
              />
            );
          })
        ) : (
          <div className="flex gap-1">
            <button
              onClick={() => {
                dispatch(showModal({ modalType: "CREATE_WORKSPACE_MODAL" }));
              }}
              className="flex items-center justify-center hover:opacity-60 rounded"
              style={{
                width: 200,
                maxWidth: 300,
                height: 120,
                backgroundColor: "#F5F6F8",
              }}
            >
              <h3>Create a workspace.</h3>
            </button>

            {data.map((workspace) => {
              return (
                <WorkSpaceBoardItem key={workspace._id} workspace={workspace} />
              );
            })}
          </div>
        )
      ) : (
        <>
          {isInSideBar ? (
            <button
              className="flex items-center  justify-center hover:opacity-70 rounded"
              onClick={() => {
                dispatch(showModal({ modalType: "CREATE_SPACE_MODAL" }));
              }}
            >
              <h3 className="w-full text-primary">Create a Workspace</h3>
            </button>
          ) : (
            <button
              className="flex items-center  justify-center hover:opacity-70 rounded"
              style={{
                width: 200,
                maxWidth: 300,
                height: 120,
                backgroundColor: "#F5F6F8",
              }}
              onClick={() => {
                dispatch(showModal({ modalType: "CREATE_WORKSPACE_MODAL" }));
              }}
            >
              <h3>Create a Workspace</h3>
            </button>
          )}
        </>
      )}
    </>
  );
}

export default WorkSpaceList;
