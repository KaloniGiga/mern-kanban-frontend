import React, { useCallback, useState, useEffect } from "react";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import {
  CardObj,
  CARD_DRAG_DIRECTION,
  ITEMTYPES,
  ListObj,
  LIST_DRAG_DIRECTION,
  ToastKind,
} from "../../../types/component.types";
import { HTML5Backend } from "react-dnd-html5-backend";
import { MdOutlineViewList } from "react-icons/md";
import List from "./List";
import { useQuery } from "react-query";
import axiosInstance from "../../../http";
import Loader from "../../Loader/loader";
import { showModal } from "../../../redux/features/modalslice";
import { HiOutlinePlus } from "react-icons/hi";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";
import { AxiosError } from "axios";
import { Lexorank } from "../../../service/lexorank";
import { addToast } from "../../../redux/features/toastSlice";

interface Props {
  boardId?: string;
  boardName?: string;
  workspaceId: string;
  myRole: string;
}

function BoardLists({ boardId, boardName, workspaceId, myRole }: Props) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { show } = useSelector((state: RootState) => state.sidebar);

  const getBoardList = async ({ queryKey }: any) => {
    const response = await axiosInstance(`/${queryKey[1]}/lists`);

    const data = response.data;
    console.log(data.lists);
    return data.lists;
  };

  const {
    isLoading,
    data: lists,
    error,
  } = useQuery<ListObj[] | undefined, any>(
    ["getBoardList", boardId],
    getBoardList
  );

  const moveList = useCallback(
    (listId: string, newPosition: string, direction: string) => {
      axiosInstance
        .put(`/lists/${listId}/dnd`, { newPosition, direction })
        .then((response) => {
          const data = response.data;

          queryClient.invalidateQueries(["getBoardList", boardId]);
        })
        .catch((error) => {
          if (error.response) {
            const response = error.response;
            const { message } = response.data;

            switch (response.status) {
              case 403:
                dispatch(addToast({ kind: ToastKind.ERROR, msg: message }));

                queryClient.invalidateQueries(["getBoard", boardId]);
                queryClient.invalidateQueries(["getBoardList", boardId]);
                queryClient.invalidateQueries(["getWorkSpaces"]);
                queryClient.invalidateQueries(["getFavorites"]);
                break;
              case 404:
                dispatch(addToast({ kind: ToastKind.ERROR, msg: message }));

                queryClient.invalidateQueries(["getBoard", boardId]);
                queryClient.invalidateQueries(["getBoardList", boardId]);
                queryClient.invalidateQueries(["getWorkSpaces"]);
                queryClient.invalidateQueries(["getFavorites"]);

                queryClient.invalidateQueries([
                  "getWorkSpaceBoards",
                  workspaceId,
                ]);
                queryClient.invalidateQueries([
                  "getWorkSpaceSettings",
                  workspaceId,
                ]);
                queryClient.invalidateQueries([
                  "getWorSpaceMembers",
                  workspaceId,
                ]);
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
                break;
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
              addToast({
                kind: ToastKind.ERROR,
                msg: `Error: ${error.message}`,
              })
            );
          }
        });
    },
    [boardId, workspaceId]
  );

  const handleDragEnd = (result: any, data: ListObj[]) => {
    const { source, destination, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      source.index === destination.index &&
      source.droppableId === destination.droppableId
    ) {
      return;
    }

    const lists = data.sort((a, b) => {
      if (a.pos < b.pos) {
        return -1;
      }

      if (a.pos > b.pos) {
        return 1;
      }

      return 0;
    });

    const lexorank = new Lexorank();

    if (type === "CARD") {
      const cards = data.map((list: any) => list.cards);
      let newCards: CardObj[] = [];

      const cardsOfSourceList = data
        .filter((list: any) => list._id === source.droppableId)
        .map((list: any) => list.cards)
        .sort((a, b) => {
          if (a.pos < b.pos) {
            return -1;
          }

          if (a.pos > b.pos) {
            return 1;
          }

          return 0;
        });

      const cardsOfDestinationList = data
        .filter((list: any) => list._id === destination.droppableId)
        .map((list: any) => list.cards)
        .sort((a, b) => {
          if (a.pos < b.pos) {
            return -1;
          }

          if (b.pos > b.pos) {
            return 1;
          }

          return 0;
        });

      const cardAboveDestination =
        cardsOfDestinationList[destination.index - 1];
      const cardBelowDestination =
        cardsOfDestinationList[destination.index + 1];

      const sourceCard = cardsOfSourceList[source.index];
      const destinationCard = cardsOfDestinationList[destination.index];

      if (source.droppableId === destination.droppableId) {
        let finalPosition: string;
        let direction: string;

        if (source.index > destination.index) {
          direction = CARD_DRAG_DIRECTION.UP;

          if (!cardAboveDestination) {
            const [pos] = lexorank.insert("0", destinationCard.pos);

            finalPosition = pos;
          } else {
            const [pos] = lexorank.insert(
              cardAboveDestination.pos,
              destinationCard.pos
            );

            finalPosition = pos;
          }
        } else {
          direction = CARD_DRAG_DIRECTION.DOWN;

          if (!cardBelowDestination) {
            const [pos] = lexorank.insert(destinationCard.pos, "");

            finalPosition = pos;
          } else {
            const [pos] = lexorank.insert(
              destinationCard.pos,
              destinationCard.pos
            );

            finalPosition = pos;
          }
        }

        // moveCard(draggableId, finalPosition, destination.droppableId, direction);

        newCards = [...cardsOfSourceList, ...cardsOfDestinationList].map(
          (card: any) => {
            if (card._id === draggableId) {
              return {
                ...card,
                pos: finalPosition,
              };
            }
          }
        );

        queryClient.setQueryData(["getLists", boardId], (oldData: any) => {
          return {
            ...oldData,
          };
        });

        return;
      }

      //if sourceList is different than destinationList
      let finalPosition: string;

      if (cardsOfDestinationList.length === 0) {
        finalPosition = "a";
      } else if (cardsOfDestinationList.length === 1) {
        //if one card exist, put the source card in the zeroth position
        if (destinationCard) {
          const [pos] = lexorank.insert("0", destinationCard.pos);

          finalPosition = pos;
        } else {
          const [pos] = lexorank.insert(destinationCard.pos, "");

          finalPosition = pos;
        }
      } else {
        //if there are many cards
        if (destination.index === 0) {
          const [pos] = lexorank.insert("0", destinationCard.pos);

          finalPosition = pos;
        } else if (destination.index === cardsOfDestinationList.length) {
          const [pos] = lexorank.insert(cardAboveDestination.pos, "");

          finalPosition = pos;
        } else {
          const [pos] = lexorank.insert(
            cardAboveDestination.pos,
            destinationCard.pos
          );

          finalPosition = pos;
        }
      }

      // moveCard(draggableId, finalPosition, destination.droppableId);

      queryClient.setQueryData(["getLists", boardId], (oldData: any) => {});
    }

    let newLists: ListObj[] = [];

    let finalPosition: string;
    let direction: string;

    const listAfterDestination = lists[destination.index + 1];
    const listBeforeDestination = lists[destination.index - 1];

    const sourceList = lists[source.index];
    const destinationList = lists[destination.index];

    const listAfterSource = lists[source.index + 1];

    if (sourceList.pos < destinationList.pos) {
      direction = LIST_DRAG_DIRECTION.RIGHT;

      if (!listAfterDestination) {
        const [pos] = lexorank.insert(destinationList.pos, "");
        finalPosition = pos;
      } else {
        const [pos] = lexorank.insert(
          destinationList.pos,
          listAfterDestination.pos
        );
        finalPosition = pos;
      }
    } else {
      direction = LIST_DRAG_DIRECTION.LEFT;

      if (!listBeforeDestination) {
        const [pos] = lexorank.insert("0", destinationList.pos);

        finalPosition = pos;
      } else {
        const [pos] = lexorank.insert(
          listBeforeDestination.pos,
          destinationList.pos
        );

        finalPosition = pos;
      }
    }

    moveList(draggableId, finalPosition, direction);

    newLists = lists.map((list: any) => {
      if (list._id === draggableId) {
        return {
          ...list,
          pos: finalPosition,
        };
      }

      return list;
    });

    queryClient.setQueryData(["getLists", boardId], (oldData: any) => {
      return newLists;
    });

    return;
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h1>Oops! Something went wrong!</h1>
        <h2></h2>
        <button>Retry</button>
      </div>
    );
  }

  return (
    <div className="flex relative w-full h-full">
      {lists && lists?.length > 0 ? (
        <div
          className="w-full h-full relative flex flex-col md:flex-row  items-start justify-start px-2 py-2  overflow-x-auto overflow-y-auto"
          style={{
            maxWidth: `${show ? "75vw" : "98vw"}`,
            maxHeight: "80vh",
          }}
        >
          <DndProvider backend={HTML5Backend}>
            {lists?.map((list: ListObj, index) => {
              return (
                <List
                  key={index}
                  list={list}
                  boardId={boardId}
                  cards={list.cards}
                  role={myRole}
                  workspaceId={workspaceId}
                  index={index}
                  lists={lists}
                />
              );
            })}
          </DndProvider>

          <div
            className="bg-board mx-2 my-2 rounded flex flex-col items-center justify-center px-2 py-8"
            style={{
              minHeight: "60vh",
              minWidth: "17vw",
            }}
          >
            <h1 className="font-semibold text-lg mx-2 my-1 text-center">
              Create a new List.
            </h1>
            <button
              className="px-4 py-1 mx-4 my-2 bg-secondary text-white flex rounded hover:opacity-50"
              onClick={() =>
                dispatch(
                  showModal({
                    modalType: "CREATE_LIST_MODAL",
                    modalProps: {
                      boardName: boardName,
                      listLength: lists?.length,
                    },
                  })
                )
              }
            >
              <span className="font-semibold">Add</span>
              <span className="rounded-full p-1 bg-white text-black ml-1">
                <HiOutlinePlus size={15} />
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-full px-3 py-2 flex flex-col">
          <h1 className="font-semibold text-xl text-center h-20">No Lists.</h1>

          <div
            className="bg-board mx-2 my-2 rounded flex flex-col items-center justify-center px-3 py-4"
            style={{
              minHeight: "40vh",
            }}
          >
            <h1 className="font-semibold text-lg mx-2 my-1 text-center">
              Create a new List.
            </h1>
            <button
              className="px-4 py-1 mx-4 my-2 bg-secondary text-white flex rounded hover:opacity-50"
              onClick={() =>
                dispatch(
                  showModal({
                    modalType: "CREATE_LIST_MODAL",
                    modalProps: {
                      boardName: boardName,
                      listLength: lists?.length,
                    },
                  })
                )
              }
            >
              <span className="font-semibold">Add</span>
              <span className="rounded-full p-1 bg-white text-black ml-1">
                <HiOutlinePlus size={15} />
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BoardLists;
