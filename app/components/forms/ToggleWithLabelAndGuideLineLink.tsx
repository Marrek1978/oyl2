import InputLabel from './InputLabel';
import WithGuidelineLink from './WithGuidelineLink';
import type { DaisyUIColor } from '~/types/CSSTypes';


type Props = {
  text: string;
  guideline?: string;
  guidelineTitle?: string;
  checkedState: boolean;
  handleCheckedState: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleColorDaisyUI?: DaisyUIColor;
  isSecondaryInput?: boolean
  labelWidthTailwindClass?: string
}

function ToggleWithLabelAndGuideLineLink({ text, guideline, guidelineTitle, checkedState, handleCheckedState, toggleColorDaisyUI, isSecondaryInput = false, labelWidthTailwindClass = 'w-28' }: Props) {

  const toggleColor = `toggle-${toggleColorDaisyUI}`
  const TWGapCSS = guideline ? 'gap-2' : ''


  return (
    <>
      <div className={`w-full flex justify-between flex-wrap ${TWGapCSS} items-center`}>
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