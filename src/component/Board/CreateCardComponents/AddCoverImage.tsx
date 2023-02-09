import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import axiosInstance from "../../../http";
import CustomBtn from "../../button/CustomBtn";
import { HiOutlineRefresh } from "react-icons/hi";
import Loader from "../../Loader/loader";

export interface Props {
  label: string;
  changeCover: Function;
}

const AddCoverImage = ({ label, changeCover }: Props) => {
  const UNSPLASH_URL = import.meta.env.VITE_UNSPLASH_URL;
  const [currChoosen, setCurrChoosen] = useState("");
  const queryClient = useQueryClient();

  const getCoverImages = async () => {
    const response = await axiosInstance.get(
      `${UNSPLASH_URL}/photos/random?orientation=landscape&count=5`,
      {
        headers: {
          Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_CLIENT}`,
        },
      }
    );
    const data = response.data;
    return data;
  };

  //  queryClient.getQueryData(["getBackgroundImages"])

  const { isFetching, data, error } = useQuery(
    ["getCoverImages"],
    getCoverImages,
    { staleTime: Infinity }
  );

  useEffect(() => {
    if (data && data?.length > 0 && !currChoosen) {
      setCurrChoosen("");
    } else {
      setCurrChoosen(currChoosen);
    }
  }, [data]);

  useEffect(() => {
    changeCover(currChoosen);
  }, [currChoosen]);

  return (
    <div className={`flex flex-col w-full`}>
      <div className="flex justify-between items-center">
        <label htmlFor="background" className="font-semibold">
          {label}
        </label>

        {!isFetching && !error && (
          <CustomBtn
            label="New Images"
            Icon={HiOutlineRefresh}
            iconClasses={isFetching ? "animate-spin" : ""}
            iconSize={24}
            iconColor="primary_light"
            Id="backgroundImages"
            classes="mb-2 bg-secondary hover:secondary_light text-white rounded p-1 w-1/6 flex items-center justify-center"
            onClick={() => {
              queryClient.invalidateQueries(["getBackgroundImages"]);
            }}
          />
        )}
      </div>

      <div id="background">
        <div className="mb-2 ">
          {isFetching || error ? (
            isFetching ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <h2>No Images.</h2>
                <CustomBtn
                  label="Retry"
                  Id="Retry"
                  iconSize={24}
                  classes="mb-2 bg-secondary p-1 text-white rounded w-1/6 flex items-center justify-center hover:bg-black"
                  Icon={HiOutlineRefresh}
                  iconClasses={isFetching ? "animate-spin" : ""}
                  onClick={() => {
                    queryClient.invalidateQueries(["getBackgroundImages"]);
                  }}
                />
              </div>
            )
          ) : (
            <div className="flex items-center pb-1">
              {data &&
                data.map((image: any) => {
                  return (
                    <button
                      type="button"
                      key={image.id}
                      aria-label="background images"
                      onClick={() => {
                        setCurrChoosen(image.urls.regular);
                      }}
                      className={`mr-1 h-10  ${
                        currChoosen === image.urls.regular
                          ? "border-2 border-primary_light-500"
                          : ""
                      }`}
                    >
                      <img
                        style={{
                          minWidth: "20px",
                        }}
                        src={image.urls.thumb}
                        alt={image.description}
                      />
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCoverImage;
