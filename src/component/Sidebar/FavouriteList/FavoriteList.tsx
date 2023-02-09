import React from "react";
import { useQueryClient, useQuery } from "react-query";
import axiosInstance from "../../../http";
import { FavoriteObj } from "../../../types/component.types";
import Loader from "../../Loader/loader";
import FavoriteBoardItem from "./FavoriteBoardItem";
import FavoriteSpaceItem from "./FavoriteSpaceItem";

export interface FavoriteListProps {
  isInSideBar: boolean;
}

function FavoriteList({ isInSideBar }: FavoriteListProps) {
  
  const queryClient = useQueryClient();

  const getFavorites = async () => {
    const response = await axiosInstance.get("/favorites");
    const data = response.data;
    return data.favorites;
  };

  const { isLoading, data, error } = useQuery<
    FavoriteObj[] | undefined,
    any,
    FavoriteObj[],
    string[]
  >(["getFavorites"], getFavorites);

  if (isLoading) {
    return (
      <div
        className="w-full flex justify-center items-center"
        style={{ height: "7rem" }}
      >
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="w-full flex justify-center items-center"
        style={{ height: "7rem" }}
      >
        <div className="flex flex-col justify-center items-center">
          <span className="text-primary">Oops! Something went wrong.</span>
          <button
            type="button"
            className="text-primary border-1"
            onClick={() => {
              queryClient.invalidateQueries(["getFavorites"]);
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {data && data.length > 0 && (
        <>
          {isInSideBar ? (
            <>
              {data.map((fav: any) => {
                return fav.type === "WORKSPACE" ? (
                  <FavoriteSpaceItem
                    key={fav._id}
                    id={fav._id}
                    fav={fav}
                    isInSideBar={true}
                  />
                ) : (
                  <FavoriteBoardItem
                    key={fav._id}
                    id={fav._id}
                    fav={fav}
                    isInSideBar={true}
                  />
                );
              })}
            </>
          ) : (
            <>
              <h3 className="mt-4 pl-4 text-xl font-semibold">
                Your Favorites
              </h3>
              <div className="flex gap-2">
                {data.map((fav: any) => {
                  return fav.type === "WORKSPACE" ? (
                    <FavoriteSpaceItem
                      key={fav._id}
                      id={fav._id}
                      fav={fav}
                      isInSideBar={false}
                    />
                  ) : (
                    <FavoriteBoardItem
                      key={fav._id}
                      id={fav._id}
                      fav={fav}
                      isInSideBar={false}
                    />
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

export default FavoriteList;
