import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router";
import { axiosInstance } from "../libs/axios";
import { signUpUser } from "../libs/api";

const SignUpPage = () => {
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: signupMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: signUpUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const handleSignUp = (e) => {
    e.preventDefault();
    signupMutation(signUpData);
  };

  return (
    <div className="min-h-screen min-w-screen bg-gray-900 flex items-center justify-center px-5 py-5">
      <div className="bg-gray-100 text-gray-700 rounded-3xl shadow-xl w-full  max-w-5xl overflow-hidden">
        <div className="md:flex w-full">
          {/* Left Image Section */}
          <div
            className="hidden md:block w-1/2 bg-green-400 bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/signup.png')" }} // Use your own image here
          >
            {/* If you want to use SVG instead, replace this whole div with the SVG code */}
          </div>

          {/* Right Form Section */}
          <div className="w-full md:w-1/2 py-10  px-5 md:px-10">
            <div className="text-center mb-10">
              <h1 className="font-bold text-3xl text-gray-900">SIGN UP</h1>
              <p>
                {isPending
                  ? "signing you up"
                  : "Enter your information to register"}
              </p>
            </div>
            {/* error if any */}
            {error && (
              <div className="alert alert-error mb-2">
                <span>{error.response.data.message}</span>
              </div>
            )}

            <form onSubmit={handleSignUp}>
              {/* fullName */}
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                  <label className="text-xs font-semibold px-1">
                    Full Name
                  </label>
                  <div className="flex">
                    <div className="w-10 flex items-center justify-center text-gray-400 text-lg">
                      <i className="mdi mdi-account-outline" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-3 py-2 rounded-lg border-2 text-white border-gray-200 outline-none focus:border-green-500"
                      placeholder="John Doe"
                      required
                      value={signUpData.fullName}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          fullName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

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
                      value={signUpData.email}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, email: e.target.value })
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
                      placeholder="Password must be 6 characters long"
                      required
                      minLength={6}
                      value={signUpData.password}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          password: e.target.value,
                        })
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
                    SIGN UP NOW
                  </button>
                </div>
              </div>
              <div className="text-center">
                <span className="font-thin">Already have an account ? </span>
                <Link to={"/login"} className="font-bold text-green-700">
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
