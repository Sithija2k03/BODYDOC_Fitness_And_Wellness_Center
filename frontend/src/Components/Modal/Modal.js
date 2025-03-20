import React from "react";
import { ModalOverlay, ModalContent, CloseButton } from "./ModalStyles";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <ModalOverlay>
            <ModalContent>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                {children}
            </ModalContent>
        </ModalOverlay>
    );
};

export default Modal;