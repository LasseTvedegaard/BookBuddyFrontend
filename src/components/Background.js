import React from "react";

const Background = ({ children }) => {
  return (
    <div className="bg-ff_background_light dark:bg-ff_background_dark min-h-full overflow-y-auto">
      {children}
    </div>
  );
};

export default Background;
