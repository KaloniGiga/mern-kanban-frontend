import React, { useCallback } from "react"
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux"
import axiosInstance from "../../http";
import { hideModal } from "../../redux/features/modalslice";
import { addToast } from "../../redux/features/toastSlice";
import { ToastKind } from "../../types/component.types";

interface Props {
   modalProps : {
    listId: string,
    boardId: string,
    workspaceId: string
   },
}
const ConfirmDeleteListModal = ({modalProps}:Props) => {


    const dispatch = useDispatch();
    const queryClient = useQueryClient()

 const deleteList = useCallback(

        (listId: string) => {
          axiosInstance
            .delete(`/${listId}/delete`)
            .then((response) => {
              dispatch(hideModal());
    
             
             queryClient.setQueryData(["getBoardList", modalProps.boardId], (oldData:any) => {
                
                  return oldData.filter((list:any) =>  list._id.toString() !== listId.toString())
             })
              
              queryClient.refetchQueries(["getBoard", modalProps.boardId]);
              //queryClient.invalidateQueries(["getLists", modalProps.boardId]);  
              
              dispatch(addToast({kind: ToastKind.SUCCESS, msg: "List Deleted successfully"}))
            }) 
            .catch((error) => {
              dispatch(hideModal());
    
              if (error.response) {
                const message = error.response.data;
    
                //invalidate queries according to the statusCode
              } else if (error.request) {
                //add error toast
              } else {
                //add error toast
              }
            });
        },
        [modalProps.workspaceId]
      );


    return (
        <div>
        <h3 className="font-semibold px-4 py-2">
          Do you really want to delete the board ? You cannot undo the process.
        </h3>
  
        <div className="flex jusitfy-end py-2 px-3">
          <button
            className="font-md mr-4  rounded bg-secondary hover:bg-black text-white px-3 py-2"
            onClick={() => dispatch(hideModal())}
          >
            Cancel
          </button>
  
          <button
            className="fond-md rounded bg-black hover:bg-secondary text-white px-3 py-2"
            onClick={() => deleteList(modalProps.listId)}
          >
            Delete
          </button>
        </div>
      </div>
    )

}


export default ConfirmDeleteListModal;