import { useState, useEffect } from "react";
import TheDatePicker from "react-datepicker";
import { DueDates } from "../utilities/Guidelines";
import InputLabelWithGuideLineLink from "../forms/InputLabelWithGuideLineLink";

interface DatePickerProps {
  setSelectedDate: (date: Date | null) => void;
  selectedDate: Date | null;
  labelText?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ setSelectedDate, selectedDate, labelText = 'Due Date' }) => {
  const [startDate, setStartDate] = useState<Date | null>(selectedDate);

  useEffect(() => {
    setStartDate(selectedDate)
  }, [selectedDate])

  const handleSelectedDateChange = (date: Date | null) => {
    setStartDate(date);
    setSelectedDate(date);
  };

  return (
    <>
      <div className="w-full ">
        <InputLabelWithGuideLineLink
          text={labelText}
          title='Due Dates'
          guideline={DueDates}
        />
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
