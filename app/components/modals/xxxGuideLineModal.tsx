
interface GuideLineModalProps {
  guideLine: string;
  onclose: () => void;
  zIndex?: number;
}
function GuideLineModal({ guideLine, onclose, zIndex = 10 }: GuideLineModalProps) {
  return (
    <>
      <div className={`z-${zIndex}  top-0 left-0 flex justify-center items-center`}
        onClick={onclose}>
        <dialog
          className="modal"
          open
        // onClick={(event) => event.stopPropagation()}
        >
          <div className="card w-[700px] bg-base-100 
        rounded-none
        font-mont
        shadow-xl z-30
        ">
            <div className="card-body">
              <div >
                sup
              </div>
            </div>
          </div>
        </dialog>
      </div>
    </>
  )
}

export default GuideLineModal