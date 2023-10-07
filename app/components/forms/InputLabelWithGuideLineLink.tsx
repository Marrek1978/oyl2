import InputLabel from './InputLabel';
import WithGuidelineLink from '../forms/WithGuidelineLink';


interface InputLabelWithGuideLineLinkProps {
  inputTitle: string;
  guideline: string;
  guideLineTitle?: string;
}

function InputLabelWithGuideLineLink({ inputTitle, guideline, guideLineTitle = 'Guideline' }: InputLabelWithGuideLineLinkProps) {

  return (
    <>
      <WithGuidelineLink
        guideline={guideline}
        guideLineTitle={guideLineTitle}
      >
        <InputLabel inputTitle={inputTitle} />
      </WithGuidelineLink>
    </>
  )
}


export default InputLabelWithGuideLineLink