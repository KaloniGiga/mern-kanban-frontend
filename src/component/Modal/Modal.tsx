import React from "react";
import { useDispatch } from "react-redux";
import { MdClose } from "react-icons/md";
import CreateWorkSpaceModal from "../ModalComponents/CreateWorkSpaceModal";
import CreateBoardModal from "../ModalComponents/CreateBoardModal";
import InviteWorkSpaceMemberModal from "../ModalComponents/InviteWorkSpaceMemberModal";
import ConfirmRemoveWorkSpaceMemberModal from "../ModalComponents/ConfirmRemoveWorkSpaceMemberModal";
import ConfirmDeleteWorkSpaceModal from "../ModalComponents/ConfirmDeleteWorkSpaceModal";
import ConfirmDeleteBoardModal from "../ModalComponents/ConfirmDeleteBoardModal";
import ConfirmLeaveWorkSpaceModal from "../ModalComponents/ConfirmLeaveWorkSpaceModal";
import ConfirmLeaveBoardModal from "../ModalComponents/ConfirmLeaveBoardModal";
import ConfirmRemoveBoardMemberModal from "../ModalComponents/ConfirmRemoveBoardMemberModal";
import CreateCardModal from "../ModalComponents/CreateCardModal";
import BoardLabelModal from "../ModalComponents/BoardLabelModal";
import { hideModal } from "../../redux/features/modalslice";
import CreateListModal from "../ModalComponents/CreateListModal";
import CardDetailModal from "../ModalComponents/CardDetailModal";
import UpdatePassword from "../ModalComponents/UpdatePassword";
import ConfirmDeleteUserModal from "../ModalComponents/ConfirmDeleteUserModal";
import BoardDetailModal from "../ModalComponents/BoardDetailModal";
import EditWorkSpaceModal from "../ModalComponents/EditWorkSpaceModal";
import ConfirmLeaveAdminRole from "../ModalComponents/ConfirmLeaveAdminRole";
import InviteBoardMemberModal from "../ModalComponents/InviteBoardMemberModal";
import BoardMemberUpdateModal from "../ModalComponents/BoardMemberUpdateModal";
import ConfirmDeleteListModal from "../ModalComponents/ConfimrDeleteLIstModal";


interface ModalProps {
  modalType: string | null;
  modalProps?: Object;
  title?: string;
  showCloseBtn?: boolean;
  textColor?: string;
  bg?: string;
}

function Modal({
  modalType,
  modalProps,
  title,
  showCloseBtn,
  textColor,
  bg,
}: ModalProps) {
  const dispatch = useDispatch();

  const handleClose = () => {
    console.log(showCloseBtn);
    dispatch(hideModal());
  };

  let Component: React.FC<any> | null = null;

  switch (modalType) {
    case "CREATE_WORKSPACE_MODAL":
      Component = CreateWorkSpaceModal;
      break;
    case "CREATE_BOARD_MODAL":
      Component = CreateBoardModal;
      break;
    case "BOARD_DETAIL_MODAL":
      Component = BoardDetailModal;
      break;
    case "INVITE_WORKSPACE_MEMBER_MODAL":
      Component = InviteWorkSpaceMemberModal;
      break;
    case "CONFIRM_REMOVE_WORKSPACE_MEMBER_MODAL":
      Component = ConfirmRemoveWorkSpaceMemberModal;
      break;
    case "CONFIRM_DELETE_WORKSPACE_MDOAL":
      Component = ConfirmDeleteWorkSpaceModal;
      break;
    case "CONFIRM_DELETE_BOARD_MODAL":
      Component = ConfirmDeleteBoardModal;
      break;
    case "CONFIRM_LEAVE_WORKSPACE_MODAL":
      Component = ConfirmLeaveWorkSpaceModal;
      break;
    case "CONFIRM_LEAVE_BOARD_MODAL":
      Component = ConfirmLeaveBoardModal;
      break;
    case "CONFIRM_REMOVE_BOARD_MEMEBER_MODAL":
      Component = ConfirmRemoveBoardMemberModal;
      break;
    case "CREATE_CARD_MODAL":
      Component = CreateCardModal;
      break;
    case "CREATE_LIST_MODAL":
      console.log(modalProps);
      Component = CreateListModal;
      break;
    case "BOARD_LABEL_MODAL":
      Component = BoardLabelModal;
      break;
    case "CARD_DETAIL_MODAL":
      Component = CardDetailModal;
      break;
    case "UPDATE_PASSWORD_MODAL":
      Component = UpdatePassword;
      break;
    case "CONFIRM_DELETE_USER_MODAL":
      Component = ConfirmDeleteUserModal;
      break;
    case "EDIT_WORKSPACE_MODAL":
      Component = EditWorkSpaceModal;
      break;
    case "CONFIRM_LEAVE_ADMIN_ROLE":
      Component = ConfirmLeaveAdminRole;
      break;
    case "INVITE_BOARD_MEMBER_MODAL":
      Component = InviteBoardMemberModal;
      break;
    case "BOARD_MEMBER_UPDATE_MODAL":
      Component = BoardMemberUpdateModal;
      break;
    case "CONFIRM_DELETE_LIST_MODAL":
      Component = ConfirmDeleteListModal;
      break;
    default:
      Component = null;
  }

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 z-20 flex justify-center items-center w-full h-full bg-black m-auto bg-opacity-60"
      style={{ maxHeight: "100vh" }}
    >
      <div
        className={`absolute top-10 left-30 flex flex-col items-center rounded`}
      >
        <div
          className="relative rounded  flex flex-col p-2"
          style={{
            backgroundColor: bg ? bg : "inherit",
            color: textColor ? textColor : "inherit",
            width: "40vw",
            maxWidth: "60vw",
            minWidth: "35vw",
          }}
        >
          <div className="header flex justify-between items-center wrap mb-2">
            {title && (
              <h1 className={`text-xl font-semibold p-2 pl-4`}>{title}</h1>
            )}

            {showCloseBtn === true && (
              <button
                onClick={handleClose}
                type="button"
                className="flex-end ml-auto rounded bg-white bg-opacity-50 p-1 bg-surface hover:bg-primary_light"
              >
                <MdClose size={25} />
              </button>
            )}
          </div>

          <div
            className="w-full overflow-x-auto overflow-y-auto mb-3"
            style={{
              maxHeight: "84vh",
            }}
          >
            {Component !== null && <Component modalProps={modalProps} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
