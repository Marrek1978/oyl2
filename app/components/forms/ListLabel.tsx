interface ListLabelProps {
  text: string;
}
function ListLabel({text} : ListLabelProps) {
  return (
    <>
      <label className="label pl-0">
        <span className="label-text text-base font-mont font-medium">{text}</span>
      </label>
    </>
  )
}

export default ListLabel