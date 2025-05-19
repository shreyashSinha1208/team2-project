import React, { SVGProps } from "react";

interface HomeIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const HomeIcon: React.FC<HomeIconProps> = ({ className, ...props }) => {
  return (
    <svg
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M21 17.8109V10.8663C21 9.88216 20.5726 8.95316 19.8418 8.34896L14.4558 3.89571C13.0113 2.70143 10.9887 2.70143 9.54424 3.89571L4.15818 8.34896C3.42742 8.95316 3 9.88216 3 10.8663V17.8109C3 19.5722 4.34315 21 6 21H8C8.55228 21 9 20.5523 9 20V16.7478C9 14.9865 10.3431 13.5587 12 13.5587C13.6569 13.5587 15 14.9865 15 16.7478V20C15 20.5523 15.4477 21 16 21H18C19.6569 21 21 19.5722 21 17.8109Z"
        stroke="#000000"
        className="dark:fill-[#000000] dark:stroke-white"
        fill="#ffffff"
        strokeWidth="2"
      />
    </svg>
  );
};

export default HomeIcon;
