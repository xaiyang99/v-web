import { Fragment } from "react";
import {
  ColorPickerCircle,
  ColorPickerContainer,
  ColorPickerWrapper,
  HeaderColorPicker,
  HueKey,
  HuePickerContent,
  HuePickerHeaderColor,
  HuePickerListContainer,
  HuePickerStyled,
  HueValue,
  HueValueContainer,
} from "../css/packageStyle";
import { Typography } from "@mui/material";
import { SketchPicker } from "react-color";

const PackageColorPicker = (props) => {
  const { textColors, bgColors } = props;

  const convertMathFloor = (val) => {
    return Math.floor(val * 100);
  };

  const convertedObject = (val) => {
    const h = Math.floor(parseInt(val.h || 0));
    const s = convertMathFloor(val.s);
    const l = convertMathFloor(val.l);

    return `${h}, ${s}, ${l}`;
  };

  return (
    <Fragment>
      <ColorPickerWrapper>
        <HeaderColorPicker>
          <ColorPickerCircle
            style={{
              backgroundColor: textColors.hex,
            }}
            mr={5}
          />
          <Typography variant="h4">
            Hex <strong>{bgColors.hex}</strong> RGB{" "}
            <strong>
              {bgColors.rgb.r}, {bgColors.rgb.g}, {bgColors.rgb.b}
            </strong>{" "}
            HSL <strong>{convertedObject(bgColors.hsl)}</strong>
          </Typography>
        </HeaderColorPicker>

        <ColorPickerContainer>
          <SketchPicker
            className="customPicker"
            color={textColors}
            onChange={(e) => setTextColors(e)}
            sx={{
              boxShadow: "none",
              width: "100%",
            }}
          />

          <HuePickerStyled
            className="huePicker"
            direction="vertical"
            color={textColors.hex}
            onChange={(e) => setTextColors(e)}
            sx={{ ml: 2 }}
          />

          <HuePickerListContainer>
            <HuePickerHeaderColor
              sx={{
                backgroundColor: textColors.hex,
              }}
            />

            <HuePickerContent>
              <HueValueContainer sx={{ mb: 3 }}>
                <HueKey>#</HueKey>
                <HueValue>{textColors.hex?.substring(1)}</HueValue>
              </HueValueContainer>

              <HueValueContainer>
                <HueKey>R</HueKey>
                <HueValue>{textColors.rgb.r}</HueValue>
              </HueValueContainer>
              <HueValueContainer>
                <HueKey>G</HueKey>
                <HueValue>{textColors.rgb.g}</HueValue>
              </HueValueContainer>
              <HueValueContainer>
                <HueKey>B</HueKey>
                <HueValue>{textColors.rgb.b}</HueValue>
              </HueValueContainer>

              <HueValueContainer sx={{ mt: 4 }}>
                <HueKey>H</HueKey>
                <HueValue>
                  {Math.floor(parseInt(textColors.hsl.h || 0))}
                </HueValue>
              </HueValueContainer>
              <HueValueContainer>
                <HueKey>S</HueKey>
                <HueValue>{convertMathFloor(textColors.hsl.s)}</HueValue>
              </HueValueContainer>
              <HueValueContainer>
                <HueKey>L</HueKey>
                <HueValue>{convertMathFloor(textColors.hsl.l)}</HueValue>
              </HueValueContainer>
            </HuePickerContent>
          </HuePickerListContainer>
        </ColorPickerContainer>
      </ColorPickerWrapper>
    </Fragment>
  );
};

export default PackageColorPicker;
