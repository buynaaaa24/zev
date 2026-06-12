"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

export const Meteors = ({
  number,
  className = ""
}: {
  number?: number;
  className?: string;
}) => {
  const count = number || 20;
  const [randoms, setRandoms] = useState<{ delay: number; duration: number }[]>([]);

  useEffect(() => {
    setRandoms(
      Array.from({ length: count }, () => ({
        delay: Math.random() * 5,
        duration: Math.floor(Math.random() * 5) + 5,
      }))
    );
  }, [count]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      {Array.from({ length: count }, (_, idx) => {
        const position = idx * (800 / count) - 400;
        const delay = randoms[idx] ? randoms[idx].delay : (idx * 0.27) % 5;
        const duration = randoms[idx] ? randoms[idx].duration : 5 + (idx % 5);

        return (
          <span
            key={"meteor" + idx}
            className={cn(
              "animate-meteor-effect absolute h-0.5 w-0.5 rotate-[45deg] rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
              "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
              className
            )}
            style={{
              top: "-40px",
              left: position + "px",
              animationDelay: delay + "s",
              animationDuration: duration + "s",
            }} />
        );
      })}
    </motion.div>
  );
};
