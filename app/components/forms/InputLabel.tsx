
interface InputLabelProps {
  inputTitle: string;
  widthTailwind?: string;
}

function InputLabel({ inputTitle, widthTailwind = 'w-full' }: InputLabelProps) {
  return (
    <>
      <div className={`${widthTailwind} `}>
        <label className="label p-0">
          <span className="label-text text-base font-mont font-semibold">{inputTitle}</span>
        </label>

      </div>
    </>
  )
}

export default InputLabel