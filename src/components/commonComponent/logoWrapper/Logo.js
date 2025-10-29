import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import SettingContext from "../../../helper/settingContext";
import WhiteLogo from "../../../../public/assets/images/logo/full-white.png";

const Logo = () => {
  const { state, settingObj } = useContext(SettingContext);
  
  return (
    <Link href="/dashboard">
      {state?.setLightLogo?.original_url ? (
        <Image 
          className="for-white" 
          src={`${state?.setLightLogo?.original_url}`} 
          alt="Light Logo" 
          width={100} 
          height={35} 
          priority 
          unoptimized={true} 
        />
      ) : (
        <Image 
          className="for-white" 
          src={WhiteLogo} 
          alt="White Logo" 
          width={120} 
          height={40} 
          priority 
          unoptimized={true} 
        />
      )}
    </Link>
  );
};

export default Logo;
