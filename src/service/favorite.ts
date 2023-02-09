import { AxiosError } from "axios";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../http";
import { BoardObj } from "../types/component.types";

const queryClient = useQueryClient();
const navigate = useNavigate();

export const addToFavorite = (
  boardId: string,
  workspaceId: string,
  type: string
) => {
  axiosInstance
    .post("/favorite/add", { boardId: boardId })
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
            return oldData.map((board: BoardObj) => {
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
        const data = error.response.data;
      }
    });
};

export const removeFavorite = (
  favoriteId: string,
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
