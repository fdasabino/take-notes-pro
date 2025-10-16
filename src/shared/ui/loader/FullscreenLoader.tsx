import React from "react";

const FullscreenLoader = () => {
  return (
    <div className="fixed inset-0 z-40 min-h-screen w-screen bg-surface/10 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 flex items-center justify-center flex-col gap-6">
      <div className="pulse"></div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">Loading...</h2>
    </div>
  );
};

export default FullscreenLoader;
