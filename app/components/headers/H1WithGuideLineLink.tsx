import HeadingH1 from './HeadingH1';
import WithGuidelineLink from '../forms/inputs/WithGuidelineLink';

interface InputLabelWithGuideLineLinkProps {
  H1Title: string;
  guideline: string;
  guideLineTitle: string;
}

function H1WithGuideLineLink({ H1Title, guideline, guideLineTitle }: InputLabelWithGuideLineLinkProps) {

  return (
    <>
      <WithGuidelineLink
        guideline={guideline}
        guideLineTitle={guideLineTitle}
      >
        <HeadingH1 H1Title={H1Title} />
      </WithGuidelineLink>

    </>
  )
}

export default H1WithGuideLineLink