"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../app/page.module.css';

interface ToastProps {
  message: string;
  subText: string;
  type: "success" | "error" | "warning";
  onClose: () => void;
}

const ICONS = {
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.toastIcon}>
      <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1ZM2.5 12a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Zm13.28-2.72a.75.75 0 0 0-1.06-1.06L10.5 11.44l-1.22-1.22a.75.75 0 0 0-1.06 1.06l1.75 1.75a.75.75 0 0 0 1.06 0l4.75-4.75Z" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className={styles.toastIcon}>
      <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z" />
    </svg>
  ),
  warning: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.toastIcon}>
      <path d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1ZM2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5 9.5 9.5 0 0 0 2.5 12Zm9.5-4a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 12 8Zm1 7.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
    </svg>
  ),
};

const TYPE_CLASS = {
  success: styles.toastSuccess,
  error: styles.toastError,
  warning: styles.toastWarning,
};

export default function Toast({ message, subText, type, onClose }: ToastProps) {
  return (
    <div className={styles.toastContainer}>
      <AnimatePresence>
        <motion.div
          key="toast"
          className={`${styles.toast} ${TYPE_CLASS[type]}`}
          initial={{ opacity: 0, y: -24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.94 }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 28,
            mass: 0.8,
          }}
        >
          {/* Side wave */}
          <svg className={styles.toastWave} viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z" fillOpacity={1} />
          </svg>

          {/* Icon circle */}
          <motion.div
            className={styles.toastIconContainer}
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 22, delay: 0.08 }}
          >
            {ICONS[type]}
          </motion.div>

          {/* Text */}
          <motion.div
            className={styles.toastMessageContainer}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.1, ease: "easeOut" }}
          >
            <p className={styles.toastMessage}>{message}</p>
            <p className={styles.toastSubText}>{subText}</p>
          </motion.div>

          {/* Close */}
          <motion.svg
            onClick={onClose}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 15 15"
            fill="none"
            stroke="currentColor"
            className={styles.toastCrossIcon}
            whileHover={{ scale: 1.2, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <path fill="currentColor" d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" clipRule="evenodd" fillRule="evenodd" />
          </motion.svg>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
