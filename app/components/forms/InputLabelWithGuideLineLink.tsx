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
      <WithGuidelineLink
        text={text}
        guideline={guideline}
        title={title}
      >
        <InputLabel text={text} />
      </WithGuidelineLink>
    </>
  )
}


export default InputLabelWithGuideLineLink