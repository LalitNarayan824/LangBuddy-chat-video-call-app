import { axiosInstance } from "./axios";

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/api/auth/me");
  return res.data;
  } catch (error) {
    console.log("error in get auth user : " + error)
    return null
  }
};

export const signUpUser = async (signUpData) => {
  const response = await axiosInstance.post("/api/auth/register", signUpData);
  return response?.data;
};

export const completeOnboarding = async (userData) =>{
  const response = await axiosInstance.post("/api/auth/onboarding" , userData);

  return response?.data;
}
export const loginUser = async (userData) =>{
  const response = await axiosInstance.post("/api/auth/login" , userData);

  return response?.data;
}
export const logoutUser = async () =>{
  const response = await axiosInstance.post("/api/auth/logout" );

  return response?.data;
}
export const getUserFriends = async () =>{
  const response = await axiosInstance.get("/api/users/friends" );

  return response?.data;
}
export const getRecommendedUsers = async () =>{
  const response = await axiosInstance.get("/api/users" );

  return response?.data;
}
export const getOutgoingFriendReqs = async () =>{
  const response = await axiosInstance.get("/api/users/outgoing-friend-requests" );

  return response?.data;
}
export const sendFriendRequest = async (userId) =>{
  const response = await axiosInstance.post(`/api/users/friend-request/${userId}` );

  return response?.data;
}
export const getFriendRequests = async () =>{
  const response = await axiosInstance.get(`/api/users/friend-requests` );

  return response?.data;
}

export const acceptFriendRequest= async (requestId)=>{
  const response = await axiosInstance.put(`/api/users/friend-request/${requestId}/accept`);
  return response?.data;
}

// this function returns a stream token to be used in chatting or video calls

export const getStreamToken= async ()=>{
  const response = await axiosInstance.get(`/api/chat/token`);
  return response?.data;
}
// export const getStreamToken= async ()=>{
//   const response = await axiosInstance.get(`/api/chat/token`);
//   return response?.data;
// }





