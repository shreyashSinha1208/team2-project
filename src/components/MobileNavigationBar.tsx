"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import * as Icons from "@/Components/Icons/icons";
import decoded from "@/Components/utils/fetchCredential";

interface NavItemProps {
  icon: string;
  text: string;
  href: string;
  excludeRoles: string[];
}

interface MobileNavigationBarProps {
  navItems: NavItemProps[];
}

const MobileNavigationBar: React.FC<MobileNavigationBarProps> = ({
  navItems,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const pathname: any = usePathname();
  const  role  = decoded.userData.role;

  // Filter items based on user role
  const filteredItems = navItems.filter(
    (item) => !item.excludeRoles.includes(role)
  );

  // Determine if we need the "more" button
  const showMoreButton = filteredItems.length > 4;
  const mainItems = showMoreButton ? filteredItems.slice(0, 4) : filteredItems;
  const moreItems = showMoreButton ? filteredItems.slice(4) : [];

  useEffect(() => {
    const contentDiv = document.querySelector(
      ".bg-gray-50.dark\\:bg-gray-800.flex-1.rounded-md.overflow-auto"
    );

    if (!contentDiv) return;

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      const scrollTop = target.scrollTop;

      if (scrollTop <= 0) {
        setVisible(true);
      } else if (scrollTop > lastScrollTop) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      setLastScrollTop(scrollTop);
    };

    contentDiv.addEventListener("scroll", handleScroll);
    return () => contentDiv.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  const handleNavigation = () => {
    setIsMoreOpen(false);
  };

  // Calculate grid columns based on number of items
  const gridCols = showMoreButton ? 5 : Math.min(mainItems.length, 4);

  return (
    <motion.div
      className="fixed bottom-0 left-0 w-full transition-transform duration-300"
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : "100%" }}
      style={{
        zIndex: 1200,
        transform: `translateY(${visible ? "0" : "100%"})`,
        transition: "transform 0.3s ease-in-out",
      }}
    >
      <Overlay isVisible={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
      <div
        className="w-full bg-white dark:bg-gray-800 relative shadow-lg"
        style={{ zIndex: 1220 }}
      >
        {showMoreButton && (
          <MoreItemsPanel
            isOpen={isMoreOpen}
            items={moreItems}
            onNavigation={handleNavigation}
            currentPath={pathname}
          />
        )}
        <MainNavigationPanel
          items={mainItems}
          isMoreOpen={isMoreOpen}
          onToggleMore={() => setIsMoreOpen(!isMoreOpen)}
          onNavigation={handleNavigation}
          currentPath={pathname}
          showMoreButton={showMoreButton}
          gridCols={gridCols}
        />
      </div>
    </motion.div>
  );
};

const Overlay: React.FC<{ isVisible: boolean; onClose: () => void }> = ({
  isVisible,
  onClose,
}) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        style={{ zIndex: 1210 }}
        onClick={onClose}
      />
    )}
  </AnimatePresence>
);

const MoreItemsPanel: React.FC<{
  isOpen: boolean;
  items: NavItemProps[];
  onNavigation: () => void;
  currentPath: string;
}> = ({ isOpen, items, onNavigation, currentPath }) => {
  const rows = Math.ceil(items.length / 5);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full overflow-hidden border-t dark:border-gray-700"
        >
          <div
            className="grid grid-cols-5 p-2 -order-1"
            style={{ gridTemplateRows: `repeat(${rows}, 45px)` }}
          >
            {items.map((item, index) => (
              <NavItem
                key={index}
                {...item}
                onNavigation={onNavigation}
                isActive={currentPath.includes(item.href)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MoreButton: React.FC<{ isOpen: boolean; onClick: () => void }> = ({
  isOpen,
  onClick,
}) => (
  <motion.div
    className={`w-full h-full flex items-center justify-center flex-col transition-colors
      ${
        isOpen
          ? "bg-blue-50 dark:bg-blue-900/20"
          : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
      }`}
    onClick={onClick}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ duration: 0.3 }}
      className="text-gray-600 dark:text-gray-300"
    >
      {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </motion.div>
    <p className="text-[9px] font-medium text-gray-600 dark:text-gray-300">
      {isOpen ? "Close" : "More"}
    </p>
  </motion.div>
);

const MainNavigationPanel: React.FC<{
  items: NavItemProps[];
  isMoreOpen: boolean;
  onToggleMore: () => void;
  onNavigation: () => void;
  currentPath: string;
  showMoreButton: boolean;
  gridCols: number;
}> = ({
  items,
  isMoreOpen,
  onToggleMore,
  onNavigation,
  currentPath,
  showMoreButton,
  gridCols,
}) => (
  <div
    className={`w-full h-[45px] grid grid-cols-${gridCols} mx-auto border-t dark:border-gray-700 px-4`}
  >
    {items.map((item, index) => (
      <NavItem
        key={index}
        {...item}
        onNavigation={onNavigation}
        isActive={currentPath === item.href}
      />
    ))}
    {showMoreButton && (
      <MoreButton isOpen={isMoreOpen} onClick={onToggleMore} />
    )}
  </div>
);

interface ExtendedNavItemProps extends NavItemProps {
  onNavigation: () => void;
  isActive: boolean;
}

const NavItem: React.FC<ExtendedNavItemProps> = ({
  icon,
  text,
  href,
  onNavigation,
  isActive,
}) => {
  const [isRippling, setIsRippling] = useState(false);
  const [rippleX, setRippleX] = useState(0);
  const [rippleY, setRippleY] = useState(0);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const button = buttonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      const rippleSize = Math.max(rect.width, rect.height);
      // Calculate center position relative to the click
      setRippleX(e.clientX - rect.left - rippleSize / 2);
      setRippleY(e.clientY - rect.top - rippleSize / 2);
      setIsRippling(true);
      onNavigation();
    }
  };

  const Icon = Icons[icon as keyof typeof Icons];

  return (
    <Link href={href} className="block">
      <motion.div
        ref={buttonRef}
        className={`w-full h-full flex items-center justify-center flex-col relative overflow-hidden
          ${
            isActive
              ? "bg-blue-50 dark:bg-blue-900/20"
              : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
          } 
          transition-colors`}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
      >
        <div
          className={`${
            isActive
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {Icon && <Icon width={18} height={18} fill="currentColor" />}
        </div>
        <p
          className={`text-[9px] font-medium
          ${
            isActive
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-300"
          }`}
        >
          {text}
        </p>
        <AnimatePresence>
          {isRippling && (
            <motion.span
              className="absolute bg-blue-400/20 dark:bg-blue-400/30 rounded-full pointer-events-none"
              style={{
                left: rippleX,
                top: rippleY,
              }}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onAnimationComplete={() => setIsRippling(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
};

export default MobileNavigationBar;
