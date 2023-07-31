import React, { useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  UncontrolledTooltip,
} from "reactstrap";

const CustomModal = (props) => {
  useEffect(() => {
    if (props.onLoad) {
      props.onLoad();
    }
  }, []);

  return (
    <div>
      <Modal isOpen={true} className={props.className}>
        <ModalHeader toggle={props.onClose ? () => props.onClose() : undefined}>
          {props.title}
        </ModalHeader>
        <ModalBody>{props.content}</ModalBody>
        <ModalFooter>
          {props.isLoading && <Spinner color="primary"></Spinner>}
          <span id="primary-button">
            <Button
              color="primary"
              onClick={props.primaryClick}
              disabled={props.isPrimaryButtonDisabled || props.isLoading}
              style={
                props.isPrimaryButtonDisabled ? { pointerEvents: "none" } : {}
              }
            >
              {props.primary}
            </Button>
          </span>
          {props.isPrimaryButtonDisabled && (
            <UncontrolledTooltip
              placement="top"
              target="primary-button"
              trigger="hover"
            >
              {props.primaryButtonDisabledContent}
            </UncontrolledTooltip>
          )}
          {props.secondary && (
            <Button
              color="secondary"
              onClick={props.secondaryClick}
              disabled={props.isLoading}
            >
              {props.secondary}
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CustomModal;
