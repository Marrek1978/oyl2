import { v4 as uuidv4 } from 'uuid';
import { Outlet } from '@remix-run/react';
import { useEffect, useState } from 'react';

import HeadingH1 from '~/components/titles/HeadingH1';
import { useGetDesireWithValuesAndOutcomes } from './dash.desires';
import SubHeading14px from '~/components/titles/SubHeading14px';
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';
import H2WithLinkAndProsePara from '~/components/text/H2WithLinkAndProsePara';
import { varsForPluralText } from '~/components/dnds/desires/DndSortableDesire';
import AllOutcomesDisplay from '~/components/desires/outcomes/AllOutcomesDisplay';
import { DesireCurrentDefaultText, DesireIdealPlaceholderText } from '~/components/utilities/PlaceHolderTexts';

import type { DesireOutcome, Value } from '@prisma/client';
import type { DesireWithValuesAndOutcomes } from '~/types/desireTypes';


function DesirePage() {

  const [values, setValues] = useState<Value[]>([]);
  const [outcomes, setOutcomes] = useState<DesireOutcome[]>([]);

  const desire: DesireWithValuesAndOutcomes | undefined = useGetDesireWithValuesAndOutcomes( );

  useEffect(() => {
    const transformedDesireValues = desire?.desireValues?.map(value => value.value) || [];
    setValues(transformedDesireValues);
    const transformedDesireOutcomes = desire?.desireOutcomes || [];
    setOutcomes(transformedDesireOutcomes);
  }, [desire])

  const { title, description, current, ideal } = desire || {};
  values?.sort((a, b) => a.sortOrder - b.sortOrder)
  const { plural: valueS, length: valuesLength } = varsForPluralText(values);
  const hasValues = values?.length > 0;
  const { plural: outcomeS } = varsForPluralText(outcomes);

  return (
    <>

      <BreadCrumbs secondCrumb={'Desire'} />
      <Outlet />

      <BasicTextAreaBG pageTitle='Desire'>
        <article>
          {/* //?  THE TITLE SECTION  */}
          <div className='mt-4'>
            <HeadingH1 text={title || ''} />
          </div>

          <div className="flex flex-wrap gap-2 mt-2  text-base-content/50">
            <SubHeading14px
              text={`Serves the Value${valueS} of : `}
            />
            {hasValues && (
              <div className='flex flex-wrap gap-x-2 font-semibold text-secondary/70'>
                {values?.map((value, index) => {
                  const title = value.valueTitle
                  let id = uuidv4();
                  let placeComma = index < valuesLength - 1 ? ', ' : ''

                  return (
                    <div key={id}>
                      <SubHeading14px text={`${title}${placeComma}`} />
                    </div>
                  )
                })}
              </ div>
            )}
          </div>


          {/* //?  PARAGRAPHS  */}
          <div className='flex flex-wrap gap-12 mt-8'>

            {/* //?  THE DESIRE  */}
            <div className='flex-1 min-w-[350px] sm:min-w-[550px] max-w-max '>
              <H2WithLinkAndProsePara
                title={'The Desire'}
                linkDestination={'editDetails'}
                linkText={'Edit Desire Description'}
                paragraph={description || ''}
              />
            </div>

            {/* //?  THE CURRENT SITUATION  */}
            <div className='flex-1 min-w-[350px] sm:min-w-[550px] max-w-max   '>
              <H2WithLinkAndProsePara
                title={'The Current Situation'}
                linkDestination={'editCurrent'}
                linkText={'Edit Current Situation'}
                paragraph={current?.length ? current : DesireCurrentDefaultText}
              />
            </div>

            {/* //?  THE IDEAL SITUATION  */}
            <div className='flex-1 min-w-[350px] sm:min-w-[550px] max-w-max   '>
              <H2WithLinkAndProsePara
                title={'The Ideal Scenario'}
                linkDestination={'editIdeal'}
                linkText={'Edit Ideal Scenario'}
                paragraph={ideal?.length ? ideal : DesireIdealPlaceholderText}
              />
            </div>

          </div>
          {/* //?  OUTCOMES  */}
          <div className='flex-1 min-w-[350px] sm:min-w-[550px] max-w-max  mt-12 '>
            <AllOutcomesDisplay
              outcomes={outcomes}
              plural={outcomeS}
              title={title || ''}
            />
          </div>

        </article>
      </BasicTextAreaBG >
    </>
  )
}

export default DesirePage
