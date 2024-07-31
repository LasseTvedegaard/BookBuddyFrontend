import React from "react";

export default function IconAndText({ icon: Icon, text }) {
  return (
    <div className="flex items-center py-4">
      <div className="bg-ff_icon_square_bg_light dark:bg-ff_background_dark rounded p-3 mr-3">
        <Icon className="text-2xl dark:text-ff_bg_continer_dark" />{" "}
      </div>
      <span className="text-xl dark:text-ff_background_dark font-medium">
        {text}
      </span>
    </div>
  );
}
