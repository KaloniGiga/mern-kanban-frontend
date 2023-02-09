import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../http";
import { RootState } from "../../redux/app/store";
import { Board, ToastKind } from "../../types/component.types";
import BoardLists from "./BoardLists/BoardLists";
import BoardMembers from "./BoardMembers/BoardMembers";
import BoardMenu from "./BoardMenu/BoardMenu";
import BoardVisibility from "./Boardvisibility/BoardVisibility";
import InviteBtn from "./InviteBtn/InviteBtn";
import JoinBtn from "./JoinBtn/JoinBtn";
import Loader from "../Loader/loader";
import { AiFillStar, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { HiOutlineStar } from "react-icons/hi";
import Icon from "../icon/icon";
import { BsThreeDots } from "react-icons/bs";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDispatch } from "react-redux";
import { showModal } from "../../redux/features/modalslice";
import { hideModal } from "../../redux/features/modalslice";
import { AxiosError } from "axios";
import { addToast } from "../../redux/features/toastSlice";

function BoardDetail() {
  const { boardId } = useParams();

  const dispatch = useDispatch();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.auth);

  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    queryClient.invalidateQueries(["getRecentBoards"]);
  }, []);

  const addToFavorite = (boardId: string, workspaceId: string) => {
    axiosInstance
      .post("/favorite/add", { resourceId: boardId, type: "BOARD" })
      .then((response) => {
        const data = response.data.favoriteResource;

        if (response.status === 201) {
          if (queryClient.getQueryData(["getBoard", boardId])) {
            queryClient.setQueryData(["getBoard", boardId], (oldData: any) => {
              return {
                ...oldData,
                isFavorite: true,
                favoriteId: data._id,
              };
            });
          }



          if(queryClient.getQueryData(['getWorkSpaceBoards', workspaceId])) {
          queryClient.setQueryData(
            ["getWorkSpaceBoards", workspaceId],
            (oldData: any) => {
              return oldData.map((board: any) => {
                if (board._id === boardId) {
                  return {
                    ...board,
                    isFavorite: true,
                    favoriteId: data._id,
                  };
                }

                return board;
              });
            }
          );
          }


          if (queryClient.getQueryData(["getFavorites"])) {
            queryClient.setQueryData(["getFavorites"], (oldData: any) => {
              return [...oldData, data];
            });
          }
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

  const removeFavorite = (
    favoriteId: string | null,
    boardId: string,
    workspaceId: string
  ) => {
    axiosInstance
      .delete(`/favorite/${favoriteId}`)
      .then((response) => {
        if (queryClient.getQueryData(["getBoard", boardId])) {
          queryClient.setQueryData(["getBoard", boardId], (oldData: any) => {
            return {
              ...oldData,
              isFavorite: false,
              favoriteId: null,
            };
          });
        }

        if(queryClient.getQueryData(["getWorkSpaceBoards", workspaceId])) {
        queryClient.setQueryData(
          ["getWorkSpaceBoards", workspaceId],
          (oldData: any) => {
            return oldData.map((board: any) => {
              if (board._id === boardId) {
                return {
                  ...board,
                  isFavorite: false,
                  favoriteId: null,
                };
              }

              return board;
            });
          }
        );
        }

        if (queryClient.getQueryData(["getFavorites"])) {
          queryClient.setQueryData(["getFavorites"], (oldData: any) => {
            return oldData.filter(
              (favorite: any) => favorite._id.toString() !== favoriteId
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

  const options = [
    {
      value: "PUBLIC",
      name: "PUBLIC",
    },
    {
      value: "PRIVATE",
      name: "PRIVATE",
    },
  ];

  const getBoard = async ({ queryKey }: any) => {
    const response = await axiosInstance(`board/${queryKey[1]}`);
    const data = response.data;
    console.log(data.board);
    return data.board;
  };

  const {
    isLoading,
    data: board,
    error,
  } = useQuery<Board, any>(["getBoard", boardId], getBoard);

  if (isLoading) {
    return (
      <div className="flex w-full justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full items-center justify-center">
        <h3>Oops! something went wrong</h3>
        <button>Retry</button>
      </div>
    );
  }

  return (
    <div className="h-full relative flex overflow-hidden">
      {board && (
        <div className="flex-1">
          <div
            className=" fixed top-0 bottom-0 right-0 left-0"
            style={{
              backgroundImage: `url(${board.bgImage})`,
              backgroundColor: !board.bgImage ? board.color : "",
              zIndex: -1,
              backgroundPosition: "50%",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundBlendMode: "overlay",
              boxShadow: `0 0 0 2000px rgba(150, 150, 150, 0.3)`,
            }}
          ></div>

          <div className="flex flex-col relative z-10 bg-">
            <div className="header h-16 w-full px-4 py-2 flex items-center justify-between z-10 ">
              <div className="flex items-center flex-1 gap-x-4">
                <div className=" bg-surface px-3 py-1 flex flex-col items-center justify-center  ">
                  <div className="  workspaceName-container w-full flex items-center shadow hover:shadow-none ">
                    <Icon
                      src={board.workspace.picture}
                      alt={board.workspace.name}
                      size={40}
                      classes="rounded-full"
                    />
                    <span className="ml-3">{board.workspace.name}</span>
                  </div>

                  <span className=" font-semibold text-xl w-full">
                    {board.name}
                  </span>
                </div>

                <div className="favourite p-2 cursor-pointer bg-[#ffffcf] shadow hover:shadow-none  hover:opacity-50">
                  {board.isFavorite ? (
                    // unfavorite
                    <button
                      onClick={() =>
                        removeFavorite(
                          board.FavoriteId,
                          board._id,
                          board.workspace._id
                        )
                      }
                    >
                      <AiFillStar color="#ffd700" size={30} />
                    </button>
                  ) : (
                    // favorite
                    <button
                      onClick={() =>
                        addToFavorite(board._id, board.workspace._id)
                      }
                    >
                      <HiOutlineStar color="#ffd700" size={30} />
                    </button>
                  )}
                </div>

                {/* workspace name */}

                {/* board visibility */}
                <div className="boardVisibility  rounded font-semibold  shadow hover:shadow-none hover:opacity-50">
                  {board.role === "ADMIN" ? (
                    <BoardVisibility
                      options={options}
                      workspaceId={board.workspace._id}
                      boardId={boardId}
                      value={board.visibility}
                    />
                  ) : (
                    <div className="px-4 py-2 bg-board">{board.visibility}</div>
                  )}
                </div>

                {/* <BoardMembers boardId={boardId} workspaceId={board.workspace._id} members={board.members} role={board.role} /> */}

                {board.role === "ADMIN" && (
                  <div className="flex ">
                    <button
                      onClick={() =>
                        dispatch(
                          showModal({
                            modalType: "INVITE_BOARD_MEMBER_MODAL",
                            modalProps: { boardId: boardId },
                          })
                        )
                      }
                      className="mr-3"
                    >
                      <InviteBtn />
                    </button>

                    {!board.members.find(
                      (member: any) => member._id === user?._id
                    ) && (
                      <button>
                        <JoinBtn />
                      </button>
                    )}
                  </div>
                )}

                {board.role === "NORMAL" && (
                  <>
                    {!board.members.find(
                      (member: any) => member._id === user?._id
                    ) ? (
                      <JoinBtn />
                    ) : (
                      <InviteBtn />
                    )}
                  </>
                )}
              </div>

              {/* edit icon */}
              <div className="editWrapper flex items-center flex-1 justify-end mr-4">

                {board.role === "ADMIN" && (
                <div className="shadow px-2 py-1 bg-board hover:opacity-50 mr-3">
                  <button
                    onClick={() =>
                      dispatch(
                        showModal({
                          modalType: "BOARD_DETAIL_MODAL",
                          modalProps: {
                            boardId: boardId,
                            workspaceId: board.workspace._id,
                          },
                        })
                      )
                    }
                  >
                    <AiOutlineEdit size={30} />
                  </button>
                </div>
                )}


              {board.role === "ADMIN" && (
                <div className="shadow mr-2 bg-board rounded px-2 py-1">
                  <button className="w-full" onClick={() => dispatch(showModal({modalType: "CONFIRM_DELETE_BOARD_MODAL", modalProps: {boardId: boardId, workspaceId: board.workspace._id, myRole: board.role}}))}>
                    <AiOutlineDelete size={30}/>
                  </button>
                </div>
              )}
                {/* menu bar */}

                {!showMenu && (
                  <div className="shadow hover:shadow-none bg-board  px-2 py-2  hover:opacity-50">
                    <button onClick={() => setShowMenu((prev) => !prev)}>
                      <BsThreeDots />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className=" w-full h-full z-10">
            <BoardLists
              boardId={boardId}
              boardName={board.name}
              workspaceId={board.workspace._id}
              myRole={board.role}
            />
          </div>
        </div>
      )}

      {showMenu && (
        <BoardMenu
          setShowMenu={setShowMenu}
          boardId={boardId}
          workspaceId={board?.workspace._id}
          myRole={board?.role}
        />
      )}
    </div>
  );
}

export default BoardDetail;
