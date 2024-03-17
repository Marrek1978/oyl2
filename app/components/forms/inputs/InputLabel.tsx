
interface InputLabelProps {
  inputTitle: string;
  widthTailwind?: string;
  isSecondaryInput?: boolean;
}

function InputLabel({ inputTitle, widthTailwind = 'w-full', isSecondaryInput = false }: InputLabelProps) {
  const secondaryColorClass = isSecondaryInput ? 'text-base-content/70' : ''
  return (
    <>
      <div className={`${widthTailwind} `}>
        <label className="label p-0 m-0">
          <span className={`label-text text-base font-mont
          ${secondaryColorClass}
          `}>
            {inputTitle}
          </span>
        </label>
      </div>
    </>
  )
}

export default InputLabel