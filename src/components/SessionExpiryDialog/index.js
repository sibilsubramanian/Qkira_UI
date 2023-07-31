import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { TiWarningOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { listenCookieChange } from "../../Services/cookie";

import "./sessionExpiryDialog.scss";

const SessionExpiryDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  listenCookieChange("accessToken", ({ previousValue, currentValue }) => {
    if (!currentValue && previousValue) {
      setIsOpen(true);
    }
  });

  const navigate = useNavigate();

  return (
    isOpen && (
      <Modal isOpen={true} className="session-expiry-modal">
        <ModalHeader
          className="modal-header"
          toggle={() => {
            navigate("/login");
            setIsOpen(false);
          }}
        />
        <ModalBody className="error">
          <TiWarningOutline />
          <div className="message">
            The session has expired, please login again.
          </div>
        </ModalBody>
      </Modal>
    )
  );
};

export default SessionExpiryDialog;
