import { useState, useEffect } from "react";
import TheDatePicker from "react-datepicker";
import InputLabel from "../forms/InputLabel";

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
    <div className="
      rounded-none 
      flex items-center  justify-start gap-x-4
      max-w-max
       ">

      <InputLabel text={labelText} />
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
  );
};

export default DatePicker;
