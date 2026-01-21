import type { RefObject } from "react";

export const closeModal = (modalRef: RefObject<HTMLDivElement | null>) => {
    if (modalRef.current) {
        const closeButton = modalRef.current.querySelector('[data-bs-dismiss="modal"]') as HTMLButtonElement;
        if (closeButton) {
            closeButton.click();
        }
        const formElement = modalRef.current.querySelector('form');
        formElement?.reset();
    }
}