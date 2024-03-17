import { useState, useEffect } from "react";
import TheDatePicker from "react-datepicker";

import InputLabel from "./InputLabel";
import { DueDates } from "../../utilities/Guidelines";
import InputLabelWithGuideLineLink from "./InputLabelWithGuideLineLink";

interface DatePickerProps {
  setSelectedDate: (date: Date | null) => void;
  selectedDate: Date | null;
  labelText?: string;
  isHorizontal?: boolean;
  isSecondaryInput?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ setSelectedDate, selectedDate, labelText = 'Due Date', isHorizontal = false, isSecondaryInput = false }) => {

  const [displayDate, setDisplayDate] = useState<Date | null>(selectedDate);
  const [isHorizontalLayout, setIsHorizontalLayout] = useState<boolean>(false)

  const parentDivCss = isHorizontalLayout ? 'flex flex-wrap items-center gap-x-4  ' : ' '


  useEffect(() => {
    isHorizontal && setIsHorizontalLayout(true)
  }, [isHorizontal])

  useEffect(() => {
    setDisplayDate(selectedDate)
  }, [selectedDate])


  const handleSelectedDateChange = (date: Date | null) => {
    setDisplayDate(date);
    setSelectedDate(date);
  };


  return (
    <>

      <div className={`w-full  ${parentDivCss}`}>
        {isHorizontalLayout ? (
          <>
            {labelText && (
              <InputLabel inputTitle={labelText} isSecondaryInput={isSecondaryInput}
              />
            )}
          </>
        ) : (
          <div className='pb-0'>
            <InputLabelWithGuideLineLink
              guideLineTitle={labelText}
              inputTitle={labelText}
              guideline={DueDates}
              isSecondaryInput={isSecondaryInput}
            />
          </div>
        )}

        <TheDatePicker
          isClearable={true}
          showIcon={false}
          className='
          p-2 pl-4 
          min-h-8
          font-poppins font-normal tracking-wide
          border-base-300 bg-base-200
          text-blue placeholder:text-neutral-400
          '
          selected={displayDate}
          onChange={handleSelectedDateChange}
          placeholderText={'Click to select a date.'}
          dateFormat="MMMM do, yyyy"
        />

      </div>
    </>
  );
};

export default DatePicker;
