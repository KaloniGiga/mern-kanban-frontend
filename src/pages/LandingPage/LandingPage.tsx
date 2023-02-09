import React from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "../../component/button/Button";
import LastSection from "../../assets/LastSection.jpg";
import HeroSection from "../../assets/HeroSection.jpg";
import {
  AiOutlineFacebook,
  AiOutlineInstagram,
  AiOutlineLinkedin,
  AiOutlineTwitter,
  AiOutlineYoutube,
} from "react-icons/ai";

function LandingPage() {
  return (
    <div style={{ fontFamily: "Poppins" }}>
      <nav className="w-full flex flex-col  md:px-3 md:py-2 bg-surface md:flex-row md:items-center md:jusitfy-between ">
        <div className="flex items-center justify-center md:justify-start">
          <img src="" alt="" />
          <h3 className="text-2xl  ml-3 font-semibold ">Flow</h3>
        </div>

        <div className="flex-1 flex items-center justify-around flex-col gap-4 md:flex-row">
          <div className="flex gap-8 text-xl ">
            <NavLink to={"/"} className={"hover:opacity-80"}>
              Home
            </NavLink>
            <a href="#features" className={"hover:opacity-80"}>
              Features
            </a>
            <a href="#aboutus" className={"hover:opacity-80"}>
              About Us
            </a>
          </div>

          <div className="flex gap-4">
            <NavLink
              to={"/auth/login"}
              className={
                "px-4 py-2 bg-primary hover:bg-black text-white rounded-full text-lg"
              }
            >
              Sign In
            </NavLink>
            <NavLink
              to={"/auth/register"}
              className={
                "px-4 py-2 bg-secondary hover:bg-black text-white rounded-full text-lg"
              }
            >
              Sign Up
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="flex flex-col w-full">
        {/* Hero section */}
        <section
          id="home"
          className=" flex  w-full justify-center bg-primary_light  px-3 py-6 flex-col items-center text-center md:flex-row md:text-left"
        >
          <div className="flex-1 flex flex-col pl-6 justify-center items-center md:items-start ">
            <h1 className="font-semibold mb-3" style={{ fontSize: "2.6rem" }}>
              Keep your task and team mates at the same place.
            </h1>
            <p style={{ fontSize: "1.6rem" }} className="mb-3">
              Create task and assign it to team mates
            </p>

            <NavLink
              style={{ width: 200 }}
              className={
                "py-2 rounded bg-secondary hover:bg-black text-center rounded text-white text-lg text-center"
              }
              to={"/auth/login"}
            >
              Sign up - it's free!
            </NavLink>
          </div>

          <div className="flex-1 py-6">
            <img
              src={LastSection}
              alt=""
              style={{
                width: "100%",
              }}
              className="rounded"
            />
          </div>
        </section>

        {/* Fetures */}
        <section id="features" className="flex flex-col w-full">
          <div className="mt-8 w-2/3 text-center md:text-left md:mx-0 md:w-1/2 pl-6 mb-4 mx-auto">
            <h2 className="font-semibold" style={{ fontSize: "2.5rem" }}>
              Features to conquer complexity.
            </h2>

            <p className="" style={{ fontSize: "1.2rem" }}>
              You can break down any project into small task using Board and
              Card and track their progress using List
            </p>

            <p></p>
          </div>

          <div className="lg:flex-row lg:pl-6 flex flex-col ">
            <div className="flex-1">
              <img
                src={HeroSection}
                alt=""
                className="rounded"
                style={{ width: "100%" }}
              />
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <div className="px-2 py-2 w-2/3 rounded-l mx-3 shadow-md hover:shadow-none  border-r-8 border-r-secondary sm:mx-auto">
                <h1 className="text-lg font-semibold mb-2">Board</h1>
                <p>
                  Board helps to organize the tasks and consists of lists and
                  cards. It is present inside the workspace.Each workspace
                  consists of many boards.
                </p>
              </div>

              <div className="px-2 py-2 w-2/3 rounded-r mx-3 shadow-md hover:shadow-none   border-r-8 border-r-secondary sm:mx-auto">
                <h1 className="text-lg font-semibold mb-2">List</h1>
                <p>
                  List helps to track the progress of tasks and consists of
                  cards inside it. Each list the represents a stage in card
                  life.
                </p>
              </div>

              <div className="px-2 py-2 w-2/3 rounded-l mx-3 shadow-md hover:shadow-none  border-r-8 border-r-secondary sm:mx-auto">
                <h1 className="text-lg font-semibold mb-2">Card</h1>
                <p>
                  Card represents a small task and member are assigned to the
                  card to complete the task. Once a stage is reached in task
                  life cycle, it is transferred to another list.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="aboutus" className="px-4 flex flex-col  mt-3 w-full">
          <div className="bg-primary py-8 flex flex-col items-center justify-center text-white">
            <h1
              className="font-semibold "
              style={{
                fontSize: "3rem",
              }}
            >
              About Flow
            </h1>
            <h2 className="text-xl">Complete your project with flow.</h2>
          </div>

          <div
            className="flex flex-col gap-8 items-center justify-center py-6 w-1/2 mx-auto text-center"
            style={{ fontSize: "1.6rem" }}
          >
            <p>
              Flow is a project management tool where teams to collaborate to
              plan, organize and finish a project and keep track to each task in
              the project lifecycle.
            </p>
            <p className="font-semibold">
              Thousands of people and companies love using Flow.
            </p>
          </div>
        </section>
      </main>

      <footer className="flex flex-col md:flex-row gap-4 items-center text-white bg-black py-4 md:flex md:justify-around md:py-8">
        <div>
          <h1 className="text-xl text-white font-semibold">Flow</h1>
        </div>

        <div className="flex gap-8">
          <Link to={"#"}>Privacy Policy</Link>
          <Link to={"#"}>Terms</Link>
          <Link to={"#"}>Copyright@2023</Link>
        </div>

        <div className="flex gap-8">
          <Link to={"#"}>
            <AiOutlineInstagram size={25} />
          </Link>
          <Link to={"#"}>
            <AiOutlineFacebook size={25} />
          </Link>
          <Link to={"#"}>
            <AiOutlineTwitter size={25} />
          </Link>
          <Link to={"#"}>
            <AiOutlineLinkedin size={25} />
          </Link>
          <Link to={"#"}>
            <AiOutlineYoutube size={25} />
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
