import { useContext } from "react";
import SessionExpirePopup from "../user/popupModel/SessionExpirePopup";
import { AppContext } from "../../context/AppContext";

const SessionWrapper = ({ children }) => {
  const { sessionExpired, handleCloseSessionExpired } = useContext(AppContext);
  return (
    <>
      {sessionExpired ? (
        <SessionExpirePopup onClose={handleCloseSessionExpired} />
      ) : (
        children
      )}
    </>
  );
};

export default SessionWrapper;