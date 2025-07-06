import React from "react";

const Loading = () => {
  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <span className="loading loading-bars loading-xs text-primary"></span>
      <span className="loading loading-bars loading-sm text-secondary"></span>
      <span className="loading loading-bars loading-md text-success"></span>
      <span className="loading loading-bars loading-lg text-error"></span>
      <span className="loading loading-bars loading-md text-success"></span>
      <span className="loading loading-bars loading-sm text-secondary"></span>
      <span className="loading loading-bars loading-xs  text-primary"></span>
    </div>
  );
};

export default Loading;
