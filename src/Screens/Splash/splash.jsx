import React from "react";
import logo from "../../assets/images/_badge-rappi-innovation.svg";
import './splash.css'
import { Link } from "react-router-dom";

const Splash = () => {
  return (
    <div className="bg-[#1F2123] h-dvh w-full px-6 py-6 rounded-3xl relative splach-Bg-image">
      {/* Border Image */}
            {/* <img src={border} alt="" className="w-full left-0 top-0  absolute " /> */}

      
      {/* Logo */}
      <img src={logo} alt="" className="w-full max-w-[160px] relative -left-4" />

      {/* Title */}
      <h2 className=" font-medium text-[32px] leading-[40px] pt-4 text-white pb-1">
        Billing information
(Colombia)
      </h2>

      {/* Subtitle */}
      <p className=" leading-5 text-[#919AAA] pt-1">
        In this flow, the user will be able to share with Rappi the necessary data to issue the invoicing for all purchases made through the App..
      </p>


      {/* Button */}
      <Link to="/billing_information" className="w-full flex justify-center align-middle items-center mt-5 font-bold text-black h-[40px]  bg-white border-2 border-[#ECEFF3] rounded-[80px] hover:bg-[#ECEFF3] hover:text-black"> 
        Form fields
      </Link>
    </div>
  );
};

export default Splash;
