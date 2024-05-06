import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useDispatch } from "react-redux";
import { setRadio } from "../redux/slices/textEditorSlice";

const TextRadio = (props) => {
  const dispatch = useDispatch();

  const handleChange = (event) => {
    dispatch(setRadio(event.target.value));
  };
  const initialValue = props.radioProps.defaultValue.value
    ? props.radioProps.defaultValue.value
    : "";

  return (
    <RadioGroup
      row
      aria-labelledby="demo-form-control-label-placement"
      name="position"
      defaultValue={initialValue}
      onChange={(e) => handleChange(e)}
    >
      {props.radioProps.options?.map((radio, index) => {
        return (
          <FormControlLabel
            key={index}
            value={radio.value}
            control={<Radio />}
            label={radio.label ? radio.label : "radio"}
            labelPlacement={props.labelPlacement ? props.labelPlacement : "end"}
          />
        );
      })}
    </RadioGroup>
  );
};
export default TextRadio;
