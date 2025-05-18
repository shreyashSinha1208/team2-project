"use client";
import { useEffect, useRef } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

interface WordProps {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}

const Word: React.FC<WordProps> = ({
  words,
  className,
  filter = true,
  duration = 0.2,
}) => {
  const scopeRef = useRef<HTMLDivElement>(null);
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    if (scopeRef.current) {
      animate(
        scopeRef.current.querySelectorAll("span"),
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
        },
        {
          duration: duration,
          delay: stagger(0.1),
        }
      );

      return () => {
        if (scopeRef.current) {
          // Cleanup to reset animations
          animate(
            scopeRef.current.querySelectorAll("span"),
            { opacity: 0, filter: "blur(3px)" },
            { duration: 0 }
          );
        }
      };
    }
  }, [scope, animate, filter, duration, words]);

  const renderWords = () => {
    return (
      <motion.div ref={scopeRef}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="dark:text-white text-black opacity-0"
            style={{
              filter: filter ? "blur(5px)" : "none",
            }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  return (
    <div className={cn("", className)}>
      <div className="mt-4">
        <div className="dark:text-white text-black text-lg leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};

export default Word;

// "use client";
// import { useEffect } from "react";
// import { motion, stagger, useAnimate } from "framer-motion";
// import { cn } from "@/lib/utils";

// interface WordProps {
//   words: string;
//   className?: string;
//   filter?: boolean;
//   duration?: number;
// }

// const Word: React.FC<WordProps> = ({ words, className, filter = true, duration = 0.5 }) => {
//   const [scope, animate] = useAnimate();
//   const wordsArray = words.split(" ");

//   useEffect(() => {
//     animate(
//       "span",
//       {
//         opacity: 1,
//         filter: filter ? "blur(0px)" : "none",
//       },
//       {
//         duration: duration,
//         delay: stagger(0.1),
//       }
//     );

//     return () => {
//       // Cleanup to reset animations
//       animate("span", { opacity: 0, filter: "blur(10px)" }, { duration: 0 });
//     };
//   }, [scope, animate, filter, duration, words]);

//   const renderWords = () => {
//     return (
//       <motion.div ref={scope}>
//         {wordsArray.map((word, idx) => (
//           <motion.span
//             key={word + idx}
//             className="dark:text-white text-black opacity-0"
//             style={{
//               filter: filter ? "blur(5px)" : "none",
//             }}
//           >
//             {word}{" "}
//           </motion.span>
//         ))}
//       </motion.div>
//     );
//   };

//   return (
//     <div className={cn("", className)}>
//       <div className="mt-4">
//         <div className="dark:text-white text-black text-lg leading-snug tracking-wide">
//           {renderWords()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Word;
