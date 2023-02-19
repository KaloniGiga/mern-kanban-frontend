import { useQuery, useQueryClient } from "react-query";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../http";
import Icon from "../../component/icon/icon";
import Avatar from "../../component/Avatar/Avatar";
import { CgProfile, CgSpaceBetween } from "react-icons/cg";
import { AiOutlineEdit } from "react-icons/ai";
import { SettingObj, ToastKind, WorkSpace } from "../../types/component.types";
import Loader from "../../component/Loader/loader";
import { BsClipboardMinus } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { showModal } from "../../redux/features/modalslice";
import { AiFillStar } from "react-icons/ai";
import { HiOutlineStar } from "react-icons/hi";
import { AxiosError } from "axios";
import { addToast } from "../../redux/features/toastSlice";

function WorkSpaceLayout() {
  const { id: workspaceId } = useParams();

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  if (!workspaceId) {
    return (
      <div className="w-full h-full justify-center items-center">
        Something went wrong!
      </div>
    );
  }

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
            return workspace;
          });
        });

        if (queryClient.getQueryData(["getFavorites"])) {
          queryClient.setQueryData(["getFavorites"], (oldData: any) => {
            return [...oldData, data];
          });
        }
      })
      .catch((error) => {
        if (error.response) {
          const response = error.response;
          const { message } = response.data;

          switch (response.status) {
            case 404:
              dispatch(addToast({ kind: ToastKind.ERROR, msg: message }));
              queryClient.invalidateQueries(["getWorkSpaces"]);
              queryClient.invalidateQueries(["getFavorites"]);
              // redirect them to home page
              navigate("/home/page", { replace: true });
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
            addToast({ kind: ToastKind.ERROR, msg: `Error: ${error.message}` })
          );
        }
      });
  };

  const removeFavorite = (favoriteId: string | null, workspaceId: string) => {
    axiosInstance
      .delete(`/favorite/${favoriteId}`)
      .then((response) => {
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
             return workspace;
          });
        });

        if (queryClient.getQueryData(["getFavorites"])) {
          queryClient.setQueryData(["getFavorites"], (oldData: any) => {
            return oldData.filter(
              (fav: any) => fav._id.toString() !== favoriteId
            );
          });
        }
      })
      .catch((error) => {
        if (error.response) {
          const response = error.response;
          const { message } = response.data;

          switch (response.status) {
            case 404:
              dispatch(addToast({ kind: ToastKind.ERROR, msg: message }));
              queryClient.invalidateQueries(["getWorkSpaces"]);
              queryClient.invalidateQueries(["getFavorites"]);
              // redirect them to home page
              navigate("/home/page", { replace: true });
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
            addToast({ kind: ToastKind.ERROR, msg: `Error: ${error.message}` })
          );
        }
      });
  };

  const getWorkSpaceDetail = async ({ queryKey }: any) => {
    const response = await axiosInstance(`/workspace/${queryKey[1]}`);
    const data = response.data;
    console.log(data.workspace);
    return data.workspace;
  };

  const { isLoading, data, error } = useQuery<WorkSpace, any>(
    ["getWorkSpaceDetail", workspaceId],
    getWorkSpaceDetail
  );

  const myRole = data?.myRole;

  if (isLoading) {
    return (
      <div className="w-full h-full items-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <h1>Oops! Something went wrong.</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {data && (
        <>
          <div
            className="flex w-full  max-w-[80%] items-center"
            style={{ minHeight: 80 }}
          >
            <div className=" m-4">
              <Icon src={data.picture} alt={data.name} size={70} />
            </div>

            <div className="w-full  flex justify-between items-center">
              <div className="flex flex-col">
                <h2 className="font-semibold text-xl">{data.name}</h2>
                <p className="text-sm">{data.description}</p>
              </div>

              <div>
                {data.isFavorite ? (
                  <button
                    onClick={() => removeFavorite(data.favoriteId, data._id)}
                  >
                    <AiFillStar fill="#fbbf20" size={20} />
                  </button>
                ) : (
                  <button onClick={() => addToFavorite(data._id)}>
                    <HiOutlineStar size={20} />
                  </button>
                )}

                <button
                  className="cursor-pointer ml-3"
                  onClick={() =>
                    dispatch(
                      showModal({
                        modalType: "EDIT_WORKSPACE_MODAL",
                        modalProps: {
                          workspaceId: data._id,
                          name: data.name,
                          description: data.description,
                        },
                      })
                    )
                  }
                >
                  <AiOutlineEdit size={25} />
                </button>
              </div>
            </div>
          </div>

          <div className="w-full h-full ">
            <div className="flex justify-around items-center mb-2  border-b-2 pb-3">
              <NavLink
                to={`/home/workspace/${workspaceId}/boards`}
                className={({
                  isActive,
                }) => `transition-all duration-300 flex items-center  p-3
          ${isActive ? "bg-primary_light rounded-full text-white " : ""} `}
              >
                <BsClipboardMinus />
                <span className="ml-2">Boards</span>
              </NavLink>

              <NavLink
                to={`/home/workspace/${workspaceId}/members`}
                className={({
                  isActive,
                }) => `transition-all duration-300 flex items-center  p-3 
          ${isActive ? "bg-primary_light rounded-full text-white " : ""} `}
              >
                <CgProfile />
                <span className="ml-2">Members</span>
              </NavLink>

              <NavLink
                to={`/home/workspace/${workspaceId}/settings`}
                className={({
                  isActive,
                }) => `transition-all duration-300 flex items-center  p-3 
          ${isActive ? "bg-primary_light rounded-full text-white " : ""} `}
              >
                <FiSettings />
                <span className="ml-2">Settings</span>
              </NavLink>
            </div>

            <div>
              <Outlet context={{ workspaceId, myRole }} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default WorkSpaceLayout;
