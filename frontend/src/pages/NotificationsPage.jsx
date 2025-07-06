import React from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../libs/api";
import { FaUserCheck } from "react-icons/fa6";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiClock2 } from "react-icons/ci";
import { RiBellLine } from "react-icons/ri";
const NotificationsPage = () => {
  const queryclient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryclient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  console.log(incomingRequests , acceptedRequests)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Notifications
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                {/* Main Heading */}
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FaUserCheck />
                  Friend Requests
                  {/* to show number of requests */}
                  <span className="badge badge-primary ml-2">
                    {" "}
                    {incomingRequests.length}
                  </span>
                </h2>
                <div className="space-y-3">
                  {/* here we are showing all the incoming requests with a button to accept the request  */}
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300">
                              <img
                                src={request.sender.profilePic}
                                alt={request.sender.fullName}
                              />
                            </div>
                            <div>
                              <h3>{request.sender.fullName}</h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm">
                                  Native : {request.sender.nativeLanguage}
                                </span>
                                <span className="badge badge-outline badge-sm">
                                  Learning : {request.sender.learningLanguage}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={isPending}
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  
                </div>
              </section>
            )}
            {/* ACCEPTED REQS NOTIFICATIONS */}
                  {acceptedRequests.length>0 && (
                    <section className="space-y-4"> 
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <IoIosNotificationsOutline className="size-5 text-success" />
                        New Connections
                      </h2>

                      <div className="space-y-3">
                         {acceptedRequests.map((notification)=>(
                          <div
                          key={notification._id}
                          className="card bg-base-200 shadow-sm" 
                          >
                            <div className="card-body p-4" >
                              <div className="flex items-start gap-3">
                                  {/* avatr icon */}
                                  <div className="avatar mt-1 size-10 rounded-full">
                                    <img src={notification.sender.profilePic} alt={notification.sender.fullName} />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-semibold">{notification.sender.fullName}

                                    </h3>
                                    <p className="text-sm my-1">
                                      {notification.sender.fullName} accepted your friend request
                                    </p>
                                    <p className="text-xs flex items-center opacity-70">
                                      <CiClock2  className="size-3 mr-1"/>
                                      Recently
                                    </p>
                                  </div>
                                  <div className="badge badge-success">
                                    New Friend
                                  </div>
                                
                              </div> 
                            </div>  

                          </div>
                         ))} 
                      </div>  


                    </section>
                  )}

                  {incomingRequests.length ===0 && acceptedRequests.length===0 && (

                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="size-16 rounded-full bg-base-300 flex items-center justify-center mb-4">
                        <RiBellLine  className="size-10 text-base-content"/>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
                      <p className="text-base-content opacity-70 max-w-md">
                        When you receive friend requests or messages , they'll appear here
                      </p>


                    </div>
                  )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
