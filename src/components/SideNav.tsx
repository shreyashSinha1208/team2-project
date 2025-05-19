"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "@/Components/Icons/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import logo from "../../public/assets/images/logo.png";
import Avatar from "./ui/Avatar";
import decoded from "@/Components/utils/fetchCredential";

interface NavLink {
  href: string;
  text: string | any;
  icon: string;
  excludeRoles: string[];
}

interface NavProps {
  links: NavLink[];
}

const Nav: React.FC<NavProps> = ({ links }) => {
  const pathname = usePathname();
  const userRole: string | any = decoded?.userData?.role || undefined;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const filteredLinks = links.filter(
    (link) => !link.excludeRoles.includes(userRole)
  );

  const date = new Date();

  return (
    <div className="flex bg-background sideNav pr-0 rounded-xl dark:bg-gray-900">
      <div className="my-3 flex flex-col bg-[#f1f1f1] dark:bg-gray-800 text-black dark:text-white rounded-md px-2 shadow-lg w-[225px] h-[calc(100vh-90px)]">
        <div className="flex items-center justify-center gap-4 bg-white dark:bg-gray-900 px-5 py-3.5 border-b dark:border-gray-700 h-[9vh] min-h-[72px]">
          <Image
            src={logo}
            alt="GTTC"
            width={40}
            height={40}
            // className={`${
            //   decoded?.userData?.institution.startsWith("GTTC") &&
            //   "bg-[#0790e8] rounded-full p-1"
            // }`}
          />
          <p className="flex items-center gap-2 text-base font-semibold text-[#0790e8] dark:text-[#66b0ff] text-center"></p>
        </div>
        <nav className="flex flex-col py-2 overflow-auto small-scrollBar">
          <AnimatePresence>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredLinks.map((link, index) => {
                const Icon = Icons[link.icon as keyof typeof Icons];
                const isActive = pathname?.startsWith(link.href);
                return (
                  <motion.div key={index} variants={linkVariants}>
                    <Link
                      href={link.href}
                      className={`
                        relative flex items-center gap-3 px-5 py-1.5 my-1 duration-200 rounded-lg bg-white dark:bg-gray-900
                        before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2
                        before:w-[4.5px] before:h-[29px] before:bg-[#0790e8] before:rounded-r-lg dark:before:bg-[#66b0ff]
                        before:transition-all before:duration-300 before:ease-in-out text-black text-sm dark:text-white
                        ${
                          isActive
                            ? "before:opacity-100 text-[#0790e8] dark:text-[#66b0ff]"
                            : "before:opacity-0"
                        }
                        hover:bg-[#e6f4fd] dark:hover:bg-[#2d3947] hover:text-[#0790e8] dark:hover:text-[#66b0ff] transition-colors duration-200 truncate
                      `}
                    >
                      {Icon && (
                        <Icon
                          width={22}
                          height={22}
                          fill={isActive ? "#0790e8" : "#000"}
                          className="dark:fill-current dark:text-[#66b0ff] dark:hover:text-[#66b0ff]"
                        />
                      )}
                      {link.text}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </nav>
        <div className="mt-auto border-t dark:border-gray-700 px-5 py-3.5 text-xs text-balance text-center h-[9vh] min-h-[45px]">
          &copy; {date.getFullYear()} All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Nav;
