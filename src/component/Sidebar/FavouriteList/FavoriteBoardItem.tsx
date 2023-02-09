import React, { useState, useRef, useEffect } from "react";
import { FavoriteObj } from "../../../types/component.types";
import { useDispatch } from "react-redux";
import { useQueryClient } from "react-query";
import axiosInstance from "../../../http";
import { NavLink } from "react-router-dom";
import Icon from "../../icon/icon";
import Avatar from "../../Avatar/Avatar";
import {
  HiOutlineDotsHorizontal,
  HiOutlineDotsVertical,
  HiOutlineLockClosed,
  HiOutlineStar,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { MdPublic } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";

interface FavoriteBookItemType {
  id: string;
  fav: FavoriteObj;
  isInSideBar: boolean;
}

function FavoriteBoardItem({ id, fav, isInSideBar }: FavoriteBookItemType) {
  const [showIcon, setShowIcon] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isCurrentBoard, setIsCurrentBoard] = useState(false);

  const OptionsBtnRef = useRef();

  const [isHovered, setIsHovered] = useState(false);
  const [isStarHovered, setIsStarHovered] = useState(false);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const addToFavorite = (workspaceId: string) => {
    axiosInstance
      .post("/favorite/add", { resourceId: workspaceId, type: "WORKSPACE" })
      .then((response) => {
        const data = response.data.favoriteResource;

        if (queryClient.getQueryData(["getWorkSpaceDetail", workspaceId])) {
          queryClient.setQueryData(
            ["getWorkSpaceDetail", workspaceId],
            (oldData: any) => {
              return {
                ...oldData,
                isFavorite: true,
                FavoriteId: data._id,
              };
            }
          );
        }

        queryClient.setQueryData(["getWorkSpaces"], (oldData: any) => {
          return oldData.map((workspace: any) => {
            if (workspace._id === workspaceId) {
              return {
                ...workspace,
                isFavorite: true,
                FavoriteId: data._id,
              };
            }
          });
        });

        if (queryClient.getQueryData(["getFavorites"])) {
          queryClient.setQueryData(["getFavorites"], (oldData: any) => {
            return [...oldData, data];
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

  const removeFavorite = (favoriteId: string | null, workspaceId: string) => {
    axiosInstance.delete(`/favorite/${favoriteId}`).then((response) => {
      if (queryClient.getQueryData(["getWorkSpaceDetail", workspaceId])) {
        queryClient.setQueryData(
          ["getWorkSpaceDetail", workspaceId],
          (oldData: any) => {
            return {
              ...oldData,
              isFavorite: false,
              FavoriteId: null,
            };
          }
        );
      }

      queryClient.setQueryData(["getWorkSpaces"], (oldData: any) => {
        return oldData.map((workspace: any) => {
          if (workspace._id === workspaceId) {
            return {
              ...workspace,
              isFavorite: false,
              FavoriteId: null,
            };
          }
        });
      });

      if (queryClient.getQueryData(["getFavorites"])) {
        queryClient.setQueryData(["getFavorites"], (oldData: any) => {
          return oldData.filter(
            (fav: any) => fav._id.toString() !== favoriteId
          );
        });
      }
    });
  };

  useEffect(() => {
    setShowOptions(showOptions);

    if (showOptions === true) {
      setShowIcon(true);
    }
  }, [showOptions]);

  return (
    <>
      {isInSideBar ? (
        <div className="w-full px-2 py-1 bg-surface">
          <NavLink to={`home/board/${fav._id}`}>
            <div className="flex items-center justify-between ">
              <div className="w-full flex items-center">
                {fav.icon ? (
                  <Icon src={fav?.icon} alt="Icon" classes="mr-1" size={20} />
                ) : (
                  <Avatar
                    alt={fav.name}
                    classes="rounded-full mr-1"
                    size={25}
                  />
                )}

                <div className="ml-3">
                  {fav.name.length > 9 ? (
                    <span>{fav.name.slice(0, 9) + "..."}</span>
                  ) : (
                    <span>{fav.name}</span>
                  )}
                </div>
              </div>

              <div>
                <button>
                  <HiOutlineDotsHorizontal />
                </button>
              </div>
            </div>
          </NavLink>
        </div>
      ) : (
        <div className="relative mx-2 my-2">
          <NavLink
            to={`/home/board/${fav._id}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              display: "block",
              width: 200,
              maxWidth: 300,
              height: 120,
              background: fav.bgImage ? `url(${fav.bgImage})` : `${fav.color}`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              boxShadow: `1px 1px 12px rgba(0, 0, 0, 0.5)`,
            }}
            className="h-30 rounded cursor-pointer font-semibold hover:opacity-50"
          >
            <div className="absolute top-0 left-0 right-0 bottom-0 px-2 py-2 hover:text-primary text-xl">
              {fav.name}
            </div>

            <span className="absolute right-2 top-2">
              {["PRIVATE"].includes(fav.visibility) ? (
                <HiOutlineLockClosed size={25} />
              ) : (
                <MdPublic size={25} />
              )}
            </span>
          </NavLink>

          {isHovered && (
            <div className="absolute bottom-1 right-1 hover:opacity-60 ">
              {fav.isFavorite ? (
                <button
                  onMouseEnter={() => setIsStarHovered(true)}
                  onMouseLeave={() => setIsStarHovered(false)}
                  onClick={() => removeFavorite(fav.FavoriteId, fav._id)}
                >
                  <AiFillStar size={isStarHovered ? 27 : 22} fill="#fbbf20" />
                </button>
              ) : (
                <button
                  onMouseEnter={() => setIsStarHovered(true)}
                  onMouseLeave={() => setIsStarHovered(false)}
                  onClick={() => addToFavorite(fav._id)}
                >
                  <HiOutlineStar size={isStarHovered ? 27 : 22} />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default FavoriteBoardItem;
