import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { PaginationProps } from "@/lib/types";
import DropDown from "@/Components/DropDown";
import Button from "@/Components/ui/Button";

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
  pageSizeOptions = [10, 20, 50, 100],
}) => {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  // Calculate the range of items currently displayed
  const firstItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const lastItem = Math.min(currentPage * pageSize, totalItems);

  // Convert page size options to dropdown items
  const pageSizeItems = pageSizeOptions.map((size) => ({
    label: `${size} per page`,
    value: size.toString(),
  }));

  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center space-x-4">
        <DropDown
          items={pageSizeItems}
          value={pageSize.toString()}
          onChange={(value) => onPageSizeChange(Number(value))}
          buttonText={`${pageSize} per page`}
          width="120px"
          className="w-[120px]"
          showSearch={false}
        />

        {/* Display current range of items */}
        <div className="text-sm text-gray-500">
          {firstItem}-{lastItem} of {totalItems} items
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="xs"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center space-x-1">
          {getPageNumbers().map((number, index) =>
            number === "..." ? (
              <span key={`dots-${index}`} className="px-2">
                ...
              </span>
            ) : (
              <Button
                key={number}
                variant={currentPage === number ? "primary" : "ghost"}
                size="xs"
                onClick={() => onPageChange(number as number)}
              >
                {number}
              </Button>
            )
          )}
        </div>

        <Button
          variant="ghost"
          size="xs"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
