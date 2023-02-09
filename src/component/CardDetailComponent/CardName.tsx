import { AxiosError } from "axios";
import debounce from "debounce-promise";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import axiosInstance from "../../http";
import { AiOutlineDelete } from "react-icons/ai";
import { hideModal } from "../../redux/features/modalslice";

interface Props {
  cardId: string;
  boardId: string;
  workspaceId: string;
  initialName: string;
}

function CardName({ cardId, boardId, workspaceId, initialName }: Props) {
  const [cardName, setCardName] = useState(initialName);
  const [prevName, setPrevName] = useState(initialName);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const deleteCard = (cardId: string) => {
    axiosInstance
      .delete(`/card/${cardId}`)
      .then((response) => {
        if (queryClient.getQueryData(["getBoardList", boardId])) {
          queryClient.setQueryData(
            ["getBoardList", boardId],
            (oldValue: any) => {
              return oldValue.map((value: any) => {
                return {
                  ...value,
                  cards: value.cards.filter((card: any) => card._id !== cardId),
                };
              });
            }
          );
        }

        queryClient.invalidateQueries(["getAllMyCards"]);
        dispatch(hideModal());
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          const response = error.response;

          console.log(error.response.data);
        } else if (error.request) {
          console.log("Oops ! Something went wrong.");
        } else {
          console.log(error.message);
        }
      });
  };

  const updateName = debounce((newName, cardId) => {
    axiosInstance
      .put(`/card/${cardId}/name`, { name: newName })
      .then((response) => {
        queryClient.invalidateQueries(["getAllMyCards"]);

        queryClient.setQueryData(["getCard", cardId], (oldValue: any) => {
          return {
            ...oldValue,
            name: newName,
          };
        });

        if (queryClient.getQueryData(["getBoardList", boardId])) {
          queryClient.setQueryData(
            ["getBoardList", boardId],
            (oldValue: any) => {
              return oldValue.map((value: any) => {
                return {
                  ...value,
                  cards: value.cards.map((card: any) => {
                    if (card._id !== cardId) {
                      return {
                        ...card,
                        name: newName,
                      };
                    } else {
                      return {
                        ...card,
                      };
                    }
                  }),
                };
              });
            }
          );
        }
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          const response = error.response;
          const message = response.data;

          switch (response.status) {
            case 403:
              break;
            default:
              break;
          }
        }
      });
  }, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardName(e.target.value);

    if (value !== "") {
      setPrevName(e.target.value);

      updateName(e.target.value.trim(), cardId);
    }
  };

  const handleBlur = () => {
    if (cardName === "") {
      setCardName(prevName);
    }
  };

  return (
    <div className=" w-full flex items-center justify-between">
      <input
        className="w-full text-xl hover:bg-slate-200 bg-transparant border-transparant focus:border-2 rounded focus:border-primary px-2 py-1 font-semibold"
        type="text"
        onChange={handleInputChange}
        value={cardName}
        onBlur={handleBlur}
      />

      <button onClick={() => deleteCard(cardId)}>
        <AiOutlineDelete size={30} />
      </button>
    </div>
  );
}

export default CardName;
