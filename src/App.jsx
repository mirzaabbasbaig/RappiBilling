import "./App.css";
import BottomMenu from "./Components/Bottom_Navigation";
import BillingInformation from "./Screens/Billing Data/BillingInformation";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./Screens/Splash/splash";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Splash screen will NOT have BottomMenu */}
        <Route path="/" element={<Splash />} />

        {/* ✅ BottomMenu will be part of all other screens */}
        <Route
          path="/*"
          element={
            <>
              <BottomMenu />
              <Routes>
                <Route path="/billing_information" element={<BillingInformation />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
