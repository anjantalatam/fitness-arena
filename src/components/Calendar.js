import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import DateAdapter from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

export default function Calendar({ date, setDate }) {
  const handleDatePickerChange = (newValue) => {
    setDate(newValue);
  };

  return (
    <Box my={2}>
      <LocalizationProvider dateAdapter={DateAdapter}>
        <DesktopDatePicker
          label="Date"
          inputFormat="DD/MM/yyyy"
          value={date}
          onChange={handleDatePickerChange}
          //   disabled
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </Box>
  );
}
