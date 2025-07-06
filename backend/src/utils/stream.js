import {StreamChat} from 'stream-chat';
import "dotenv/config";

const apikey = process.env.STREAM_API_KEY
const apisecret = process.env.STREAM_API_SECRET


if(!apikey || !apisecret){
  console.error("Stream api key or secret is missing");

}

const streamClient = StreamChat.getInstance(apikey ,apisecret)


export const upsertStreamUser = async (userData)=>{
  try {
    await streamClient.upsertUsers([userData]);
    return userData
  } catch (error) {
    console.error("error upserting stream users :" + error);
  }
}

// 
export const generateStreamToken = (userId)=>{
  try {
    const userIdstr = userId.toString();

    return streamClient.createToken(userIdstr);
  } catch (error) {
    console.error("error generating stream token :" + error);
   
  }
}