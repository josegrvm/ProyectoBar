import React from "react";
import { motion } from "framer-motion";

export default function MotionCard({ className="", children }){
    return (
        <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .35, ease: "easeOut" }}
        whileHover={{ translateY: -2 }}
        className={`bar-card ${className}`}
        >
        {children}
        </motion.div>
    );
}
