import React, { useState, useCallback, useEffect, useRef } from "react";
import { Menu } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DropdownItem {
  label: string;
  value: string;
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean; // Add disabled property for individual items
}

interface DropdownProps {
  items?: DropdownItem[];
  width?: string;
  buttonText?: string;
  className?: string;
  variant?: "default" | "no-icons";
  value?: string;
  onChange?: (value: string) => void;
  triggerIcon?: React.ReactNode;
  showText?: boolean;
  fetchItems?: () => Promise<DropdownItem[]>;
  isLoadingProp?: boolean;
  maxHeight?: number;
  showSearch?: boolean;
  triggerIconClassName?: string;
  disabled?: boolean; // Add disabled prop for the entire dropdown
}

const DropDown: React.FC<DropdownProps> = ({
  items = [],
  width = "200px",
  buttonText = "Select Option",
  className = "",
  variant = "default",
  value,
  onChange,
  triggerIcon,
  showText = true,
  isLoadingProp = false,
  fetchItems,
  maxHeight = 200,
  showSearch = true,
  triggerIconClassName = "",
  disabled = false, // Default to not disabled
  ...props
}) => {
  const [asyncItems, setAsyncItems] = useState<DropdownItem[]>([]);
  const [isLoading, setIsLoading] = useState(isLoadingProp);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">(
    "bottom"
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayItems = fetchItems ? asyncItems : items;

  // Filter items based on search query
  const filteredItems = displayItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setIsLoading(isLoadingProp);
  }, [isLoadingProp]);

  // Function to calculate dropdown position
  const calculateDropdownPosition = useCallback(() => {
    if (!buttonRef.current || !dropdownRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const dropdownHeight = dropdownRef.current.offsetHeight;
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    // Add some padding for better appearance
    const PADDING = 20;

    // If there's not enough space below but enough space above, show dropdown above
    if (
      spaceBelow < dropdownHeight + PADDING &&
      spaceAbove > dropdownHeight + PADDING
    ) {
      setDropdownPosition("top");
    } else {
      setDropdownPosition("bottom");
    }
  }, []);

  const loadItems = useCallback(async () => {
    if (!fetchItems) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedItems = await fetchItems();
      setAsyncItems(fetchedItems);
    } catch (err) {
      setError("Failed to load items");
      console.error("Error fetching dropdown items:", err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchItems]);

  // Animation variants
  const dropdownAnimation = {
    hiddenTop: {
      opacity: 0,
      scale: 0.95,
      y: 10,
    },
    hiddenBottom: {
      opacity: 0,
      scale: 0.95,
      y: -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: (position: "top" | "bottom") => ({
      opacity: 0,
      scale: 0.95,
      y: position === "top" ? 10 : -10,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    }),
  };

  const itemAnimation = {
    hidden: { opacity: 0, x: -10 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.2,
      },
    }),
  };

  const rotateAnimation = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
  };

  const selectedItem = displayItems.find((item) => item.value === value);
  const displayText = selectedItem ? selectedItem.label : buttonText;

  const handleItemClick = (
    e: React.MouseEvent,
    close: () => void,
    value: string,
    href?: string,
    itemDisabled?: boolean
  ) => {
    e.preventDefault();
    // Don't process clicks on disabled items
    if (itemDisabled) return;

    onChange?.(value);
    setSearchQuery("");
    close();
    if (href) {
      window.location.href = href;
    }
  };

  // If the dropdown is disabled, we'll render a div instead of the Menu
  if (disabled) {
    return (
      <div className={cn("relative inline-block text-left z-[200]", className)}>
        <div
          className={cn(
            "inline-flex w-full items-center justify-between gap-x-2 rounded-lg",
            "text-gray-400 dark:text-gray-500", // Grayed out text for disabled state
            "bg-gray-100 dark:bg-gray-700", // Muted background for disabled state
            "px-4 py-2.5 text-sm font-medium",
            "shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-700",
            "cursor-not-allowed opacity-75", // Show not-allowed cursor and reduce opacity
            triggerIconClassName
          )}
        >
          {triggerIcon ? (
            <>
              {triggerIcon}
              {showText && (
                <>
                  <span className="truncate">{displayText}</span>
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </>
          ) : (
            <>
              <span className="truncate">{displayText}</span>
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <Menu
      as="div"
      className={cn("relative inline-block text-left z-[200]", className)}
    >
      {({ open, close }) => {
        // Calculate position and load items when dropdown opens
        React.useEffect(() => {
          if (open) {
            if (fetchItems) {
              loadItems();
            }
            calculateDropdownPosition();

            // Add resize listener
            window.addEventListener("resize", calculateDropdownPosition);
            window.addEventListener("scroll", calculateDropdownPosition);

            return () => {
              window.removeEventListener("resize", calculateDropdownPosition);
              window.removeEventListener("scroll", calculateDropdownPosition);
            };
          }
        }, [open, fetchItems]);

        return (
          <>
            <Menu.Button
              ref={buttonRef}
              className={cn(
                "inline-flex w-full items-center justify-between gap-x-2 rounded-lg",
                "text-gray-900 dark:text-white",
                "transition-all duration-200 ease-in-out",
                triggerIconClassName,
                !triggerIcon &&
                  "bg-white px-4 py-2.5 text-sm font-medium dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              )}
            >
              {triggerIcon ? (
                <>
                  {triggerIcon}
                  {showText && (
                    <>
                      <span className="truncate">{displayText}</span>
                      <motion.div
                        animate={open ? "open" : "closed"}
                        variants={rotateAnimation}
                        transition={{ duration: 0.2 }}
                      >
                        {isLoading && fetchItems ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </motion.div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <span className="truncate">{displayText}</span>
                  <motion.div
                    animate={open ? "open" : "closed"}
                    variants={rotateAnimation}
                    transition={{ duration: 0.2 }}
                  >
                    {isLoading && fetchItems ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </motion.div>
                </>
              )}
            </Menu.Button>

            <AnimatePresence custom={dropdownPosition}>
              {open && (
                <Menu.Items
                  ref={dropdownRef}
                  as={motion.div}
                  static
                  initial={
                    dropdownPosition === "top" ? "hiddenTop" : "hiddenBottom"
                  }
                  animate="visible"
                  exit="exit"
                  custom={dropdownPosition}
                  variants={dropdownAnimation}
                  {...props}
                  className={cn(
                    "absolute right-0 z-10 origin-top-right rounded-lg",
                    "bg-white dark:bg-gray-800 shadow-lg",
                    "ring-1 ring-black ring-opacity-5",
                    "focus:outline-none",
                    dropdownPosition === "top"
                      ? "bottom-full mb-2"
                      : "top-full mt-2",
                    `w-[${width}]`
                  )}
                  style={{
                    maxHeight: `${maxHeight}px`,
                  }}
                >
                  {/* Search input */}
                  {showSearch && (
                    <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                          autoFocus={true}
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onFocus={() => setIsSearchFocused(true)}
                          onBlur={() => setIsSearchFocused(false)}
                          className={cn(
                            "w-full pl-8 pr-4 py-2 text-sm",
                            "bg-gray-50 dark:bg-gray-700 text-black dark:text-white",
                            "border border-gray-300 dark:border-gray-600",
                            "rounded-md",
                            "focus:outline-none focus:ring-2 focus:ring-blue-500",
                            "transition-colors duration-200"
                          )}
                        />
                      </div>
                    </div>
                  )}

                  <div className="py-1 overflow-y-auto max-h-[130px]">
                    {fetchItems ? (
                      isLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        </div>
                      ) : error ? (
                        <div className="px-4 py-3 text-sm text-red-500">
                          {error}
                        </div>
                      ) : filteredItems.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          No matching items found
                        </div>
                      ) : (
                        filteredItems.map((item, index) => (
                          <DropdownItem
                            key={item.value}
                            item={item}
                            index={index}
                            active={item.value === value}
                            variant={variant}
                            onSelect={(e) =>
                              handleItemClick(
                                e,
                                close,
                                item.value,
                                item.href,
                                item.disabled
                              )
                            }
                            itemAnimation={itemAnimation}
                          />
                        ))
                      )
                    ) : (
                      filteredItems.map((item, index) => (
                        <DropdownItem
                          key={item.value}
                          item={item}
                          index={index}
                          active={item.value === value}
                          variant={variant}
                          onSelect={(e) =>
                            handleItemClick(
                              e,
                              close,
                              item.value,
                              item.href,
                              item.disabled
                            )
                          }
                          itemAnimation={itemAnimation}
                        />
                      ))
                    )}
                  </div>
                </Menu.Items>
              )}
            </AnimatePresence>
          </>
        );
      }}
    </Menu>
  );
};

// Separate DropdownItem component
const DropdownItem: React.FC<{
  item: DropdownItem;
  index: number;
  active: boolean;
  variant: string;
  onSelect: (e: React.MouseEvent) => void;
  itemAnimation: any;
}> = ({ item, index, active, variant, onSelect, itemAnimation }) => (
  <Menu.Item disabled={item.disabled}>
    {({ active: menuActive, disabled: menuDisabled }) => (
      <motion.div
        custom={index}
        className="z-[200]"
        initial="hidden"
        animate="visible"
        variants={itemAnimation}
      >
        <Link
          href={item.href || "#"}
          onClick={onSelect}
          className={cn(
            "group flex items-center px-4 py-2.5 text-sm",
            "transition-colors duration-150 ease-in-out",
            {
              // Disabled styles
              "cursor-not-allowed opacity-50 text-gray-400 dark:text-gray-500":
                item.disabled,
              // Normal hover styles (don't apply if disabled)
              "hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-white":
                !item.disabled,
              // Active styles (don't apply if disabled)
              "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-white":
                !item.disabled && (menuActive || active),
              // Default styles
              "text-gray-700 dark:text-gray-200":
                !menuActive && !active && !item.disabled,
            }
          )}
        >
          {variant === "default" && item.icon && (
            <span className="mr-3 h-5 w-5">{item.icon}</span>
          )}
          <span className="flex-1">{item.label}</span>
          {active && !item.disabled && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              className="ml-2 h-4 w-4 text-blue-600 dark:text-white"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>
          )}
        </Link>
      </motion.div>
    )}
  </Menu.Item>
);

export default DropDown;
