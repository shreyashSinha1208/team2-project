"use client";
import React from "react";
import ThemeSwitcher from "./lightDarkToggle";
import * as icons from "@/Components/Icons/icons";
import logo from "../../public/assets/images/logo.png";
import Image from "next/image";

const InnerWebsiteNavbar: React.FC = () => {
  return (
    <nav className="flex sticky top-0 justify-between items-center w-full h-[63px] min-h-[63px] bg-[#0790e8] text-white">
      {" "}
      <div className="ml-4">
        <Image src={logo} alt="logo" width={58} height={58} />
      </div>
      <ul className="flex gap-2.5 mr-4 items-center justify-center">
        <li className="relative overflow-visible flex">
          {" "}
          <icons.GearUser width="31" height="31" fill="#ffffff" />
        </li>
        <li>
          <ThemeSwitcher />
        </li>
      </ul>
    </nav>
  );
};

export default InnerWebsiteNavbar;
