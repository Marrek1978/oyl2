import { useState, useEffect } from "react";
import TheDatePicker from "react-datepicker";
import { DueDates } from "../utilities/Guidelines";
import InputLabelWithGuideLineLink from "../forms/InputLabelWithGuideLineLink";
import InputLabel from "../forms/InputLabel";

interface DatePickerProps {
  setSelectedDate: (date: Date | null) => void;
  selectedDate: Date | null;
  labelText?: string;
  isHorizontal?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ setSelectedDate, selectedDate, labelText = 'Due Date', isHorizontal }) => {

  const [startDate, setStartDate] = useState<Date | null>(selectedDate);
  const [isHorizontalLayout, setIsHorizontalLayout] = useState<boolean>(false)


  useEffect(() => {
    isHorizontal && setIsHorizontalLayout(true)
  }, [isHorizontal])

  useEffect(() => {
    setStartDate(selectedDate)
  }, [selectedDate])

  const handleSelectedDateChange = (date: Date | null) => {
    setStartDate(date);
    setSelectedDate(date);
  };


  const parentDivCss = isHorizontalLayout ? 'flex flex-wrap items-center  gap-x-4  ' : ' '


  return (
    <>

      <div className={`w-full ${parentDivCss} flex  `}>

        {isHorizontalLayout ? (
          <div className=' '>
            <InputLabel inputTitle={labelText} />
          </div>
        ) : (

          <InputLabelWithGuideLineLink
            inputTitle={labelText}
            title='Due Date'
            guideline={DueDates}
          />
        )}


        <TheDatePicker
          isClearable={true}
          showIcon={false}
          className='
            p-2 pl-4 
            min-h-8
            font-poppins font-normal tracking-wide
            bg-base-200
            text-blue placeholder:text-neutral-400
            '
          selected={startDate}
          onChange={handleSelectedDateChange}
          placeholderText={'Click to select a date.'}
          dateFormat="MMMM do, yyyy"
        />
      </div>
    </>
  );
};

export default DatePicker;
