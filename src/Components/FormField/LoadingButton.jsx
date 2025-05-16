import React, { useState } from "react";

const LoadingButton = ({ onClick, BtnText = "Submit", loadingText = "Processing...", disabled = false, isLoading }) => {
  const [internalLoading, setInternalLoading] = useState(false);

  const handleClick = async () => {
    if (typeof onClick !== "function") return;
    setInternalLoading(true);
    await onClick();
    setInternalLoading(false);
  };

  const loading = isLoading !== undefined ? isLoading : internalLoading;

  return (
    <button
      type="button"
      className="px-4 py-2 bg-[#34C85A] w-full min-h-[56px] cursor-pointer hover:bg-[#34c859b9]
 text-white rounded-4xl flex items-center justify-center space-x-2"
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0s]"></span>
            <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
          <span>{loadingText}</span>
        </div>
      ) : (
        BtnText
      )}
    </button>
  );
};

export default LoadingButton;
