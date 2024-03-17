import { EditIcon } from '~/components/utilities/icons';
//!formerly LabelCardHeader



interface LabelCardHeaderProps {
  text: string;
  htmlFor: string;
  // onClickFunction: () => void;
  textSizeTailwindClasses?: string;
  textColor?: string;
  labelHoverColor?: string;
}

function CardHeader({htmlFor, 
  // onClickFunction,
   text,
  textSizeTailwindClasses='text-xs',
  textColor='text-primary-300',
  labelHoverColor='text-primary-100'
}: LabelCardHeaderProps) {
  return (
    <>
      <label
        htmlFor={htmlFor}
        className={`
            ${textColor} 
            font-bold font-mont
            ${textSizeTailwindClasses}
            cursor-pointer 
            uppercase      
            hover:${labelHoverColor}
            hover:scale-105
            transition-all duration-300 ease-linear 
            `}
        onClick={()=>{}}
        // onClick={onClickFunction}
      >
        <div className=' flex gap-2 items-center'>
         {text}
          {EditIcon}
        </div>
      </label>
    </>
  )
}

export default CardHeader