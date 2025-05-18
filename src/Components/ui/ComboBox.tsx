"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Check, ChevronDown, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Interfaces moved to separate types section for better organization
type SelectedItem = {
  value: string;
  label: string;
  displayLabel?: string;
};

type ComboBoxContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: SelectedItem[];
  setSelected: React.Dispatch<React.SetStateAction<SelectedItem[]>>;
  search: string;
  setSearch: (search: string) => void;
  handleItemRemoval: (value: string) => void;
  maxVisibleTags: number;
};

// Memoized animation variants
const badgeAnimationVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

const dropdownAnimationVariants = {
  initial: (position: "top" | "bottom") => ({
    opacity: 0,
    y: position === "bottom" ? -10 : 10,
  }),
  animate: { opacity: 1, y: 0 },
  exit: (position: "top" | "bottom") => ({
    opacity: 0,
    y: position === "bottom" ? -10 : 10,
  }),
};

const ComboBoxContext = createContext<ComboBoxContextType | undefined>(
  undefined
);

const useComboBox = () => {
  const context = useContext(ComboBoxContext);
  if (!context) {
    throw new Error(
      "ComboBox compound components must be used within ComboBox"
    );
  }
  return context;
};

export const ComboBox: React.FC<{
  children: React.ReactNode;
  className?: string;
  onChange?: (selected: SelectedItem[]) => void;
  maxVisibleTags?: number;
}> = ({ children, className = "", onChange, maxVisibleTags = 5 }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SelectedItem[]>([]);
  const [search, setSearch] = useState("");

  const handleItemRemoval = useCallback((value: string) => {
    setSelected((prev) => prev.filter((item) => item.value !== value));
    setSearch("");
  }, []);

  useEffect(() => {
    onChange?.(selected);
  }, [selected, onChange]);

  const contextValue = useMemo(
    () => ({
      open,
      setOpen,
      selected,
      setSelected,
      search,
      setSearch,
      handleItemRemoval,
      maxVisibleTags,
    }),
    [open, selected, search, handleItemRemoval, maxVisibleTags]
  );

  return (
    <ComboBoxContext.Provider value={contextValue}>
      <div className={`relative w-full ${className}`}>{children}</div>
    </ComboBoxContext.Provider>
  );
};

const Badge = React.memo<{
  item: SelectedItem;
  className?: string;
}>(({ item, className = "" }) => {
  const { handleItemRemoval } = useComboBox();

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handleItemRemoval(item.value);
    },
    [handleItemRemoval, item.value]
  );

  return (
    <motion.span
      layout
      variants={badgeAnimationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`inline-flex items-center px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-800 ${className}`}
    >
      {item.displayLabel || item.label}
    </motion.span>
  );
});

Badge.displayName = "Badge";

const RemainingBadge = React.memo<{ count: number }>(({ count }) => (
  <motion.span
    layout
    variants={badgeAnimationVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-gray-100 text-gray-800"
  >
    <Plus className="w-3 h-3 mr-1" />
    {count} more
  </motion.span>
));

RemainingBadge.displayName = "RemainingBadge";

export const ComboBoxTrigger: React.FC<{
  placeholder?: string;
  className?: string;
}> = React.memo(({ placeholder = "Select items...", className = "" }) => {
  const { open, setOpen, selected, maxVisibleTags } = useComboBox();

  const visibleTags = useMemo(
    () => selected.slice(0, maxVisibleTags),
    [selected, maxVisibleTags]
  );

  const remainingCount = selected.length - maxVisibleTags;

  const handleClick = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={{ scale: 0.99 }}
      className={`
        w-full px-3 py-2 text-left bg-white border rounded-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-[100px] overflow-y-auto 
        ${open ? "border-blue-500" : "border-gray-300"}
        transition-colors duration-200
        ${className}
      `}
    >
      <div className="flex flex-wrap gap-1 min-h-[1.5rem]">
        <AnimatePresence mode="popLayout">
          {selected.length > 0 ? (
            <>
              {visibleTags.map((item) => (
                <Badge key={item.value} item={item} />
              ))}
              {remainingCount > 0 && <RemainingBadge count={remainingCount} />}
            </>
          ) : (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-500"
            >
              {placeholder}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <motion.div
        className="absolute right-2 top-1/2 transform -translate-y-1/2 -translate-x-1/2"
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </motion.div>
    </motion.button>
  );
});

ComboBoxTrigger.displayName = "ComboBoxTrigger";

export const ComboBoxContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = React.memo(({ children, className = "" }) => {
  const { open, setOpen, search, setSearch } = useComboBox();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState<"bottom" | "top">("bottom");
  const maxHeight = 200;

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setSearch("");
    }
  }, [open, setSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, setOpen, setSearch]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    [setSearch]
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dropdownRef}
          custom={position}
          variants={dropdownAnimationVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{
            [position]: "100%",
            maxHeight: `${maxHeight}px`,
          }}
          className={`
            absolute z-50 w-full mt-1 bg-white border border-gray-200
            rounded-lg shadow-lg overflow-hidden
            ${className}
          `}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search..."
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-auto"
            style={{ maxHeight: `${maxHeight - 70}px` }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

ComboBoxContent.displayName = "ComboBoxContent";

export const ComboBoxOption = React.memo<{
  children: React.ReactNode;
  value: string;
  displayLabel?: string;
  className?: string;
}>(({ children, value, displayLabel, className = "" }) => {
  const { selected, setSelected, search } = useComboBox();
  const isSelected = useMemo(
    () => selected.some((item) => item.value === value),
    [selected, value]
  );

  const label = typeof children === "string" ? children : value;
  const finalDisplayLabel = displayLabel || label;

  if (search && !label.toLowerCase().includes(search.toLowerCase())) {
    return null;
  }

  const handleSelect = useCallback(() => {
    setSelected((prev) =>
      isSelected
        ? prev.filter((item) => item.value !== value)
        : [...prev, { value, label, displayLabel: finalDisplayLabel }]
    );
  }, [isSelected, value, label, finalDisplayLabel, setSelected]);

  return (
    <motion.div
      onClick={handleSelect}
      whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
      whileTap={{ backgroundColor: "rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.2 }}
      className={`px-3 py-2 cursor-pointer text-sm ${className}`}
    >
      <div className="flex items-center">
        <motion.div
          initial={false}
          animate={{
            backgroundColor: isSelected ? "rgb(59, 130, 246)" : "white",
            borderColor: isSelected
              ? "rgb(59, 130, 246)"
              : "rgb(209, 213, 219)",
          }}
          className="w-4 h-4 mr-2 border rounded flex items-center justify-center  aspect-square"
        >
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Check className="h-3 w-3 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        {children}
      </div>
    </motion.div>
  );
});

export default ComboBox;
