import React from "react";
import { motion, MotionValue } from "framer-motion";

interface SectionContainerProps {
  style?: { opacity?: MotionValue<number>; x?: MotionValue<number> };
  children: React.ReactNode;
}

const SectionContainer: React.FC<SectionContainerProps> = ({ style, children }) => (
  <motion.section
    style={style}
    className="flex-shrink-0 w-screen h-screen overflow-y-auto flex flex-col items-center py-10 snap-start"
  >
    {children}
  </motion.section>
);

export default SectionContainer;
