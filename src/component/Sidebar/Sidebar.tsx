import React from "react";
import Logo from "../Logo/logo";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi";
import SidebarLink from "./SidebarLink";
import { VscHome } from "react-icons/vsc";
import { IoSettingsOutline } from "react-icons/io5";
import SidebarMenu from "./SidebarMenu";
import WorkSpaceList from "./WorkSpaceList/WorkSpaceList";
import FavoriteList from "./FavouriteList/FavoriteList";

interface SidebarProps {
  show: boolean;
  onClick: () => void;
}

function Sidebar({ show, onClick }: SidebarProps) {
  return (
    <div className={`h-full  ${show ? "w-1/4" : "w-12 "} overflow-y-auto `}>
      <div
        className={`${
          show
            ? "flex bg-surface justify-between items-center px-3 py-2"
            : "ml-2"
        }`}
      >
        {show && <Logo size={20} />}

        <button onClick={onClick} className="flex-end p-2 rounded bg-surface">
          {show ? (
            <HiOutlineChevronDoubleLeft />
          ) : (
            <HiOutlineChevronDoubleRight />
          )}
        </button>
      </div>

      <main className="overflow-y-auto">
        <div className=" flex flex-col border-b">
          <SidebarLink show={show} to="/home/page" Icon={VscHome} text="Home" />
          <SidebarLink
            show={show}
            to="/home/profile"
            Icon={IoSettingsOutline}
            text="Settings"
          />
        </div>

        {show && (
          <ul>
            <SidebarMenu
              id={0}
              name="Favorites"
              component={<FavoriteList isInSideBar={true} />}
              button={false}
            />

            <SidebarMenu
              id={1}
              name="WorkSpaces"
              component={<WorkSpaceList isInSideBar={true} />}
              button={true}
            />
          </ul>
        )}
      </main>
    </div>
  );
}

export default Sidebar;
