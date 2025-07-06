import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router";
import Loading from '../components/Loading'
import { loginUser } from "../libs/api";
import {toast} from "react-hot-toast"

const LoginPage = () => {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {mutate:loginMutation , isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess:()=>{
      toast.success("Logged In Successfully!"),
      queryClient.invalidateQueries({queryKey:["authUser"]})
      
    },
    onError:(error)=>{
      toast.error(error.response.data.message);
    }
  })

  const handleSubmit = (e)=>{
    e.preventDefault();
    loginMutation(formState);
  }

  if(isPending) return <Loading/>

  return (
    <div className="min-h-screen min-w-screen bg-gray-900 flex items-center justify-center px-5 py-5">
      <div className="bg-gray-100 text-gray-700 rounded-3xl shadow-xl w-full  max-w-5xl overflow-hidden">
        <div className="md:flex w-full">
          {/* Left form Section */}

          <form onSubmit={handleSubmit}   className="w-full md:w-1/2 py-10 px-5 md:px-10">
            <div className="text-center mb-10">
              <h1 className="font-bold text-3xl text-gray-900">LOGIN</h1>
              <p>Enter your information to login</p>
            </div>

            <div>
              {/* Email */}
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                  <label className="text-xs font-semibold px-1">Email</label>
                  <div className="flex">
                    <div className="w-10 flex items-center justify-center text-gray-400 text-lg">
                      <i className="mdi mdi-email-outline" />
                    </div>
                    <input
                      type="email"
                      className="w-full pl-3 py-2 rounded-lg border-2 text-white border-gray-200 outline-none focus:border-green-500"
                      placeholder="johnsmith@example.com"
                      required
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-12">
                  <label className="text-xs font-semibold px-1">Password</label>
                  <div className="flex">
                    <div className="w-10 flex items-center justify-center text-gray-400 text-lg">
                      <i className="mdi mdi-lock-outline" />
                    </div>
                    <input
                      type="password"
                      className="w-full pl-3 py-2 rounded-lg text-white border-2 border-gray-200 outline-none focus:border-green-500"
                      placeholder="************"
                      required
                      value={formState.password}
                      onChange={(e) =>
                        setFormState({ ...formState, password: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Register Button */}
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                  <button
                    type="submit"
                    className="block w-full max-w-xs mx-auto bg-green-500 hover:bg-green-700 focus:bg-green-700 text-white rounded-lg px-3 py-3 font-semibold"
                  >
                    LOGIN NOW
                  </button>
                </div>
              </div>
              <div className="text-center">
                <span className="font-thin">Don't have an account ? </span>
                <Link to={"/signup"} className="font-bold text-green-700">
                  Sign Up
                </Link>
              </div>
          </div>
            </form>
          {/* Right image Section */}

          <div
            className="hidden md:block w-1/2 bg-green-400 bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/login.png')" }} // Use your own image here
          >
            {/* If you want to use SVG instead, replace this whole div with the SVG code */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
