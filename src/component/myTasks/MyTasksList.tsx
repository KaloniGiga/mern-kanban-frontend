import React from "react";
import { useQueryClient } from "react-query";
import axiosInstance from "../../http";
import { useQuery } from "react-query";
import Loader from "../Loader/loader";
import { MyCardObj } from "../../types/component.types";
import MyTask from "./MyTask";

function MyTasksList() {
  const queryClient = useQueryClient();

  const getmyCards = async () => {
    const response = await axiosInstance.get("/my/cards");

    const cards = response.data.cards;
    console.log(cards);
    return cards;
  };

  const {
    isLoading,
    data: cards,
    error,
  } = useQuery<MyCardObj[] | undefined, any, MyCardObj[], string[]>(
    ["getmyCards"],
    getmyCards
  );

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Oops! something went wrong...</h1>
        <button className="">Retry</button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-wrap">
      {cards && cards.length > 0 && cards.map((card) => <MyTask card={card} />)}
    </div>
  );
}

export default MyTasksList;
