import React, { useCallback, useRef } from "react";
import {
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
  XYCoord,
} from "react-dnd";
import { BsThreeDots } from "react-icons/bs";
import { HiOutlineChatAlt, HiOutlineClock } from "react-icons/hi";
import { MdLabel } from "react-icons/md";
import { useDispatch } from "react-redux";
import { showModal } from "../../../redux/features/modalslice";
import {
  CardObj,
  ITEMTYPES,
  LabelObj,
  ListObj,
  ToastKind,
} from "../../../types/component.types";
import Avatar from "../../Avatar/Avatar";
import BoardMember from "../BoardMembers/BoardMember";
import axiosInstance from "../../../http";
import { useQueryClient } from "react-query";
import { AxiosError } from "axios";
import { CARD_DRAG_DIRECTION } from "../../../types/component.types";
import { Lexorank } from "../../../service/lexorank";
import { format } from "date-fns";
import { addToast } from "../../../redux/features/toastSlice";
import { useNavigate } from "react-router-dom";

export interface CardProps {
  boardId: string | undefined;
  workspaceId: string;
  role: string;
  card: CardObj;
  index: number;
  lists: ListObj[];
}

const Card = ({
  index,
  boardId,
  workspaceId,
  role,
  card,
  lists,
}: CardProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const moveCard = useCallback(
    (
      cardId: string,
      newPos: string,
      destListId: string,
      direction?: string
    ) => {
      axiosInstance
        .put(`/card/${cardId}/dnd`, { newPos, destListId, direction })
        .then((response) => {
          const data = response.data;

          if (data.refetch) {
            queryClient.invalidateQueries(["getBoardList", boardId]);
          }
        })
        .catch((error) => {
          if (error.response) {
            const response = error.response;
            const { message } = response.data;

            switch (response.status) {
              case 403:
              case 404:
                dispatch(addToast({ kind: ToastKind.ERROR, msg: message }));
                queryClient.invalidateQueries(["getWorkSpaces"]);
                queryClient.invalidateQueries(["getFavorites"]);

                queryClient.invalidateQueries(["getBoard", boardId]);
                queryClient.invalidateQueries(["getBoardList", boardId]);

                queryClient.invalidateQueries([
                  "getWorkSpaceBoards",
                  workspaceId,
                ]);
                queryClient.invalidateQueries([
                  "getWorkSpaceSettings",
                  workspaceId,
                ]);
                queryClient.invalidateQueries([
                  "getWorkSpaceMembers",
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

  const dragCardEnd = (result: any, data: ListObj[]) => {
    const { source, destination, draggableId, type } = result;

    console.log(result);

    if (!destination) {
      return;
    }

    if (
      source.index === destination.index &&
      source.droppableId.toString() === destination.droppableId.toString()
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
      const AllCards = lists.map((list: any) => list.cards);

      const cards = Array.prototype.concat.apply([], AllCards);

      let newCards: CardObj[] = [];

      const cardsOfSourceList = cards
        .filter(
          (card: any) =>
            card.listId.toString() === source.droppableId.toString()
        )
        .sort((a, b) => {
          if (a.position < b.position) {
            return -1;
          }

          if (a.position > b.position) {
            return 1;
          }

          return 0;
        });

      //const cardsOfSourceList = Array.prototype.concat.apply([], cardsOfSrcList);

      const cardsOfDestinationList = cards
        .filter(
          (card: any) =>
            card.listId.toString() === destination.droppableId.toString()
        )
        .sort((a, b) => {
          if (a.position < b.position) {
            return -1;
          }

          if (b.position > b.position) {
            return 1;
          }

          return 0;
        });

      //const cardsOfDestinationList = Array.prototype.concat.apply([], cardsOfDestList)

      const cardAboveDestination =
        cardsOfDestinationList[destination.index - 1];
      const cardBelowDestination =
        cardsOfDestinationList[destination.index + 1];

      const sourceCard = cardsOfSourceList[source.index];
      const destinationCard = cardsOfDestinationList[destination.index];

      console.log(cardsOfDestinationList);

      if (
        source.droppableId.toString() === destination.droppableId.toString()
      ) {
        let finalPosition: string;
        let direction: string;

        if (source.index > destination.index) {
          direction = CARD_DRAG_DIRECTION.UP;

          if (!cardAboveDestination) {
            const [pos] = lexorank.insert("0", destinationCard.position);

            finalPosition = pos;
          } else {
            const [pos] = lexorank.insert(
              cardAboveDestination.position,
              destinationCard.position
            );

            finalPosition = pos;
          }
        } else {
          direction = CARD_DRAG_DIRECTION.DOWN;

          if (!cardBelowDestination) {
            const [pos] = lexorank.insert(destinationCard.position, "");

            finalPosition = pos;
          } else {
            const [pos] = lexorank.insert(
              destinationCard.position,
              destinationCard.position
            );

            finalPosition = pos;
          }
        }

        moveCard(
          draggableId,
          finalPosition,
          destination.droppableId,
          direction
        );

        newCards = [...cardsOfSourceList]
          .map((card: any) => {
            if (card._id.toString() === draggableId.toString()) {
              return {
                ...card,
                pos: finalPosition,
              };
            }

            return card;
          })
          .sort((a, b) => {
            if (a.position > b.position) {
              return 1;
            }

            if (a.position < b.position) {
              return -1;
            }

            return 0;
          });

        queryClient.setQueryData(["getBoardList", boardId], (oldData: any) => {
          return oldData.map((list: any) => {
            if (list._id.toString() == source.droppableId.toString()) {
              return {
                ...list,
                cards: newCards,
              };
            } else {
              return list;
            }
          });
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
          console.log(destinationCard, destinationCard.position);

          const [pos] = lexorank.insert("0", destinationCard.position);

          finalPosition = pos;
        } else {
          const [pos] = lexorank.insert(destinationCard.position, "");

          finalPosition = pos;
        }
      } else {
        //if there are many cards
        if (destination.index === 0) {
          const [pos] = lexorank.insert("0", destinationCard.position);

          finalPosition = pos;
        } else if (destination.index === cardsOfDestinationList.length) {
          const [pos] = lexorank.insert(cardAboveDestination.position, "");

          finalPosition = pos;
        } else {
          const [pos] = lexorank.insert(
            cardAboveDestination.position,
            destinationCard.position
          );

          finalPosition = pos;
        }
      }

      moveCard(draggableId, finalPosition, destination.droppableId);

      const draggedCard = [...cardsOfSourceList].filter(
        (card: any) => card._id.toString() === draggableId.toString()
      );

      const newCardsOfSourceList = [...cardsOfSourceList].filter(
        (card: any) => card._id.toString() !== draggableId.toString()
      );

      const newCardsOfDestinationList = [
        ...cardsOfDestinationList,
        ...draggedCard,
      ].sort((a, b) => {
        if (a.position > b.position) {
          return 1;
        } else if (a.position < b.position) {
          return -1;
        }

        return 0;
      });

      console.log(newCardsOfDestinationList, draggedCard, newCardsOfSourceList);

      queryClient.setQueryData(["getBoardList", boardId], (oldData: any) => {
        return oldData.map((list: any) => {
          if (list._id.toString() === source.droppableId.toString()) {
            return {
              ...list,
              cards: newCardsOfSourceList,
            };
          } else if (
            list._id.toString() === destination.droppableId.toString()
          ) {
            return {
              ...list,
              cards: newCardsOfDestinationList,
            };
          } else {
            return list;
          }
        });
      });

      console.log(data);
    }
  };

  const moveCardHandler = (dragIndex: number, hoverIndex: number) => {};

  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: "Our first type",

    hover(item: any, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      // const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      console.log(item, hoverIndex, dragIndex);

      //  const clientOffset = monitor.getClientOffset();
      //     // Get pixels to the top
      //     const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      //     // Only perform the move when the mouse has crossed half of the items height
      //     // When dragging downwards, only move when the cursor is below 50%
      //     // When dragging upwards, only move when the cursor is above 50%
      //     // Dragging downwards
      //     if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      //         return;
      //     }
      //     // Dragging upwards
      //     if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      //         return;
      //     }
      //     // Time to actually perform the action
      //     moveCardHandler(dragIndex, hoverIndex);
      //     // Note: we're mutating the monitor item here!
      //     // Generally it's better to avoid mutations,
      //     // but it's good here for the sake of performance
      //     // to avoid expensive index searches.
      //     item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEMTYPES.CARD,
    item: { draggableId: card._id, index: index },
    end: (item: any, monitor: DragSourceMonitor) => {
      const dropResult: any = monitor.getDropResult();

      const result = {
        source: {
          index: item.index,
          droppableId: card.listId,
        },
        destination: {
          index: 0,
          droppableId: dropResult.destination.droppableId,
        },
        draggableId: item.draggableId,
        type: "CARD",
      };

      dragCardEnd(result, lists);
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const dispatch = useDispatch();
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className="cardWrapper cursor-pointer w-full px-1 py-1 shadow m-1 rounded flex flex-col"
      style={{
        maxWidth: "30vw",
        minWidth: "15vw",
        opacity: `${isDragging ? 0.4 : 1}`,
      }}

      onClick={() =>
        dispatch(
          showModal({
            modalType: "CARD_DETAIL_MODAL",
            modalProps: { _id: card._id, boardId: boardId, workspaceId },
          })
        )
      }
    >
      <div className="cardHeader w-full p-1 flex justify-between items-center">
        <h3 className="font-semibold">{card.name}</h3>

        <button
          className="cursor-pointer hover:opacity-70"
          onClick={() =>
            dispatch(
              showModal({
                modalType: "CARD_DETAIL_MODAL",
                modalProps: { _id: card._id, boardId: boardId, workspaceId },
              })
            )
          }
        >
          <span>
            <BsThreeDots size={25} />{" "}
          </span>
        </button>
      </div>

      <div className="cardBody w-full flex flex-col justify-center">
        {(card.coverImage || card.color) && (
          <div className="mb-2 w-full rounded-t">
            {card.coverImage ? (
              <img src={card.coverImage} className="w-full h-full rounded-t" />
            ) : (
              <div
                className="w-full h-full rounded-t"
                style={{
                  height: "100px",
                  background: `${card.color}`,
                }}
              ></div>
            )}
          </div>
        )}

        {card.labels && card.labels.length > 0 && (
          <div className="flex items-center flex-wrap gap-2 px-2 my-2">
            {card.labels.map((label: any) => (
              <div
                key={label._id}
                style={{ background: label.color }}
                className="text-sm p-1 rounded font-semibold text-white"
              >
                {label.name && label.name.length > 25
                  ? label.name.slice(0, 25) + "..."
                  : label.name}
              </div>
            ))}
          </div>
        )}

        {card.description && (
          <div>
            <span className="">{card.description}</span>
          </div>
        )}

        {card.expireDate && (
          <div
            className={`flex items-center rounded text-sm ${
              card.isComplete
                ? "bg-secondary text-white p-2"
                : new Date(card.expireDate) < new Date(Date.now())
                ? "bg-primary text-white p-2"
                : ""
            }`}
          >
            <HiOutlineClock size={20} className="mr-2" />
            <span>{format(new Date(card.expireDate), "dd/MM/yyyy")}</span>
          </div>
        )}

        {card.comments ? (
          <div className="flex my-1 items-center ">
            <HiOutlineChatAlt size={20} className="mr-3" />
            <span>{card.comments.length}</span>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className="flex items-center">
        {card.members &&
          (card.members.length > 8 ? (
            <>
              {card.members.slice(0, 8).map((member: any) => (
                <Avatar
                  src={member.avatar}
                  key={member._id}
                  size="30"
                  classes="w-7 h-7 cursor-default"
                />
              ))}
              <span>+{card.members.slice(8).length}</span>
            </>
          ) : (
            card.members.map((member: any) => (
              <Avatar
                key={member._id}
                src={member.avatar}
                alt={member.username}
                size="30"
                classes="w-7 h-7 cursor-default"
              />
            ))
          ))}
      </div>
    </div>
  );
};

export default Card;
