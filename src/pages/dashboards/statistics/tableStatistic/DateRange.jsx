import React from "react";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import "./customDateRangePicker.css";

function DateRange(props) {
  const customLocale = {
    ok: "Save",
  };
  const customRanges = [
    {
      label: "Last 7 Days",
      value: [
        new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        new Date(),
      ],
    },
    {
      label: "Last 30 Days",
      value: [
        new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
        new Date(),
      ],
    },
  ];
  return (
    <div>
      <DateRangePicker
        locale={customLocale}
        ranges={customRanges}
        size="sm"
        onChange={props?.onChange}
      />
    </div>
  );
}

export default DateRange;
