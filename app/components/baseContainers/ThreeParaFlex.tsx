import React from 'react'
import H2WithLinkAndProsePara from '../text/H2WithLinkAndProsePara'
import H2WithProsePara from '../text/H2WithProsePara'

type Props = {

  title1: string,
  title2?: string,
  title3?: string,
  linkDestination1?: string,
  linkDestination2?: string,
  linkDestination3?: string,
  linkText1?: string,
  linkText2?: string,
  linkText3?: string,
  textParagraph1: string,
  textParagraph2?: string,
  textParagraph3?: string,



}

function ThreeParaFlex({
  title1,
  title2,
  title3,
  linkDestination1,
  linkDestination2,
  linkDestination3,
  linkText1,
  linkText2,
  linkText3,
  textParagraph1,
  textParagraph2,
  textParagraph3,
}: Props) {
  return (
    <div className='flex flex-wrap gap-12 mt-8'>

      {/* //?  THE DESIRE  */}
      <div className='flex-1 min-w-[350px] sm:min-w-[550px] max-w-max '>
        {linkDestination1 && linkText1 ? (
          <H2WithLinkAndProsePara
            title={title1}
            linkDestination={linkDestination1}
            linkText={linkText1}
            paragraph={textParagraph1}
          />
        ) : (
          <H2WithProsePara
            title={title1}
            paragraph={textParagraph1}
          />
        )}
      </div>

      {/* //?  THE CURRENT SITUATION  */}
      <div className='flex-1 min-w-[350px] sm:min-w-[550px] max-w-max   '>
        {title2 && linkDestination2 && linkText2 && textParagraph2 && (
          <H2WithLinkAndProsePara
            title={title2}
            linkDestination={linkDestination2}
            linkText={linkText2}
            paragraph={textParagraph2}
          />
        )}
        {title2 && textParagraph2 &&  !linkDestination3 && !linkText3 && (
          <H2WithProsePara
            title={title2}
            paragraph={textParagraph2}
          />
        )}
      </div>

      {/* //?  THE IDEAL SITUATION  */}
      <div className='flex-1 min-w-[350px] sm:min-w-[550px] max-w-max   '>
      {title3 && linkDestination3 && linkText3 && textParagraph3 && (
          <H2WithLinkAndProsePara
            title={title3}
            linkDestination={linkDestination3}
            linkText={linkText3}
            paragraph={textParagraph3}
          />
        )}
        {title3 && textParagraph3 && !linkDestination3 && !linkText3 &&  (
          <H2WithProsePara
            title={title3}
            paragraph={textParagraph3}
          />
        )}
      </div>

    </div>
  )
}

export default ThreeParaFlex