import React from "react";
import { motion } from "framer-motion";

export default function MotionButton({ className="", children, ...rest }){
    return (
        <motion.button
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 380, damping: 24 }}
        className={`bar-btn ${className}`}
        {...rest}
        >
        {children}
        </motion.button>
    );
}
