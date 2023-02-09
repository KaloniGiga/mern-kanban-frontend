import { HiOutlineRefresh } from "react-icons/hi";
import { useQueryClient } from "react-query";
import CustomBtn from "../button/CustomBtn";
import Loader from "../Loader/loader";

interface Props {
  queryKey: string[];
  message: string;
  isRefetching: boolean;
}

const ErrorCard = ({ queryKey, message, isRefetching }: Props) => {
  const queryClient = useQueryClient();

  return (
    <div className="h-full w-full flex justify-center overflow-x-auto overflow-y-hidden  items-center">
      {isRefetching ? (
        <Loader />
      ) : (
        <div>
          <span>{message}</span>
          <CustomBtn
            Id="errorcard"
            label="Retry"
            Icon={HiOutlineRefresh}
            classes="bg-secondary px-3 py-2"
            iconClasses="text-white"
            iconSize={25}
            onClick={() => queryClient.invalidateQueries(queryKey)}
          />
        </div>
      )}
    </div>
  );
};

export default ErrorCard;
