import Avatar from "../Avatar/Avatar";
import { BsFillBellFill, BsSearch } from "react-icons/bs";
import Logo from "../Logo/logo";
import Frame from "Fram 4.png";
import { HiOutlineChevronDoubleDown } from "react-icons/hi";
import { AiOutlinePlus } from "react-icons/ai";
import { BsBell } from "react-icons/bs";
import Search from "../Search/Search";
import { useDispatch } from "react-redux";
import { logOutUser } from "../../redux/features/authSlice";

function Navbar() {
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(logOutUser());
  };

  return (
    <div className=" w-full fixed top-0 left-0 z-10 py-3 px-3 bg-black flex justify-end items-center">
      <div className="">
        <button
          className="bg-primary px-1 py-2 rounded text-white"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
