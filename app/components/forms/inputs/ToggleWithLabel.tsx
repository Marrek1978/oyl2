import InputLabel from './InputLabel';

type Props = {
  text: string;
  checkedState: boolean;
  handleCheckedState: () => void;
}


function ToggleWithLabel({ text, checkedState, handleCheckedState }: Props) {

  return (
    <>
      <div className="w-full flex justify-between flex-wrap gap-2 items-center ">
        <div className="  flex flex-wrap gap-2 items-center ">

          <div>
            <InputLabel inputTitle={text} widthTailwind='max-w-max' />
          </div>

          <input type="checkbox"
            className="toggle toggle-secondary itmes-center flex flex-col items-center "
            checked={checkedState}
            onChange={handleCheckedState}
          />

        </div>
      </div>
    </>
  )
}


export default ToggleWithLabel