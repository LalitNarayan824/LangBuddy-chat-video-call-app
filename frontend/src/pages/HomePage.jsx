import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../libs/api";
import { Link } from "react-router";
import { FiUserPlus } from "react-icons/fi";
import FriendCard from "../components/FriendCard";
import { CiLocationOn } from "react-icons/ci";
import { FiCheckCircle } from "react-icons/fi";
import { CiUser } from "react-icons/ci";
import { getLanguageFlag } from "../components/FriendCard";

const HomePage = () => {
  const queryClient = useQueryClient();

  const [outgoingRequests, setOutgoingRequests] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingRecommendedUsers } =
    useQuery({
      queryKey: ["recommendedUsers"],
      queryFn: getRecommendedUsers,
    });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: queryClient.invalidateQueries({
      queryKey: ["outgoingFriendReqs"],
    }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequests(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-auto">
      <div className="container mx-auto space-y-10">
        {/* this is the top section header showing your friends */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notification" className="btn btn-outline btn-sm">
            <FiUserPlus />
            Friend Requests
          </Link>
        </div>
        {/* top header for your friends ends here */}
        {/* all the friends of the users are loaded here , with loading spinner and alternate text for having no friends */}

        {/* this is the loader */}
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : friends.length === 0 ? (
          <div className="flex flex-col w-full items-center justify-center">
            {/* alternate text */}
            <h3 className="font-mono font-bold text-base-900">
              No friends yet
            </h3>
            {/* a message */}
            <p className="text-base-800">
              Connect to people and learn new Languages
            </p>
          </div>
        ) : (
          // all the frinds are shown in a card
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        {/* RECOMMENDED USERS SECTION */}

        <section>
          {/* header secetion for the section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xlf font-bold tracking-tight">
                  Meet New Learners
                </h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your
                  profile
                </p>
              </div>
            </div>
          </div>
          {/* header section endds here */}
          {/* recommended users will be shown here */}
          {loadingRecommendedUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">
                {" "}
                No recommendations available
              </h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequests.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-75"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>
                        <div>
                          <h3 className="font-semibold  text-lg">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-3">
                              <CiLocationOn />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* languages with flags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="badge badge-secondary text-xs">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitalize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline text-xs">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitalize(user.learningLanguage)}
                        </span>
                      </div>
                      {/* user bio  */}
                      {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}
                      {/* button for requesnt sent or sending friend request */}
                      <button className={`btn w-full mt-2 ${
                        hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                      } `}
                      onClick={()=>sendRequestMutation(user._id)}
                      disabled = {hasRequestBeenSent || isPending}
                      >

                        {hasRequestBeenSent ? (
                          <>
                          <FiCheckCircle  className="size-4 mr-2"/>
                          Request Sent
                          </>
                       ) : (

                        <>
                        <CiUser className="size-4 mr-2"  />
                        Send Friend Request
                        </>
                       )}

                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;

const capitalize = (str)=> str.charAt(0).toUpperCase() + str.slice(1);



