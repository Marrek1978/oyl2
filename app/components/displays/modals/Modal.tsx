import React from 'react'

interface ModalProps {
  children: React.ReactNode;
  onClose?: () => void;
  zIndex?: number;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose = () => { }, zIndex = 10, onMouseOver, onMouseOut }) => {
  return (
    <>
      <div className={`z-${zIndex} 
          fixed top-0 left-0 w-full h-full
          bg-base-content/50
          flex justify-center items-center
         `}
        onClick={onClose}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
      >
        <dialog
          className="modal  overflow-auto flex-1	"
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