import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Col, Container, Row } from "reactstrap";
import Image from "next/image";
import SettingContext from "../../helper/settingContext";
import WhiteLogo from "../../../public/assets/images/logo/full-white.png";

const Footer = () => {
  const { t } = useTranslation( 'common');
  const { state } = useContext(SettingContext)
  return (
    <Container fluid={true}>
      <footer className="footer">
        <Row>
          <Col md="12" className="footer-copyright text-center">
            {state?.setFooterLogo?.original_url || WhiteLogo ? (
              <div className="mb-2">
                <Image 
                  src={state?.setFooterLogo?.original_url || WhiteLogo} 
                  alt="Footer Logo" 
                  width={100} 
                  height={35} 
                  unoptimized={true}
                />
              </div>
            ) : null}
            <p className="mb-0">{t(state?.setCopyRight ? state?.setCopyRight : '© Neelayurvedics')}</p>
          </Col>
        </Row>
      </footer>
    </Container>
  );
};

export default Footer;
