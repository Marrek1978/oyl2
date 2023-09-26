import InputLabel from './InputLabel';
import WithGuidelineLink from '../forms/WithGuidelineLink';


interface InputLabelWithGuideLineLinkProps {
  text: string;
  guideline: string;
  title: string;
}

function InputLabelWithGuideLineLink({ text, guideline, title }: InputLabelWithGuideLineLinkProps) {

  return (
    <>
      <div className="w-full">
        <WithGuidelineLink
          text={text}
          guideline={guideline}
          title={title}
        >
          <InputLabel text={text} />
        </WithGuidelineLink>
      </div>
    </>
  )
}


export default InputLabelWithGuideLineLink