import InputLabel from './InputLabel';
import WithGuidelineLink from '../forms/WithGuidelineLink';


interface InputLabelWithGuideLineLinkProps {
  inputTitle: string;
  guideline: string;
  title: string;
}

function InputLabelWithGuideLineLink({ inputTitle, guideline, title }: InputLabelWithGuideLineLinkProps) {

  return (
    <>
        <WithGuidelineLink
          guideline={guideline}
          guideLineTitle={'title'}
        >
          <InputLabel inputTitle={inputTitle} />
        </WithGuidelineLink>
    </>
  )
}


export default InputLabelWithGuideLineLink