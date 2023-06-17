import React from 'react'

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  zIndex?: number;
}

const Modal: React.FC<ModalProps> = ({ children, onClose, zIndex=10 }) => {
  return (
    <>
      <div className={`z-${zIndex} fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center`}
        onClick={onClose}>
        <dialog
          className="modal"
          open
          onClick={(event) => event.stopPropagation()}
        >
          {children}
        </dialog>
      </div>
    </>
  )
}

export default Modal