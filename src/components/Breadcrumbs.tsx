import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import BreadCrumbsIcon from "./Icons/BreadCrumbsIcon";
import HomeIcon from "./Icons/HomeIcon";

export default function Breadcrumbs() {
  const pathname = usePathname() as string;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const crumbVariants = {
    hidden: { opacity: 0, x: -18 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
    exit: {
      opacity: 0,
      x: -18,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  const crumbs = pathname.split("/").filter((crumb) => crumb !== "");
  const isHome = pathname === "/home";
  const lastCrumb = crumbs[crumbs.length - 1];

  // Mobile view component
  const MobileView = () => (
    <div className="flex items-center">
      <motion.div variants={iconVariants}>
        <Link href="/home">
          <HomeIcon
            width="20px"
            height="20px"
            className="fill-black dark:fill-white"
          />
        </Link>
      </motion.div>
      {crumbs.length > 0 && !isHome && (
        <>
          <motion.span variants={iconVariants} className="mx-1.5">
            <BreadCrumbsIcon
              width="20px"
              height="20px"
              className="fill-black dark:fill-white"
            />
          </motion.span>
          {crumbs.length > 1 && (
            <>
              <motion.span
                variants={crumbVariants}
                className="text-gray-500 font-medium mx-1"
              >
                ...
              </motion.span>
              <motion.span variants={iconVariants} className="mx-1.5">
                <BreadCrumbsIcon
                  width="20px"
                  height="20px"
                  className="fill-black dark:fill-white"
                />
              </motion.span>
            </>
          )}
          <motion.div variants={crumbVariants}>
            <Link
              href={`/${crumbs.join("/")}`}
              className="capitalize font-bold truncate max-w-[150px] text-sm"
            >
              {lastCrumb.slice(0, 16) +
                lastCrumb.slice(16, 17).replace(/ /g, "") +
                "..."}
            </Link>
          </motion.div>
        </>
      )}
    </div>
  );

  // Desktop view component
  const DesktopView = () => (
    <div className="flex items-center">
      <motion.div variants={iconVariants}>
        <Link href="/home" className="flex">
          <HomeIcon
            width="20px"
            height="20px"
            className="fill-black dark:fill-white"
          />
        </Link>
      </motion.div>
      <AnimatePresence>
        {crumbs.length > 0 && !isHome && (
          <motion.span
            key="first-breadcrumb-icon"
            className="mx-1.5 text-gray-500"
            variants={iconVariants}
          >
            <BreadCrumbsIcon
              width="20px"
              height="20px"
              className="fill-black dark:fill-white"
            />
          </motion.span>
        )}
        {crumbs.map((crumb, index) => {
          const path = `/${crumbs.slice(0, index + 1).join("/")}`;
          return (
            <React.Fragment key={path}>
              {path !== "/home" && (
                <motion.div
                  className="crumb flex items-center"
                  variants={crumbVariants}
                >
                  <Link
                    href={path}
                    className={`capitalize text-sm ${
                      index === crumbs.length - 1 ? "font-bold" : ""
                    }`}
                  >
                    {crumb}
                  </Link>
                </motion.div>
              )}
              {index < crumbs.length - 1 && path !== "/home" && (
                <motion.span
                  key={`icon-${path}`}
                  className="mx-1 text-gray-500 flex items-center"
                  variants={iconVariants}
                >
                  <BreadCrumbsIcon
                    width="20px"
                    height="20px"
                    className="fill-black dark:fill-white"
                  />
                </motion.span>
              )}
            </React.Fragment>
          );
        })}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.nav
      className="flex items-center py-3.5 rounded-lg w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="md:hidden">
        <MobileView />
      </div>
      <div className="hidden md:block">
        <DesktopView />
      </div>
    </motion.nav>
  );
}
