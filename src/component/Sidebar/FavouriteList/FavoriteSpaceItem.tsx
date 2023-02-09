import { NavLink } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import axiosInstance from "../../../http";
import { FavoriteObj } from "../../../types/component.types";
import Icon from "../../icon/icon";
import { iteratorSymbol } from "immer/dist/internal";
import Avatar from "../../Avatar/Avatar";
import Options from "../../Options/Options";
import OptionsItem from "../../Options/OptionsItem";
import {
  HiOutlineDotsHorizontal,
  HiOutlineLockClosed,
  HiOutlineStar,
} from "react-icons/hi";
import { AiFillStar } from "react-icons/ai";
import { MdPublic } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

interface FavoriteSpaceItemType {
  id: string;
  fav: FavoriteObj;
  isInSideBar: boolean;
}

function FavoriteSpaceItem({ id, fav, isInSideBar }: FavoriteSpaceItemType) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [showIcon, setShowIcon] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isCurrentWorkSpace, setIsCurrentWorkSpace] = useState(false);

  const OptionsBtnRef = useRef();

  const [isHovered, setIsHovered] = useState(false);
  const [isStarHovered, setIsStarHovered] = useState(false);

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
        <div className="w-full px-2 py-1 bg-surface ">
          <NavLink to={`home/workspace/${fav._id}/boards`}>
            <div className="flex items-center justify-between ">
              <div className="w-full flex items-center">
                {fav.icon ? (
                  <Icon src={fav.icon} alt="Icon" classes="mr-1" size={20} />
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
        <div className="relative mx-4 my-2">
          <NavLink
            to={`/home/workspace/${fav._id}/boards`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              display: "block",
              width: 200,
              maxWidth: 300,
              height: 120,
              background: "white",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              boxShadow: `1px 1px 12px rgba(0, 0, 0, 0.5)`,
            }}
            className="h-30 rounded cursor-pointer font-semibold  hover:opacity-70"
          >
            <div className="absolute top-0 left-0 right-0 bottom-0 px-2 text-xl py-2 hover:text-primary">
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
            <div className="absolute bottom-1 right-1  ">
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

export default FavoriteSpaceItem;
