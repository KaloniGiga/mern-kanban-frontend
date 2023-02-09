import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../component/navbar/navbar";
import Sidebar from "../../component/Sidebar/Sidebar";
import { RootState } from "../../redux/app/store";
import { hideSidebar, showSidebar } from "../../redux/features/sidebarSlice";
import { Outlet } from "react-router-dom";
import Modal from "../../component/Modal/Modal";

function HomePageLayout() {
  const dispatch = useDispatch();

  const { show } = useSelector((state: RootState) => state.sidebar);
  const modal = useSelector((state: RootState) => state.modal);

  const handleClick = () => {
    if (show) {
      dispatch(hideSidebar());
    } else {
      dispatch(showSidebar());
    }
  };

  return (
    <div className="w-screen h-screen relative flex">
      {modal.modalType !== null && <Modal {...modal} />}

      <Navbar />

      <section
        className="w-full h-full flex flex-1 fixed bottom-0 left-0"
        style={{
          maxHeight: "90vh",
        }}
      >
        <Sidebar show={show} onClick={handleClick} />

        <main className="flex-1 flex flex-col overflow-x-auto overflow-y-auto">
          <Outlet />
        </main>
      </section>
    </div>
  );
}

export default HomePageLayout;
