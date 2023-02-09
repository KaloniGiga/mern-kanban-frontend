import React, { useState } from "react";
import { HiOutlineLockClosed } from "react-icons/hi";
import { HiOutlineLockOpen } from "react-icons/hi";
import { HiOutlineStar } from "react-icons/hi";
import { AiFillStar } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import { WorkSpaceObj } from "../../../types/component.types";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import axiosInstance from "../../../http";
import { AxiosError } from "axios";
import { MdPublic } from "react-icons/md";

export interface Props {
  workspace: WorkSpaceObj;
}

function WorkSpaceBoardItem({ workspace }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [isStarHovered, setIsStarHovered] = useState(false);

  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const addToFavorite = (workspaceId: string) => {
    axiosInstance
      .post("/favorite/add", { resourceId: workspaceId, type: "WORKSPACE" })
      .then((response) => {
        const data = response.data.favoriteResource;

        if (queryClient.getQueryData(["getWorkSpaceDetail", workspaceId])) {
          queryClient.setQueryData(
            ["getWorkSpaceDetail", workspaceId],
            (oldData: any) => {
              return {
                ...oldData,
                isFavorite: true,
                FavoriteId: data._id,
              };
            }
          );
        }

        queryClient.setQueryData(["getWorkSpaces"], (oldData: any) => {
          return oldData.map((workspace: any) => {
            if (workspace._id === workspaceId) {
              return {
                ...workspace,
                isFavorite: true,
                FavoriteId: data._id,
              };
            }
          });
        });

        if (queryClient.getQueryData(["getFavorites"])) {
          queryClient.setQueryData(["getFavorites"], (oldData: any) => {
            return [...oldData, data];
          });
        }
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          if (error.response.status === 404) {
            queryClient.invalidateQueries(["getWorkSpaces"]);
            queryClient.invalidateQueries(["getFavorites"]);

            navigate("/", { replace: true });
          }
        } else if (error.request) {
        }
      });
  };

  const removeFavorite = (favoriteId: string | null, workspaceId: string) => {
    axiosInstance.delete(`/favorite/${favoriteId}`).then((response) => {
      if (queryClient.getQueryData(["getWorkSpaceDetail", workspaceId])) {
        queryClient.setQueryData(
          ["getWorkSpaceDetail", workspaceId],
          (oldData: any) => {
            return {
              ...oldData,
              isFavorite: false,
              FavoriteId: null,
            };
          }
        );
      }

      queryClient.setQueryData(["getWorkSpaces"], (oldData: any) => {
        return oldData.map((workspace: any) => {
          if (workspace._id === workspaceId) {
            return {
              ...workspace,
              isFavorite: false,
              FavoriteId: null,
            };
          }
        });
      });

      if (queryClient.getQueryData(["getFavorites"])) {
        queryClient.setQueryData(["getFavorites"], (oldData: any) => {
          return oldData.filter(
            (fav: any) => fav._id.toString() !== favoriteId
          );
        });
      }
    });
  };

  return (
    <div className="relative mx-4">
      <NavLink
        to={`/home/workspace/${workspace._id}/boards`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: "block",
          width: 200,
          maxWidth: 300,
          height: 120,
          background: "white",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          boxShadow: `1px 1px 12px rgba(0, 0, 0, 0.5)`,
        }}
        className="h-30 rounded cursor-pointer font-semibold  hover:opacity-70"
      >
        <div className="absolute top-0 left-0 right-0 bottom-0 px-2 py-2 hover:text-primary text-xl">
          {workspace.name}
        </div>

        <span className="absolute right-2 top-2">
          {["PRIVATE"].includes(workspace.visibility) ? (
            <HiOutlineLockClosed size={25} />
          ) : (
            <MdPublic size={25} />
          )}
        </span>
      </NavLink>

      {isHovered && (
        <div className="absolute bottom-1 right-1 hover:bg-slate-200 hover:rounded-full">
          {workspace.isFavorite ? (
            <button
              onClick={() =>
                removeFavorite(workspace.favoriteId, workspace._id)
              }
            >
              <AiFillStar size={27} fill="#fbbf20" />
            </button>
          ) : (
            <button onClick={() => addToFavorite(workspace._id)}>
              <HiOutlineStar size={27} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default WorkSpaceBoardItem;
