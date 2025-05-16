import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CloseGray from "./Icons/closeGray";

const AlertComponent = ({ 
  type = "success", 
  message, 
  actionLabel, 
  onActionClick, 
  onClose, 
  icon, 
  show 
}) => {
  return (
    <AnimatePresence >
      {show && (
        <motion.div
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed top-5 left-1/2 transform -translate-x-1/2 w-full max-w-md z-[1000]"
        >
          <Stack sx={{ width: "100%", minHeight: "64px",padding:"16px" , borderRadius: "16px", overflow: "hidden" }} spacing={2}>
            <Alert 
              severity={type} 
              icon={icon} 
              sx={{
                backgroundColor: "#303030", 
                color: "white", 
                display: "flex", 
                alignItems: "center",
                borderRadius: "16px",
              }}
              action={
                <>
                  {actionLabel && onActionClick && (
                    <Button color="inherit" size="small" onClick={onActionClick}>
                      {actionLabel}
                    </Button>
                  )}
                  {onClose && (
                    <IconButton size="small" onClick={onClose} color="inherit">
                      <CloseGray fill="white" />
                    </IconButton>
                  )}
                </>
              }
            >
              <p className="text-white text-sm leading-5">{message}</p>
            </Alert>
          </Stack>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertComponent;
