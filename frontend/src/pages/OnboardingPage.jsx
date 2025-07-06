import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { LoaderIcon } from 'react-hot-toast';
import { completeOnboarding } from '../libs/api';
import { LANGUAGES } from '../constants';
import {useNavigate} from 'react-router'
import Loading from '../components/Loading'

const OnboardingPage = () => {

  const {authUser} = useAuthUser();
  const navigate = useNavigate();
  const [formState , setFormState] = useState({
    fullName : authUser?.fullName|| "",
    bio : authUser?.bio|| "",
    nativeLanguage : authUser?.nativeLanguage|| "",
    learningLanguage : authUser?.learningLanguage|| "",
    profilePic : authUser?.profilePic|| "",
    location : authUser?.location|| "",

  });
  const queryClient = useQueryClient();

  const {mutate:onboardingMutation , isPending , error} = useMutation({
    mutationFn: completeOnboarding,
    onSuccess:()=>{
      toast.success("Profile Completed Successfully!"),
      queryClient.invalidateQueries({queryKey:["authUser"]})
      // navigate('/');
    },
    onError:(error)=>{
      toast.error(error.response.data.message);
    }
  })

  const handleSubmit = (e)=>{
    e.preventDefault();
    onboardingMutation(formState);
  }
  const handleRandomAvatar = ()=>{
    const idx = Math.floor(Math.random() * 100) + 1;

    setFormState(prev => ({
      ...prev,
      profilePic: `https://avatar.iran.liara.run/public/${idx}.png`
    }));

  }

  if(isPending) return <Loading/>

  return (
    <div className="min-h-screen bg-green-100 dark:bg-green-950 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl min-h-[80vh] flex flex-col items-center bg-white dark:bg-gray-800  rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-white text-center mb-6">
          Onboarding
        </h2>

        {/* Profile Picture */}
        <div className="flex items-center gap-1 justify-center mb-6 indicator">
          <span onClick={handleRandomAvatar} className='indicator-item badge badge-success cursor-pointer'>Random</span>
          <div className="w-28 h-28 rounded-full bg-gray-300 dark:bg-green-700 overflow-hidden border-4 border-green-500 shadow-md">
            {/* Replace with actual image src */}
            <img
              src={formState.profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          {/* <div className='cursor-pointer'> <span className='alert alert-success px-2 py-1'> <span className='loading rotate-0 text-info'></span> Generate Random Image</span></div> */}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Full Name
            </label>
            <input
              id="fullname"
              type="text"
              placeholder='your full name'
              value={formState.fullName}
              onChange={e=>setFormState({...formState , fullName : e.target.value})}
              className="w-full px-4 py-2 rounded-md border border-green-300 dark:border-green-600 dark:bg-green-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              rows="3"
              placeholder="Tell us about yourself..."
              required
              value={formState.bio}
              onChange={e=>setFormState({...formState , bio : e.target.value})}
              className="w-full px-4 py-2 rounded-md border border-green-300 dark:border-green-600 dark:bg-green-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Native Language */}
          <div>
            <label htmlFor="nativeLanguage" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Native Language
            </label>
            <select
              id="nativeLanguage"
              type="text"
              
              required
              value={formState.nativeLanguage}
              onChange={e=>setFormState({...formState , nativeLanguage : e.target.value})}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-green-600 dark:bg-green-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">-- Select a Language</option>
              {LANGUAGES.map((lang)=>(
                <option className='bg-green-900' key={lang} value={lang} >{lang}</option>
              ))}
            </select>
          </div>

          {/* Learning Language */}
          <div>
            <label htmlFor="learningLanguage" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Learning Language
            </label>
            <select
              id="learningLanguage"
              type="text"
              
              required
              value={formState.learningLanguage}
              onChange={e=>setFormState({...formState , learningLanguage : e.target.value})}
              className="w-full px-4 py-2 rounded-md border border-green-300 dark:border-green-600 dark:bg-green-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">-- Select a Language</option>
              {LANGUAGES.map((lang)=>(
                <option className='bg-green-900' key={lang} value={lang} >{lang}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="India"
              required
              value={formState.location}
              onChange={e=>setFormState({...formState , location : e.target.value})}
              className="w-full px-4 py-2 rounded-md border border-green-300 dark:border-green-600 dark:bg-green-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-md transition duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OnboardingPage;

