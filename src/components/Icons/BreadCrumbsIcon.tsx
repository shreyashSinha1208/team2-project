import React, { SVGProps } from "react";


interface HomeIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const BreadCrumbsIcon: React.FC<HomeIconProps> = ({ className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enableBackground="new 0 0 64 64"
      viewBox="0 0 64 64"
      id="arrow"
      className={className}
      {...props}
    >
      <path
        d="m-210.9-289-2-2 11.8-11.7-11.8-11.7 2-2 13.8 13.7-13.8 13.7"
        transform="translate(237 335)"
      ></path>
    </svg>
  );
};

export default BreadCrumbsIcon;
