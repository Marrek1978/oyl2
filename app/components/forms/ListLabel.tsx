interface ListLabelProps {
  text: string;
}
function ListLabel({text} : ListLabelProps) {
  return (
    <>
      <label className="label pl-0 hover:cursor-pointer">
        <span className="label-text text-base font-mont font-medium  ">{text}</span>
      </label>
    </>
  )
}

export default ListLabel