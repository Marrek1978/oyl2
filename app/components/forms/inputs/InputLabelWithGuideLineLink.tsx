import InputLabel from './InputLabel';
import WithGuidelineLink from './WithGuidelineLink';


interface InputLabelWithGuideLineLinkProps {
  inputTitle: string;
  guideline: string;
  guideLineTitle?: string;
  isSecondaryInput?: boolean;
}

function InputLabelWithGuideLineLink({ inputTitle, guideline, guideLineTitle = 'Guideline' , isSecondaryInput=false}: InputLabelWithGuideLineLinkProps) {

  return (
    <>
      <WithGuidelineLink
        guideline={guideline}
        guideLineTitle={guideLineTitle}
      >
        <InputLabel inputTitle={inputTitle} isSecondaryInput={isSecondaryInput} />
      </WithGuidelineLink>
    </>
  )
}


export default InputLabelWithGuideLineLink