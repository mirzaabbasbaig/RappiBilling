import * as React from "react";
import { Link } from "react-router-dom"; // ✅ Link import for navigation
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Billing from "../../assets/images/billing.svg";
import ChangeRappiIcon from "../../assets/images/ChangeRappiIcon.svg";
import Globe from "../../assets/images/Globe.svg";
import Help from "../../assets/images/help.svg";
import Location from "../../assets/images/location.svg";
import NewOnRappi from "../../assets/images/New_on_Rappi.svg";
import Notifications from "../../assets/images/Notifications.svg";
import Payment from "../../assets/images/payment.svg";
import TermsAndConditions from "../../assets/images/Terms_and_Conditions.svg";
import ArrowIcon from "../Icons/Arrow.Icon";
import Credits from "../../assets/images/Credits.svg";
import Coupons from "../../assets/images/Coupons.svg";
import GiftCards from "../../assets/images/GiftCards.svg";
import Loyalty from "../../assets/images/Loyalty.svg";
import Rappi_Pro from "../../assets/images/Rappi_Pro.svg";

export default function UserDrawer({ open, setOpen }) {
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const NavigateList = [
    { icon: Credits, text: "Credits", link: "/credits", sequence: 1 },
    { icon: Coupons, text: "Coupons", link: "/coupons", sequence: 1 },
    { icon: GiftCards, text: "Gift cards", link: "/gift-cards", sequence: 1 },
    { icon: Loyalty, text: "Loyalty", link: "/loyalty", sequence: 1 },
    { icon: Rappi_Pro, text: "Rappi Pro", link: "/rappi-pro", sequence: 2 },
    { icon: Location, text: "Addresses", link: "/addresses", sequence: 2 },
    { icon: Payment, text: "Payment methods", link: "/payment-methods", sequence: 2 },
    { icon: Billing, text: "Billing information", link: "/billing_information", sequence: 2 }, // ✅ Splash Route
    { icon: Help, text: "Help", link: "/help", sequence: 2 },
    { icon: Globe, text: "Language", link: "/language", sequence: 3 },
    { icon: Notifications, text: "Notifications", link: "/notifications", sequence: 3 },
    { icon: ChangeRappiIcon, text: "Change Rappi icon", link: "/change-icon", sequence: 3 },
    { icon: NewOnRappi, text: "New to Rappi", link: "/new-on-rappi", sequence: 4 },
    { icon: TermsAndConditions, text: "Terms and Conditions", link: "/terms", sequence: 4 },
    { icon: TermsAndConditions, text: "Privacy Policy", link: "/privacy-policy", sequence: 4 },
    { icon: TermsAndConditions, text: "Relevant information", link: "/info", sequence: 4 },
  ];

  const groupedSections = {
    "Cuenta": NavigateList.filter((item) => item.sequence === 1),
    "Configuración": NavigateList.filter((item) => item.sequence === 2),
    "Más información": NavigateList.filter((item) => item.sequence === 3),
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100vw",
          minHeight: "100vh",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
         
        },
      }}
    >
      <Box sx={{ flexGrow: 1, overflowY: "auto", padding: "0 20px" }}>
        {Object.entries(groupedSections).map(([title, items]) => (
          <div key={title}>
            <h2 className="text-black text-[20px] leading-6 font-normal pb-4 mt-10">{title}</h2>
            <List>
              {items.map((item) => (
                <React.Fragment key={item.text}>
                  <ListItem disablePadding>
                    <ListItemButton component={Link} to={item.link} onClick={() => setOpen(false)}>
                      <img src={item.icon} alt={item.text} />
                      <ListItemText primary={item.text} className="pl-6 font-medium text-[14px] text-black" style={{ fontFamily: "'PP Object Sans', sans-serif" }} />
                      <ArrowIcon />
                    </ListItemButton>
                  </ListItem>
                  <Divider sx={{ my: 1, background: "#ECEFF3" }} />
                </React.Fragment>
              ))}
            </List>
          </div>
        ))}
      </Box>
    </Drawer>
  );
}




































