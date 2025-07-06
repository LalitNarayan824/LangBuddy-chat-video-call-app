import React from 'react'
import { LuLoaderPinwheel } from "react-icons/lu";
function ChatLoader() {
  return (
    <div className='h-screen flex flex-col items-center justify-center p-4'>
      <LuLoaderPinwheel className='animate-spin size-10 text-primary' />
      <p className='mt-4 text-center text-lg font-mono '>Connecting to chat....</p>
      
    </div>
  )
}

export default ChatLoader;

