// components/ScrollAnimation.js
import { motion } from "framer-motion";

const ScrollAnimation = ({ children, animationProps }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }} // Trigger animation when 20% of the element is in view
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 1 } },
      }}
      {...animationProps}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation;
