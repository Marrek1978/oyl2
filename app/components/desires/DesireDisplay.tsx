import { v4 as uuidv4 } from 'uuid';

import SubHeading14px from '../titles/SubHeading14px';
import SubHeading16px from '../titles/SubHeading16px';
import BasicTextAreaBG from '../baseContainers/BasicTextAreaBG';
import { DesireCurrentDefaultText, DesireIdealPlaceholderText } from '../utilities/PlaceHolderTexts';

import type { DesireValues } from '~/types/desireTypes';
import HeadingH1 from '../titles/HeadingH1';
import H2WithLinkAndProsePara from '../text/H2WithLinkAndProsePara';


interface DesireDisplayProps {
  title: string;
  description: string;
  current: string;
  ideal: string;
  desireValues: DesireValues['desireValues'];
  plural: string;
}


function DesireDisplay({ title, description, current, ideal, desireValues, plural }: DesireDisplayProps) {

  return (
    <>
      <div className=''>

        <BasicTextAreaBG >

          <div className='text-success mb-2'>
            <SubHeading16px text='Desire' />
          </div>

          {/* //?  THE TITLE SECTION  */}
          <HeadingH1 text={title || ''} />

          <div className=" flex flex-wrap mt-2 max-w-prose text-secondary/70">
            <SubHeading14px
              text={`Aligned with the Value${plural} of : `}
            />

            {desireValues?.map((value) => {
              const title = value.value.valueTitle
              let id = uuidv4();
              return (
                <div key={id}>
                  <SubHeading14px text={` ${title}, `} />
                </div>
              )
            })
            }
          </div >


          <div className='flex flex-wrap gap-12 max-w-max'>

            {/* //*  Grouped together  */}
            <div  className='flex-1 max-w-max'>
              {/* //?  THE DESIRE  */}
              <div className='mt-8 '>
                <H2WithLinkAndProsePara
                  title={'The Desire'}
                  linkDestination={'editDetails'}
                  linkText={'Edit Desire Description'}
                  paragraph={description || ''}
                />
              </div>

              {/* //?  THE CURRENT SITUATION  */}
              <div className='mt-8 '>
                <H2WithLinkAndProsePara
                  title={'Current Situation'}
                  linkDestination={'editCurrent'}
                  linkText={'Edit Current Situation'}
                  paragraph={current?.length ? current : DesireCurrentDefaultText}
                />
              </div>
            </div>

            {/* //?  THE IDEAL SITUATION  */}
            <div className='flex-1 mt-8 max-w-max'>
              <H2WithLinkAndProsePara
                title={'The Ideal Scenario'}
                linkDestination={'editIdeal'}
                linkText={'Edit Ideal Scenario'}
                paragraph={ideal?.length ? ideal : DesireIdealPlaceholderText}
              />
            </div>
          </div>
        </BasicTextAreaBG >
      </div>

    </>
  )
}

export default DesireDisplay