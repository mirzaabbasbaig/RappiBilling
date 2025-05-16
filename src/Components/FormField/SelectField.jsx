import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DrownDown from "../Icons/DrownDown";

const SelectField = ({ label, options = [], disabled = false, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full relative">
      {/* Label */}
      {label && <label className={` ${disabled ? "text-[#919AAACC]" : "text-black"} text-[16px] font-medium pb-6 mb-5`}>{label}</label>}
      <div className="p-1"></div>
      
      {/* Dropdown Field */}
      <div
        className={`w-full h-[48px] pl-4 pr-2 flex items-center justify-between rounded-[12px] border ${
          disabled ? "border-gray-300 bg-[#F7F8F9] cursor-not-allowed opacity-50" : "border-gray-300 bg-white cursor-pointer"
        }`}
        onClick={() => !disabled && setIsOpen(true)}
      >
        <span className="text-[16px]">
          {value ? options.find((opt) => opt.value === value)?.label : "Select an option"}
        </span>
        <div>
          <DrownDown />
        </div>
      </div>

      {/* Overlay and Modal with Animation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* ✅ Overlay (Behind Modal) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-[9999]"
              onClick={() => setIsOpen(false)}
            />

            {/* ✅ Modal (On Top of Overlay) */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed bottom-0 left-0 w-full bg-white shadow-lg rounded-t-[32px] p-4 z-[100009999]"
            >
              <h2 className="font-medium text-[26px] py-3.5">{label}</h2>
              <div className="mt-2 border-t border-[#ECEFF3]">
                <div className="p-1.5"></div>
                {options.length > 0 ? (
                  options.map((option, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-5 border-b border-[#ECEFF3] cursor-pointer"
                      onClick={() => {
                        onChange(option.value); // ✅ Parent ko update karo
                        setIsOpen(false);
                      }}
                    >
                      <div>
                        <p className="text-[16px] font-medium">{option.label}</p>
                        {option.subtext && <p className="text-gray-500 text-sm">{option.subtext}</p>}
                      </div>
                      <input
                        type="radio"
                        name="identification"
                        checked={value === option.value}
                        readOnly
                        className="w-5 h-5"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-5">No options available</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};


export default SelectField;
