import { AxiosError } from "axios";
import debounce from "debounce-promise";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import axiosInstance from "../../http";

interface Props {
  initialValue: string;
  boardId: string;
  workspaceId: string;
  cardId: string;
  listId: string,
}

function AddExpireDate({ initialValue, boardId, cardId, workspaceId, listId }: Props) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [expireDate, setExpireDate] = useState(initialValue);
  const [prevDate, setPrevDate] = useState(initialValue);

  const updateExpireDate = debounce((newExpireDate, cardId) => {
    axiosInstance
      .put(`/card/${cardId}/expireDate`, { expireDate: newExpireDate })
      .then((response) => {
        console.log(newExpireDate);

        queryClient.invalidateQueries(["getAllMyCards"]);

        queryClient.setQueryData(["getCard", cardId], (oldValue: any) => {
          return {
            ...oldValue,
            expireDate: newExpireDate,
          };
        });

        if (queryClient.getQueryData(["getBoardList", boardId])) {
          queryClient.setQueryData(
            ["getBoardList", boardId],
            (oldValue: any) => {
              return oldValue.map((value: any) => {
                if(value._id.toString() === listId.toString()) {

                return {
                  ...value,
                  cards: value.cards.map((card: any) => {
                    if (card._id !== cardId) {
                      return {
                        ...card,
                        expireDate: newExpireDate,
                      };
                    } else {
                      return {
                        ...card,
                      };
                    }
                  }),
                };
               }else {
                 return value
               }
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
    setExpireDate(e.target.value);

    if (value !== "") {
      setPrevDate(e.target.value);

      updateExpireDate(e.target.value, cardId);
    }
  };

  const handleBlur = () => {
    if (expireDate === "") {
      setExpireDate(prevDate);
    }
  };

  return (
    <div>
      <input
        type="Date"
        className="w-full block mr-3 hover:bg-slate-200 bg-transparent outline-none border-transparent rounded  px-2 py-2"
        onChange={handleInputChange}
        value={expireDate}
        onBlur={handleBlur}
      />
    </div>
  );
}

export default AddExpireDate;
