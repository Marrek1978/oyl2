interface InputLabelProps {
  text: string;
}

function InputLabel({ text }: InputLabelProps) {
  return (
    <>
      <label className="label pl-0">
        <span className="label-text text-base font-mont font-semibold">{text}</span>
      </label>
    </>
  )
}

export default InputLabel