"use client";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./side-bar.module.scss";
import { useEffect, useState } from "react";

const images = [
  "/img-1.jpg",
  "/img-2.jpg",
  "/img-3.jpg",
  "/img-4.jpg",
  "/img-5.jpg",
];

const SideBar = () => {
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    preloadImages(images);

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const preloadImages = (urls: string[]) => {
    urls.forEach((url) => {
      new Image().src = url;
    });
  };

  return (
    <div className={styles.wrap}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className={styles.background}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{
            x: { duration: 0.3, ease: "easeInOut" },
            opacity: { duration: 0.2 },
          }}
          style={{ backgroundImage: `url(${images[index]})` }}
        />
      </AnimatePresence>
      <div className={styles.content}>
        <h2>We-Care</h2>
        <h4>Patient Management system</h4>
      </div>
    </div>
  );
};

export default SideBar;
