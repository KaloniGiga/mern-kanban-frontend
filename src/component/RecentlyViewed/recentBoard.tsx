import { useState } from "react";
import { AiFillStar } from "react-icons/ai";
import {
  HiOutlineLockClosed,
  HiOutlineLockOpen,
  HiOutlineStar,
} from "react-icons/hi";
import { MdPublic } from "react-icons/md";
import { useQueryClient } from "react-query";
import { NavLink, useNavigate } from "react-router-dom";
import { Board, BoardObj } from "../../types/component.types";
import axiosInstance from "../../http";
import { AxiosError } from "axios";

interface Props {
  board: Board;
}

export const RecentBoard = ({ board }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const addToFavorite = (boardId: string, workspaceId: string) => {
    axiosInstance
      .post("/favorite/add", { resourceId: boardId, type: "BOARD" })
      .then((response) => {
        const data = response.data.favoriteResource;

        if (response.status === 201) {
          if (queryClient.getQueryData(["getBoard", boardId])) {
            queryClient.setQueryData(["getBoard", boardId], (oldData: any) => {
              return {
                ...oldData,
                isFavorite: true,
                favoriteId: data._id,
              };
            });
          }

          queryClient.setQueryData(
            ["getWorkSpaceBoards", workspaceId],
            (oldData: any) => {
              return oldData.map((board: any) => {
                if (board._id === boardId) {
                  return {
                    ...board,
                    isFavorite: true,
                    favoriteId: data._id,
                  };
                }

                return board;
              });
            }
          );

          if (queryClient.getQueryData(["getFavorites"])) {
            queryClient.setQueryData(["getFavorites"], (oldData: any) => {
              return [...oldData, data];
            });
          }
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

  const removeFavorite = (
    favoriteId: string | null,
    boardId: string,
    workspaceId: string
  ) => {
    axiosInstance
      .delete(`/favorite/${favoriteId}`)
      .then((response) => {
        if (queryClient.getQueryData(["getBoard", boardId])) {
          queryClient.setQueryData(["getBoard", boardId], (oldData: any) => {
            return {
              ...oldData,
              isFavorite: false,
              favoriteId: null,
            };
          });
        }

        queryClient.setQueryData(
          ["getWorkSpaceBoards", workspaceId],
          (oldData: any) => {
            return oldData.map((board: any) => {
              if (board._id === boardId) {
                return {
                  ...board,
                  isFavorite: false,
                  favoriteId: null,
                };
              }

              return board;
            });
          }
        );

        if (queryClient.getQueryData(["getFavorites"])) {
          queryClient.setQueryData(["getFavorites"], (oldData: any) => {
            return oldData.filter(
              (favorite: any) => favorite._id.toString() !== favoriteId
            );
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

  return (
    <div className="relative mx-4">
      <NavLink
        to={`/home/board/${board._id}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: "block",
          width: 200,
          maxWidth: 300,
          height: 120,
          background: board.bgImage ? `url(${board.bgImage})` : board.color,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          boxShadow: `1px 1px 12px rgba(0, 0, 0, 0.5)`,
        }}
        className=" h-30 rounded cursor-pointer font-semibold"
      >
        <div className="absolute top-2 left-2  px-2 py-2  hover:text-primary">
          {board.name}
        </div>

        <span className="absolute right-2 top-2">
          {["PRIVATE"].includes(board.visibility) ? (
            <HiOutlineLockClosed size={25} />
          ) : (
            <MdPublic size={25} />
          )}
        </span>
      </NavLink>

      {isHovered && (
        <div className="absolute bottom-1 right-1 hover:bg-slate-200 hover:rounded-full p-2">
          {board.isFavorite ? (
            <button
              onClick={() =>
                removeFavorite(board.FavoriteId, board._id, board.workspace._id)
              }
            >
              <AiFillStar size={27} fill="#fbbf20" />
            </button>
          ) : (
            <button
              onClick={() => addToFavorite(board._id, board.workspace._id)}
            >
              <HiOutlineStar size={27} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentBoard;
