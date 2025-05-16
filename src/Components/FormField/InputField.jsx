import React from "react";
import CloseGray from "../Icons/closeGray";

const InputField = ({ label, name, value, onChange, ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={name} className="text-black text-[12px]">{label}</label>}

      <div className="relative mt-1">
        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full h-[48px] px-4 rounded-[12px] border border-gray-300"
          {...props}
        />
        {value && (
          <button
            onClick={() => onChange({ target: { name, value: "" } })}
            className="absolute bottom-3 right-3"
          >
            <CloseGray width={24} height={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
