import React from "react";
import useAuthUser from "../hooks/useAuthUser";
import { Link, useLocation } from "react-router";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col  h-screen sticky top-0">
      <span className="text-5xl font-bold font-mono my-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent z-4">
       LangBuddy
      </span>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/"
          className={`btn btn-ghost btn-block justify-start 
          ${currentPath === "/" ? "btn-active" : ""}`}
        >
          <span className="text-md ">Home</span>
        </Link>
        <Link
          to="/friends"
          className={`btn btn-ghost btn-block justify-start 
          ${currentPath === "/friends" ? "btn-active" : ""}`}
        >
          <span className="text-md">Friends</span>
        </Link>
        <Link
          to="/notification"
          className={`btn btn-ghost btn-block justify-start 
          ${currentPath === "/notifications" ? "btn-active" : ""}`}
        >
          <span className="text-md">Notifications</span>
        </Link>
      </nav>

      {/* user profile section */}
      <div className=" p-4 border-t border-base-300 mt-auto ">
        <div className="flex items-center gap-3 btn-ghost rounded-lg p-2">
          {/* avatar */}
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={authUser?.profilePic} alt="User Profile" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />{" "}
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
