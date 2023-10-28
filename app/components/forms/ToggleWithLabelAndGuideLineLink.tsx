import InputLabel from './InputLabel';
import WithGuidelineLink from './WithGuidelineLink';


type Props = {
  text: string;
  guideline: string;
  title: string;
  checkedState: boolean;
  handleCheckedState: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleColorDaisyUI?: string
  isSecondaryInput?: boolean
}

function ToggleWithLabelAndGuideLineLink({ text, guideline, title, checkedState, handleCheckedState, toggleColorDaisyUI = 'secondary' , isSecondaryInput=false}: Props) {

  const toggleColor = `toggle-${toggleColorDaisyUI}`

  return (
    <>
      <div className="w-full flex justify-between flex-wrap gap-2 items-center ">
        <div className="  flex flex-wrap gap-2 items-center ">

          <div>
            <InputLabel inputTitle={text} widthTailwind='max-w-max' isSecondaryInput={isSecondaryInput}/>
          </div>

          <div>
            <input type="checkbox"
              className={`toggle  ${toggleColor} itmes-center flex flex-col items-center `}
              checked={checkedState}
              onChange={handleCheckedState}
            />
          </div>

        </div>
        <div>
          <WithGuidelineLink
            guideline={guideline}
            guideLineTitle={title}
          >
          </WithGuidelineLink>
        </div>
      </div>
    </>
  )
}


export default ToggleWithLabelAndGuideLineLink