import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/app/store";
import { ToastKind } from "../../types/component.types";
import { Toast } from "react-toastify/dist/components";
import { toast } from "react-toastify";
import { removeToast } from "../../redux/features/toastSlice";

const Toasts = () => {
  const { toasts } = useSelector((state: RootState) => state.toast);

  const dispatch = useDispatch();

  useEffect(() => {
    toasts &&
      toasts.forEach((t) => {
        if (t.kind === ToastKind.DEFAULT) {
          toast(t.msg, {
            toastId: t.kind + t.msg,
            onClose: () => {
              dispatch(removeToast(t));
            },
          });
        }
        if (t.kind === ToastKind.INFO) {
          toast.info(t.msg, {
            toastId: t.kind + t.msg,
            onClose: () => {
              dispatch(removeToast(t));
            },
          });
        }

        if (t.kind === ToastKind.ERROR) {
          toast.error(t.msg, {
            toastId: t.kind + t.msg,
            onClose: () => {
              dispatch(removeToast(t));
            },
          });
        }

        if (t.kind === ToastKind.SUCCESS) {
          toast.success(t.msg, {
            toastId: t.kind + t.msg,
            onClose: () => {
              dispatch(removeToast(t));
            },
          });
        }

        if (t.kind === ToastKind.WARNING) {
          toast.warn(t.msg, {
            toastId: t.kind + t.msg,
            onClose: () => {
              dispatch(removeToast(t));
            },
          });
        }
      });
  }, [toasts]);

  return <></>;
};

export default Toasts;
