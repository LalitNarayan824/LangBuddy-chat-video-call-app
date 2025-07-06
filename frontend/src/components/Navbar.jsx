import React from "react";
import useAuthUser from "../hooks/useAuthUser";
import { Link, useLocation } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../libs/api";
import { GrNotification } from "react-icons/gr";
import ThemeSelector from "./ThemeSelector";
import { AiOutlineLogout } from "react-icons/ai";
import toast from "react-hot-toast";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const queryClient = useQueryClient();

  const { mutate: logoutMutation } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      toast.success("Logged out Successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {/* logo only in the chat  page */}
          {isChatPage && (
            <Link to={"/"}>
              <span className="text-5xl font-bold font-mono my-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent z-4">
                LangBuddy
              </span>
            </Link>
          )}

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to={"/notification"}>
              <button className="btn btn-ghost btn-circle">
                <GrNotification className="size-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>
          {/* theme selector component */}
          <ThemeSelector />

          <div className="avatar">
            <div className="w-9 rounded-full">
              <img
                src={authUser?.profilePic}
                alt="user avatar"
                rel="noreferrer"
              />
            </div>
          </div>
          <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <AiOutlineLogout className="size-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
