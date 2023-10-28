import InputLabel from './InputLabel';
import WithGuidelineLink from './WithGuidelineLink';


type Props = {
  text: string;
  guideline: string;
  guidelineTitle: string;
  checkedState: boolean;
  handleCheckedState: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleColorDaisyUI?: string
  isSecondaryInput?: boolean
  labelWidthTailwindClass?: string
}

function ToggleWithLabelAndGuideLineLink({ text, guideline, guidelineTitle, checkedState, handleCheckedState, toggleColorDaisyUI, isSecondaryInput = false, labelWidthTailwindClass='w-28' }: Props) {



  let toggleColor;

  switch (toggleColorDaisyUI) {
    case 'primary':
      toggleColor = 'toggle-primary'
      break;
    case 'secondary':
      toggleColor = 'toggle-secondary'
      break;
    case 'success':
      toggleColor = 'toggle-success'
      break;
    case 'warning':
      toggleColor = 'toggle-warning'
      break;
    case 'error':
      toggleColor = 'toggle-error'
      break;
    case 'info':
      toggleColor = 'toggle-info'
      break;
    case 'accent':
      toggleColor = 'toggle-accent'
      break;
    default:
      toggleColor = 'toggle-secondary'
      break;
  }


  return (
    <>
      <div className="w-full flex justify-between flex-wrap gap-2 items-center   ">
        <div className="flex flex-wrap gap-2 items-center ">

          <div className={labelWidthTailwindClass}>
            <InputLabel inputTitle={text} widthTailwind='max-w-max' isSecondaryInput={isSecondaryInput} />
          </div>

          <div>
            <input type="checkbox"
              className={`toggle ${toggleColor}   `}
              checked={checkedState}
              onChange={handleCheckedState}
            />
          </div>
        </div>

        <div>
          <WithGuidelineLink
            guideline={guideline}
            guideLineTitle={guidelineTitle}
          >
          </WithGuidelineLink>
        </div>
      </div>
    </>
  )
}


export default ToggleWithLabelAndGuideLineLink