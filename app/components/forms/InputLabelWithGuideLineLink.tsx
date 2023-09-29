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
      <div className="w-full">
        <WithGuidelineLink
          guideline={guideline}
          guideLineTitle={'title'}
        >
          <InputLabel inputTitle={inputTitle} />
        </WithGuidelineLink>
      </div>
    </>
  )
}


export default InputLabelWithGuideLineLink