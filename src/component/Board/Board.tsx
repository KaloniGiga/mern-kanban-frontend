import { BoardObj, ToastKind } from "../../types/component.types";
import { useDispatch } from "react-redux";
import { useQueryClient } from "react-query";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { CgOverflow } from "react-icons/cg";
import { HiOutlineStar } from "react-icons/hi";
import axiosInstance from "../../http";
import { AxiosError } from "axios";
import { AiFillStar } from "react-icons/ai";
import { addToast } from "../../redux/features/toastSlice";

interface BoardPropsType {
  board: BoardObj;
  workspaceId: string;
}

function Board({ board, workspaceId }: BoardPropsType) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState<boolean>(false);

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
      .catch((error) => {
        if (error.response) {
          const response = error.response;
          const { message } = response.data;

          switch (response.status) {
            case 404:
              dispatch(addToast({ kind: ToastKind.ERROR, msg: message }));
              queryClient.invalidateQueries(["getWorkSpaces"]);
              queryClient.invalidateQueries(["getFavorites"]);
              // redirect them to home page

              break;
            case 400:
            case 500:
              dispatch(addToast({ kind: ToastKind.ERROR, msg: message }));
              break;
            default:
              dispatch(
                addToast({
                  kind: ToastKind.ERROR,
                  msg: "Oops, something went wrong",
                })
              );
          }
        } else if (error.request) {
          dispatch(
            addToast({
              kind: ToastKind.ERROR,
              msg: "Oops, something went wrong",
            })
          );
        } else {
          dispatch(
            addToast({ kind: ToastKind.ERROR, msg: `Error: ${error.message}` })
          );
        }
      });
  };

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
      .catch((error) => {
        if (error.response) {
          const response = error.response;
          const { message } = response.data;

          switch (response.status) {
            case 404:
              dispatch(addToast({ kind: ToastKind.ERROR, msg: message }));
              queryClient.invalidateQueries(["getWorkSpaces"]);
              queryClient.invalidateQueries(["getFavorites"]);

              break;
            case 400:
            case 500:
              dispatch(addToast({ kind: ToastKind.ERROR, msg: message }));
              break;
            default:
              dispatch(
                addToast({
                  kind: ToastKind.ERROR,
                  msg: "Oops, something went wrong",
                })
              );
          }
        } else if (error.request) {
          dispatch(
            addToast({
              kind: ToastKind.ERROR,
              msg: "Oops, something went wrong",
            })
          );
        } else {
          dispatch(
            addToast({ kind: ToastKind.ERROR, msg: `Error: ${error.message}` })
          );
        }
      });
  };

  return (
    <NavLink to={`/home/board/${board._id}`}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative h-25 text-white drop-shadow-xl font-semibold rounded cursor-pointer hover:bg-surface bg-suface "
        style={{
          background: board.bgImage ? `url(${board.bgImage})` : board.color,
          backgroundSize: "cover",
          backgroundOrigin: "border-box",
          backgroundRepeat: "no-repeat",
          width: "220",
          maxHeight: "250",
          backgroundPosition: "50%",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute top-0 left-0 px-2 py-2 ">{board.name}</div>

        {isHovered && (
          <div className="absolute bottom-1 right-1 hover:opacity-60 ">
            {board.isFavourite ? (
              <button
                onClick={() =>
                  removeFavorite(board.FavouriteId, board._id, workspaceId)
                }
              >
                <AiFillStar size={20} fill="#fbbf20" />
              </button>
            ) : (
              <button onClick={() => addToFavorite(board._id, workspaceId)}>
                <HiOutlineStar size={20} />
              </button>
            )}
          </div>
        )}
      </div>
    </NavLink>
  );
}

export default Board;
