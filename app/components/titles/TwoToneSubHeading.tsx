import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react'

import SubHeading12px from './SubHeading12px';
import SubHeading14px from './SubHeading14px';
import SubHeading16px from './SubHeading16px';


type Props = {
  staticHeading: string;
  variableHeadingsArray: any[];
  size?: '12px' | '14px' | '16px';
  staticHeadingDaisyUIColorClass?: string;
  variableHeadingsDaisyUIColorClass?: string;

}

function TwoToneSubHeading({ staticHeading, variableHeadingsArray, size = '12px', staticHeadingDaisyUIColorClass = 'text-base-content/70', variableHeadingsDaisyUIColorClass = 'text-secondary/70' }: Props) {
  const [isPlural, setIsPlural] = useState<boolean>(false);
  const [variableArray, setvariableArray] = useState<string[]>([]);
  const [variableHeading, setvariableHeading] = useState<JSX.Element>();
  const [staticComponent, setStaticComponent] = useState<JSX.Element>();

  const arrayLength = variableHeadingsArray?.length
  const isPluralText = isPlural ? 's' : '';


  useEffect(() => {
    setStaticComponent(returnSubHeading(size, `${staticHeading}${isPluralText}: `))
  }, [variableArray, size, staticHeading, isPluralText])


  useEffect(() => {
    if (arrayLength === 0) {
      setStaticComponent(undefined)
      return
    }

    if (arrayLength === 1) return setvariableHeading(returnSubHeading(size, variableHeadingsArray[0]))
    setvariableArray(variableHeadingsArray as [])
    setIsPlural(true)
  }, [variableHeadingsArray, size, arrayLength])


  return (
    <>
      <div className="flex flex-wrap gap-x-2 mt-1 items-start ">
        <div className='text-base-content/60 font-medium'>
          {staticComponent}
        </div>

        <div className='flex flex-wrap gap-x-2 font-semibold text-secondary/70 '>
          {isPlural ? (
            variableArray?.map((item, index) => {
              const title = item
              const id = uuidv4();
              const placeComma = index < arrayLength - 1 ? ',' : ''
              const string = `${title}${placeComma} `
              return (
                <div key={id}>
                  {returnSubHeading(size, string)}
                </div>
              )
            }))
            : (<>{variableHeading}</>)
          }
        </div>
      </div>
    </>
  )
}

export default TwoToneSubHeading


export const returnSubHeading = (size: string, title: string): JSX.Element => {
  let variableComponent;
  switch (size) {
    case '14px':
      variableComponent = <SubHeading14px text={title} />
      break;
    case '16px':
      variableComponent = <SubHeading16px text={title} />
      break;
    default:
      variableComponent = <SubHeading12px text={title} />
      break;
  }
  return variableComponent
}