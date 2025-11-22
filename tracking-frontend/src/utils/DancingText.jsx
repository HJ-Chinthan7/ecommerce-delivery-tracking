import { motion, AnimatePresence } from "framer-motion"; //eslint-disable-line
const DancingText = ({ text }) => {
  const letters = text.split("");

  return (
    <div className="inline-flex overflow-hidden">
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="inline-block cursor-default"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            damping: 12,
            stiffness: 200,
            delay: index * 0.04 
          }}
          whileHover={{
            y: -5,
            color: "#4ade80", 
            transition: { duration: 0.2 }
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </div>
  );
};
export default DancingText;