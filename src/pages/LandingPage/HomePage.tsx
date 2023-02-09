import HomePageImage from "../../assets/HomePageImage.jpg";
import MyTasksList from "../../component/myTasks/MyTasksList";
import RecentBoards from "../../component/RecentlyViewed/recentBoards";
import FavoriteList from "../../component/Sidebar/FavouriteList/FavoriteList";
import WorkSpaceList from "../../component/Sidebar/WorkSpaceList/WorkSpaceList";

function HomePage() {
  return (
    //wrapper container
    <div className="flex flex-col justify-between py-2 px-1 ">
      <section className="flex justify-center mx-2 ">
        <div
          className="rounded flex flex-col md:flex-row overflow-hidden m-2 bg-white shadow-xl hover:shadow-none"
          style={{ minWidth: "200px", maxWidth: "700px", maxHeight: "150px" }}
        >
          <img
            src={HomePageImage}
            alt="Home page image"
            className="rounded w-[100%]"
            style={{
              maxWidth: "400px",
            }}
          />

          <div className="flex-1">
            <h3 className="text-center font-bold my-3">Manage Projects</h3>
            <p className="px-3 text-center">
              Invite members to your boards and track all the tasks.
            </p>
          </div>
        </div>
      </section>
      {/* left seciton */}
      <section className="flex-1">
        <div className="w-full pl-2">
          <RecentBoards />
        </div>

        <div className="w-full pl-2">
          <WorkSpaceList isInSideBar={false} />
        </div>

        <div>
          <FavoriteList isInSideBar={false} />
        </div>

        <div>
          {/* Your tasks */}

          <MyTasksList />
        </div>
      </section>

      {/* Right section */}
    </div>
  );
}

export default HomePage;
