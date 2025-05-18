import React, { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X, Book, Folder, Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type RecursiveData =
  | {
      [key: string]: RecursiveData | RecursiveData[] | string;
    }
  | string
  | string[]
  | RecursiveData[]
  | any;

interface ItemIconConfig {
  type?: string;
  defaultIcon: React.ReactNode;
  activeIcon?: React.ReactNode;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: RecursiveData[];
  title?: string;
  titleIcon?: React.ReactNode;
  selectedItemId?: string;
  onSelectItem?: (item: string, itemData?: any) => void;
  width?: string;
  className?: string;
  headerClassName?: string;
  itemClassName?: string;
  selectedItemClassName?: string;
  iconConfig?: ItemIconConfig[];
  getItemType?: (item: RecursiveData) => string | undefined;
  itemMetadata?: Record<string, any>;
  autoExpandParents?: boolean;
}

interface MenuItemProps {
  item: RecursiveData;
  depth?: number;
  onSelectItem?: (item: string, itemData?: any) => void;
  selectedItemId?: string;
  itemClassName?: string;
  selectedItemClassName?: string;
  iconConfig?: ItemIconConfig[];
  getItemType?: (item: RecursiveData) => string | undefined;
  itemMetadata?: Record<string, any>;
  autoExpandParents?: boolean;
  findPath?: (item: string, path: string[]) => string[];
}

const sidebarVariants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 24, mass: 1 },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: { duration: 0.25, ease: "easeInOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.15 },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, when: "beforeChildren" },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: "afterChildren",
    },
  },
};

const isString = (item: RecursiveData): item is string =>
  typeof item === "string";

export const hasChildren = (item: RecursiveData): boolean => {
  if (isString(item)) return false;
  if (Array.isArray(item)) return item.length > 0;
  return Object.keys(item).length > 0;
};

export const getLabel = (item: RecursiveData): string => {
  if (isString(item)) return item;
  if (Array.isArray(item)) return "";
  return Object.keys(item)[0];
};

const getChildren = (item: RecursiveData): RecursiveData[] => {
  if (isString(item)) return [];
  if (Array.isArray(item)) return item;
  const key = Object.keys(item)[0];
  return Array.isArray(item[key]) ? item[key] : [item[key]];
};

const filterItems = (
  items: RecursiveData[],
  searchQuery: string
): RecursiveData[] => {
  if (!searchQuery) return items;

  const filterItem = (item: RecursiveData): RecursiveData | null => {
    const label = getLabel(item);
    const children = getChildren(item);

    if (label.toLowerCase().includes(searchQuery.toLowerCase())) {
      return item;
    }

    if (children.length > 0) {
      const filteredChildren = children
        .map((child) => filterItem(child))
        .filter((child) => child !== null);

      if (filteredChildren.length > 0) {
        if (Array.isArray(item)) {
          return filteredChildren;
        }
        return { [label]: filteredChildren };
      }
    }

    return null;
  };

  return items
    .map((item) => filterItem(item))
    .filter((item): item is RecursiveData => item !== null);
};

const findPathToItem = (
  items: RecursiveData[],
  targetItem: string,
  currentPath: string[] = []
): string[] => {
  for (const item of items) {
    const label = getLabel(item);
    const newPath = [...currentPath, label];

    if (label === targetItem) {
      return currentPath;
    }

    const children = getChildren(item);
    if (children.length > 0) {
      const foundPath = findPathToItem(children, targetItem, newPath);
      if (foundPath.length > 0) {
        return foundPath;
      }
    }
  }

  return [];
};
const RecursiveMenuItem: React.FC<MenuItemProps> = ({
  item,
  depth = 0,
  onSelectItem,
  selectedItemId,
  itemClassName,
  selectedItemClassName,
  iconConfig,
  getItemType,
  itemMetadata,
  autoExpandParents,
  findPath,
}) => {
  const label = getLabel(item);
  const children = getChildren(item);
  const isSelected = selectedItemId === label;
  const shouldRenderItem = label !== "";
  const isFolder = hasChildren(item);

  // If autoExpandParents is true and this is a folder, check if it's in the path to selected item
  const shouldAutoExpand =
    autoExpandParents &&
    selectedItemId &&
    isFolder &&
    findPath &&
    findPath(selectedItemId, []).includes(label);

  const [isOpen, setIsOpen] = useState(shouldAutoExpand);

  // Update expansion state when selectedItemId changes
  useEffect(() => {
    if (shouldAutoExpand) {
      setIsOpen(true);
    }
  }, [shouldAutoExpand, selectedItemId]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get item type if available
  const itemType = getItemType ? getItemType(item) : undefined;

  // Find matching icon configuration
  const getIconForItem = () => {
    if (!iconConfig) {
      return isFolder ? (
        <Folder className="w-4 h-4 text-blue-500 dark:text-blue-400" />
      ) : (
        <Book className="w-4 h-4 transition-colors duration-200" />
      );
    }

    // Find config that matches this item's type
    const matchingConfig = iconConfig.find(
      (config) => config.type === itemType
    );

    if (matchingConfig) {
      return isSelected && matchingConfig.activeIcon
        ? matchingConfig.activeIcon
        : matchingConfig.defaultIcon;
    }

    // Use the first config with no type as default fallback
    const defaultConfig = iconConfig.find((config) => !config.type);

    if (defaultConfig) {
      return isSelected && defaultConfig.activeIcon
        ? defaultConfig.activeIcon
        : defaultConfig.defaultIcon;
    }

    // Final fallback
    return isFolder ? (
      <Folder className="w-4 h-4 text-blue-500 dark:text-blue-400" />
    ) : (
      <Book className="w-4 h-4 transition-colors duration-200" />
    );
  };

  const handleClick = useCallback(() => {
    if (isFolder) {
      setIsOpen((prev) => !prev);
    }

    if (onSelectItem && !isFolder) {
      // Pass both the item name and any metadata if available
      const itemData = itemMetadata ? itemMetadata[label] : undefined;
      onSelectItem(label, itemData);

      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("selectedItem", label);
      const newUrl = `${pathname}${
        params.toString() ? "?" + params.toString() : ""
      }`;
      router.push(newUrl);
    }
  }, [item, onSelectItem, router, pathname, searchParams, label, itemMetadata]);

  return (
    <div className="relative">
      {shouldRenderItem && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`${
            isFolder ? "sticky bg-white dark:bg-gray-800 z-10" : ""
          } ${depth === 0 ? "top-0" : `top-${depth * 8}`}`}
        >
          <button
            className={`flex items-center justify-between w-full px-4 py-2 transition-all duration-200 text-left cursor-pointer 
              ${
                isFolder &&
                "border-b border-slate-100 dark:border-gray-700 truncate"
              }
              ${isSelected ? selectedItemClassName : itemClassName}`}
            style={{
              marginLeft: `${depth * 1}rem`,
              backgroundColor: isFolder ? "transparent" : "transparent",
            }}
            onClick={handleClick}
          >
            <div className="flex items-center gap-3">
              {getIconForItem()}
              <span className="text-sm font-medium tracking-wide truncate capitalize">
                {label}
              </span>
            </div>
            {isFolder && (
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <ChevronRight className="w-4 h-4 opacity-60 dark:opacity-40" />
              </motion.div>
            )}
          </button>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {isOpen && children.length > 0 && (
          <motion.div
            initial={{ height: 0 }}
            animate={{
              height: "auto",
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            exit={{
              height: 0,
              transition: { duration: 0.2, ease: "easeInOut" },
            }}
            className="overflow-hidden"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="py-1"
            >
              {children.map((child, index) => (
                <motion.div key={`${depth}-${index}`} variants={itemVariants}>
                  <RecursiveMenuItem
                    item={child}
                    depth={depth + 1}
                    onSelectItem={onSelectItem}
                    selectedItemId={selectedItemId}
                    itemClassName={itemClassName}
                    selectedItemClassName={selectedItemClassName}
                    iconConfig={iconConfig}
                    getItemType={getItemType}
                    itemMetadata={itemMetadata}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sidebar = ({
  isOpen,
  onClose,
  items,
  title = "Navigation",
  titleIcon,
  selectedItemId,
  onSelectItem,
  width = "w-80",
  className = "bg-slate-50 dark:bg-gray-900",
  headerClassName = "bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700",
  itemClassName = "hover:bg-slate-100 dark:hover:bg-gray-700/50 text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white",
  selectedItemClassName = "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-800 dark:hover:text-blue-200",
  iconConfig,
  getItemType,
  autoExpandParents = true,
  itemMetadata,
}: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredItems = useMemo(
    () => filterItems(items, searchQuery),
    [items, searchQuery]
  );

  const findPath = useCallback(
    (targetItem: string, currentPath: string[] = []) =>
      findPathToItem(items, targetItem, currentPath),
    [items]
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/20 dark:bg-black/50 backdrop-blur-sm lg:hidden z-[100]"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.div
        variants={sidebarVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        exit="exit"
        className={`fixed lg:relative lg:translate-x-0 inset-y-0 left-0 z-30 ${width} ${className} shadow-xl lg:shadow-md dark:shadow-2xl dark:lg:shadow-lg rounded-r-2xl flex flex-col`}
      >
        <div className={`sticky top-0 z-50 flex flex-col ${headerClassName}`}>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-3">
              {titleIcon}
              <h1 className="text-lg font-semibold text-slate-800 dark:text-white tracking-tight">
                {title}
              </h1>
            </div>
            <motion.button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="px-4 pb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-4 py-2 pl-10 text-sm border rounded-lg bg-slate-50 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:text-gray-200 dark:placeholder-gray-400"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-gray-500" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="px-3 py-2"
          >
            {filteredItems.map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <RecursiveMenuItem
                  item={item}
                  onSelectItem={onSelectItem}
                  selectedItemId={selectedItemId}
                  itemClassName={itemClassName}
                  selectedItemClassName={selectedItemClassName}
                  iconConfig={iconConfig}
                  getItemType={getItemType}
                  autoExpandParents={autoExpandParents}
                  findPath={findPath}
                  itemMetadata={itemMetadata}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
