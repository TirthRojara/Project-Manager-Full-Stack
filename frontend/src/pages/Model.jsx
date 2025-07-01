import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';



export default function Modal({ children, onClose, open }) {
    const dialog = useRef();

    // useEffect(() => {
    //     // Using useEffect to sync the Modal component with the DOM Dialog API
    //     // This code will open the native <dialog> via it's built-in API whenever the <Modal> component is rendered
    //     const modal = dialog.current;
    //     modal.showModal();

    //     return () => {
    //         modal.close(); // needed to avoid error being thrown
    //     };
    // }, []);

    // useEffect(() => {
    //     const modal = dialog.current;

    //     const handleCancel = (e) => {
    //         e.preventDefault(); // prevent default closing
    //         if (onClose) onClose(); // call the parent close handler
    //     };

    //     modal.addEventListener('cancel', handleCancel); // escape key
    //     modal.showModal();

    //     return () => {
    //         modal.removeEventListener('cancel', handleCancel);
    //         modal.close(); // to avoid any error
    //     };
    // }, []);

    useEffect(() => {
        const modal = dialog.current;

        if (open) {
            modal.showModal();
        }

        return () => modal.close();
    }, [open]);

    return createPortal(
        <dialog
            // className="modal"
            className=" m-0 fixed p-5 md:p-8 my-auto mx-auto  max-h-[80vh] bg-[#e2e5eb] border-0 rounded-[6px] w-[400px] md:w-[30rem] z-[1000] flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.26)] animate-[slide-down-fade-in_300ms_ease-out_forwards] [&::backdrop]:h-screen  [&::backdrop]:w-full  [&::backdrop]:bg-black/50  [&::backdrop]:fixed  [&::backdrop]:top-0  [&::backdrop]:left-0 "
            ref={dialog}
            onClose={onClose}>
            {children}
        </dialog>,
        document.getElementById('modal')
    );
}


