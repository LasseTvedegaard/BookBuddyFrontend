import React from "react";

const Background = ({ children }) => {
  return (
    <div className="bg-ff_background_light dark:bg-ff_background_dark min-h-screen">
      {children}
    </div>
  );
};

export default Background;
