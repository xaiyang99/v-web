import { StepLabel, useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Step from "@mui/material/Step";
import { stepLabelClasses } from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { styled as muiStyled } from "@mui/system";
import * as React from "react";
import NormalButton from "../../../components/NormalButton";

// const CustomStepIconRoot = muiStyled("div")(({ theme, ownerState }) => ({
const CustomStepIconRoot = muiStyled("div")({
  zIndex: 1,
  color: "#fff",
  width: 100,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
});

function CustomStepIcon(props) {
  const isMobile = useMediaQuery("(max-width:900px)");
  const { active, completed, className } = props;
  const theme = useTheme();
  return (
    <CustomStepIconRoot
      {...props}
      sx={{
        ...props.sx,
        ...(isMobile && {
          justifyContent: "flex-start",
        }),
      }}
      ownerState={{ completed, active }}
      className={className}
    >
      {React.cloneElement(props.icons[String(props.icon)], {
        style: {
          ...((completed || active) && {
            color: theme.palette.primaryTheme.main,
          }),
        },
      })}
    </CustomStepIconRoot>
  );
}

const Index = (props) => {
  const { isCompletedSteps, ...stepperProps } = props.stepperProps || {};
  const isMobile = useMediaQuery("(max-width:900px)");
  const theme = useTheme();
  const [activeStep, setActiveStep] = props.activeStepState;
  const [completed, setCompleted] = React.useState({});
  const totalSteps = () => {
    return stepperProps?.steps?.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <>
      <Stepper
        {...{
          ...(isMobile && {
            orientation: "vertical",
          }),
        }}
        alternativeLabel
        activeStep={activeStep}
        {...stepperProps}
        connector={stepperProps.connector}
        sx={{
          height: "100%",
          alignItems: "center",
          ...(isMobile && {
            rowGap: 5,
            maxWidth: "600px",
          }),
        }}
      >
        {stepperProps.steps?.map((label, index) => (
          <Step
            key={label}
            completed={completed[index]}
            sx={{
              display: "flex",
              alignItems: "center",
              ...props.stepProps.sx,
            }}
          >
            <StepLabel
              color="inherit"
              componentsProps={{
                label: {
                  style: {
                    marginTop: 0,
                    height: "35px",
                  },
                },
              }}
              StepIconComponent={(stepLabelProps) => (
                <CustomStepIcon
                  {...props.stepIconProps}
                  {...{
                    ...stepLabelProps,
                    icons: stepperProps?.icons,
                  }}
                  {...(!(
                    completed[index] ||
                    activeStep === index ||
                    !isCompletedSteps[index]
                  ) && {
                    sx: {
                      cursor: "pointer",
                    },
                    onClick: () => props.handleStep(index),
                  })}
                />
              )}
              sx={{
                [`.${stepLabelClasses.completed},.${stepLabelClasses.active}`]:
                  {
                    color: `${theme.palette.primaryTheme.main} !important`,
                    ".step-button": {
                      color: `${theme.palette.primaryTheme.main} !important`,
                    },
                  },
                ...(isMobile && {
                  flexDirection: "row !important",
                }),
              }}
            >
              {!(
                completed[index] ||
                activeStep === index ||
                !isCompletedSteps[index]
              ) ? (
                <NormalButton
                  className="step-button"
                  sx={{
                    justifyContent: "center",
                    paddingTop: "16px",
                    ...(isMobile && {
                      alignItems: "center",
                      paddingTop: 0,
                    }),
                  }}
                  onClick={() => props.handleStep(index)}
                >
                  {label}
                </NormalButton>
              ) : (
                <Typography
                  component="div"
                  sx={{
                    paddingTop: "16px",
                    ...(isMobile && {
                      display: "flex",
                      height: "100%",
                      alignItems: "center",
                      paddingTop: 0,
                    }),
                    fontWeight: 600,
                  }}
                >
                  {label}
                </Typography>
              )}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {/* <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
              Step {activeStep + 1}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleNext} sx={{ mr: 1 }}>
                Next
              </Button>
              {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography
                    variant="caption"
                    sx={{ display: "inline-block" }}
                  >
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1
                      ? "Finish"
                      : "Complete Step"}
                  </Button>
                ))}
            </Box> */}
          </React.Fragment>
        )}
      </div>
    </>
  );
};

export default Index;
