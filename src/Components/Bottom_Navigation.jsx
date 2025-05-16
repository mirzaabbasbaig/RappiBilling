import * as React from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Link & useNavigate for navigation
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import HomeIcon from "./Icons/home";
import OfferIcon from "./Icons/offer";
import UserIcon from "./Icons/user";
import FavoritesIcon from "./Icons/favorites";
import UserDrawer from "./Drawer/user.Drawer";

export default function BottomMenu() {
  const [value, setValue] = React.useState(0);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const navigate = useNavigate(); // ✅ Hook for programmatic navigation

  const IconStyle = {
    color: "#464D59",
    activeColor: "#FF441F",
    fontSize: "10px",
    fontFamily: "PPObjectSans",
  };

  const handleNavigation = (newValue, path) => {
    setValue(newValue);
    if (path) {
      navigate(path);
      setDrawerOpen(false); // ✅ Drawer close when navigating
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          zIndex: 10000, // Ensure it's above other content
        }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          sx={{
            boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
            backgroundColor: "white",
            borderRadius: "20px 20px 0 0",
          }}
        >
          {/* Home */}
          <BottomNavigationAction
            label="Inicio"
            icon={<HomeIcon fill={value === 0 ? IconStyle.activeColor : IconStyle.color} />}
            sx={{
              color: IconStyle.color,
              "& .MuiBottomNavigationAction-label": {
                fontSize: IconStyle.fontSize,
                fontFamily: IconStyle.fontFamily,
              },
              "&.Mui-selected": { color: IconStyle.activeColor },
            }}
            onClick={() => handleNavigation(0, "/")}
          />

          {/* Ofertas */}
          <BottomNavigationAction
            label="Ofertas"
            icon={<OfferIcon fill={value === 1 ? IconStyle.activeColor : IconStyle.color} />}
            sx={{
              color: IconStyle.color,
              "& .MuiBottomNavigationAction-label": {
                fontSize: IconStyle.fontSize,
                fontFamily: IconStyle.fontFamily,
              },
              "&.Mui-selected": { color: IconStyle.activeColor },
            }}
            onClick={() => handleNavigation(1, "/offers")}
          />

          {/* Favoritos */}
          <BottomNavigationAction
            label="Favoritos"
            icon={<FavoritesIcon fill={value === 2 ? IconStyle.activeColor : IconStyle.color} />}
            sx={{
              color: IconStyle.color,
              "& .MuiBottomNavigationAction-label": {
                fontSize: IconStyle.fontSize,
                fontFamily: IconStyle.fontFamily,
              },
              "&.Mui-selected": { color: IconStyle.activeColor },
            }}
            onClick={() => handleNavigation(2, "/favorites")}
          />

          {/* Cuenta (Opens User Drawer) */}
          <BottomNavigationAction
            label="Cuenta"
            icon={<UserIcon fill={value === 3 ? IconStyle.activeColor : IconStyle.color} />}
            sx={{
              color: IconStyle.color,
              "& .MuiBottomNavigationAction-label": {
                fontSize: IconStyle.fontSize,
                fontFamily: IconStyle.fontFamily,
              },
              "&.Mui-selected": { color: IconStyle.activeColor },
            }}
            onClick={() => {
              setValue(3);
              setDrawerOpen(true);
            }}
          />
        </BottomNavigation>
      </Box>

      {/* 🟢 User Drawer Component */}
      <UserDrawer open={drawerOpen} setOpen={setDrawerOpen} />
    </>
  );
}
