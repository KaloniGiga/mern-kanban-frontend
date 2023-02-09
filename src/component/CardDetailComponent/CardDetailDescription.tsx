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
  showDescriptionEdit: boolean;
  setShowDescriptionEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

function CardDetailDescription({
  initialValue,
  boardId,
  cardId,
  workspaceId,
  showDescriptionEdit,
  setShowDescriptionEdit,
}: Props) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [prevDescription, setPrevDescription] = useState(initialValue);
  const [description, setDescription] = useState(initialValue);

  const updateDescription = debounce((newDescription, cardId) => {
    axiosInstance
      .put(`/card/${cardId}/description`, { description: newDescription })
      .then((response) => {
        queryClient.invalidateQueries(["getAllMyCards"]);

        queryClient.setQueryData(["getCard", cardId], (oldValue: any) => {
          return {
            ...oldValue,
            description: newDescription,
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
                        description: newDescription,
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

        queryClient.invalidateQueries(["getBoardList", boardId]);

        setShowDescriptionEdit(false);
      })
      .catch((error: AxiosError) => {
        setShowDescriptionEdit(false);

        if (error.response) {
          const response = error.response;

          console.log(error.response.data);
        } else if (error.request) {
          console.log("Oops ! Something went wrong.");
        } else {
          console.log(error.message);
        }
      });
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(e.target.value);

    if (value !== "") {
      setPrevDescription(e.target.value);
      updateDescription(value, cardId);
    }
  };

  const handleBlur = () => {
    if (description === "") {
      setDescription(prevDescription);
    }
  };

  return (
    <div>
      <textarea
        className="w-full bg-transparent outline-none border-transparent rounded focus:border-2 focus:border-primary px-2 py-2"
        onChange={handleChange}
        onBlur={handleBlur}
        value={description}
        autoFocus
        style={{
          height: "150px",
        }}
      ></textarea>
    </div>
  );
}

export default CardDetailDescription;
