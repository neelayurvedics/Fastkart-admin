
import React, { useContext, useEffect, useState } from "react";
import Logo from "../../components/commonComponent/logoWrapper/Logo";
import ToggleButton from "../../components/commonComponent/logoWrapper/ToggleButton";
import RightNav from "./RightNav";
import SettingContext from "@/helper/settingContext";
import Image from "next/image";
import WhiteLogo from '../../../public/assets/images/logo/full-white.png'
import SearchBar from "./SearchBar";

const Header = ({ setMode, mode, setLtr, settingData }) => {
  const { state, sidebarOpen, setSidebarOpen } = useContext(SettingContext);
  const [mounted, setMounted] = useState(true);
  const [openSearchBar, setOpenSearchBar] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(false);
    }, 300); // Reduced from 700ms to 300ms for faster skeleton removal
    return () => clearTimeout(timer);
  }, [])
  
  return (
    <div className={`page-header ${sidebarOpen ? "close_icon" : ""}`}>
      <div className={`header-wrapper m-0 ${mounted ? 'skeleton-header' : ""}`}>
        <div className="header-logo-wrapper p-0">
          <div className="logo-wrapper">
            <Logo settingData={settingData} />
          </div>
          <ToggleButton setSidebarOpen={setSidebarOpen} />
          <a className="d-lg-none d-block mobile-logo">
            <Image src={state?.setLightLogo?.original_url || WhiteLogo} height={21} width={120} alt="White Logo" unoptimized={true} priority />
          </a>
        </div>
        <SearchBar openSearchBar={openSearchBar} setOpenSearchBar={setOpenSearchBar} />
        <RightNav setMode={setMode} mode={mode} setLtr={setLtr} openSearchBar={openSearchBar} setOpenSearchBar={setOpenSearchBar} />
      </div>
    </div>
  );
};

export default Header;
