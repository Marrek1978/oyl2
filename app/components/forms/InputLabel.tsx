
interface InputLabelProps {
  text: string;
}

function InputLabel({ text }: InputLabelProps) {
  return (
    <>
      <div className="w-full">
      {/* <div className="w-full flex justify-between  "> */}
        <label className="label pl-0">
          <span className="label-text text-base font-mont font-semibold">{text}</span>
        </label>

      </div>
    </>
  )
}

export default InputLabel