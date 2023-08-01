import { useState, useEffect } from "react";
import TheDatePicker from "react-datepicker";
import InputLabel from "../forms/InputLabel";
// import MyDatepicker from "../MyDatePicker.client";

interface DatePickerProps {
  setSelectedDate: (date: Date | null) => void;
  selectedDate: Date | null;
}

const DatePicker: React.FC<DatePickerProps> = ({ setSelectedDate, selectedDate }) => {
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
      rounded-lg flex items-center flex-wrap gap-4
      w-full max-h-6 
      mt-0 
       ">

     
      <InputLabel text='Due Date' />
      <TheDatePicker
        isClearable={true}
        className='
              p-2 pl-4 min-h-8
              text-blue
              placeholder:text-neutral-400
              font-poppins font-normal tracking-wide
              bg-base-200
              '
        selected={startDate}
        onChange={handleSelectedDateChange}
        placeholderText="Click to select a date "
        dateFormat="MMMM do, yyyy"
      />
     
    </div>
  );
};

export default DatePicker;
