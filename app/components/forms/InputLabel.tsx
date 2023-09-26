
interface InputLabelProps {
  text: string;
  width?: string;
}

function InputLabel({ text, width = 'w-full' }: InputLabelProps) {
  return (
    <>
      <div className={`${width}   `}>
        <label className="label p-0">
          <span className="label-text text-base font-mont font-semibold">{text}</span>
        </label>

      </div>
    </>
  )
}

export default InputLabel