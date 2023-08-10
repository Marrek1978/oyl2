import HeadingH1 from './HeadingH1';
import WithGuidelineLink from '../forms/WithGuidelineLink';

interface InputLabelWithGuideLineLinkProps {
  text: string;
  guideline: string;
  title: string;
}

function H1WithGuideLineLink({ text, guideline, title }: InputLabelWithGuideLineLinkProps) {

  return (
    <>
      <WithGuidelineLink
        text={text}
        guideline={guideline}
        title={title}
      >
        <HeadingH1 text={text} />
      </WithGuidelineLink>

    </>
  )
}

export default H1WithGuideLineLink