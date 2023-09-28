import React from 'react'
import WithGuidelineLink from './WithGuidelineLink';
import InputLabel from './InputLabel';

type Props = {
  text: string;
  guideline: string;
  title: string;
  checkedState: boolean;
  handleCheckedState: () => void;
}

function ToggleWithLabelAndGuideLineLink({ text, guideline, title, checkedState, handleCheckedState }: Props) {

  return (
    <>
      <div className="w-full flex justify-between flex-wrap gap-2 items-center ">
        <div className="  flex flex-wrap gap-2 items-center ">

          <div>
            <InputLabel text={text} width='max-w-max' />
          </div>

          <div>
            <input type="checkbox"
              className="toggle toggle-secondary itmes-center flex flex-col items-center "
              checked={checkedState}
              onChange={handleCheckedState}
            />
          </div>

        </div>
        <div>
          <WithGuidelineLink
            text={text}
            guideline={guideline}
            title={title}
          >
          </WithGuidelineLink>
        </div>
      </div>
    </>
  )
}


export default ToggleWithLabelAndGuideLineLink