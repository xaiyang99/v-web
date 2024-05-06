import * as MUI from "../../css/priceStyle";

// material ui components and icons
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { Chip, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import NormalButton from "../../../../components/NormalButton";
import {
  ConvertBytetoMBandGB,
  prettyNumberFormat,
  safeGetProperty,
} from "../../../../functions";
import useAuth from "../../../../hooks/useAuth";
import {
  PACKAGE_TYPE,
  paymentState,
} from "../../../../redux/slices/paymentSlice";

function PriceCard(props) {
  const theme = useTheme();
  const { user } = useAuth();
  const { activePackageType, activePackageData, ...paymentSelector } =
    useSelector(paymentState);
  const currentPackagePrice =
    (activePackageType === PACKAGE_TYPE.annual
      ? activePackageData.annualPrice
      : activePackageData.monthlyPrice) || 0;
  const isCost = props._price > 0;
  const userPackage = safeGetProperty(user, "packageId");
  const userPackagePrice =
    (activePackageType === PACKAGE_TYPE.annual
      ? userPackage.annualPrice
      : userPackage.monthlyPrice) || 0;
  const packageName = props?.name?.toLowerCase();
  const { onClick: buttonPropsOnClick, ...buttonProps } =
    props?.buttonProps || {};
  const isUserFreePackage = userPackage.name?.toLowerCase() === "free";
  const features = useMemo(
    () => [
      {
        title: "Storage:",
        context: `${ConvertBytetoMBandGB(props.storage)}`,
      },
      {
        title: "Uploads:",
        context: `${props.uploadPerDay} uploads`,
      },
      {
        title: "Uploads per day:",
        context: `${props.multipleUpload} uploads per day`,
      },
      /* {
        title: "Downloads:",
        context: `${props.downLoadPerDay} downloads per day`,
      }, */
      {
        title: "Max Download Size:",
        context: `${prettyNumberFormat(ConvertBytetoMBandGB(props.maxUploadSize))}`,
      },
    ],
    [props],
  );

  return (
    <MUI.BoxShowPriceCard
      sx={{
        ...(userPackage._id === props._id && {
          borderColor: theme.palette.primaryTheme.main,
        }),
      }}
    >
      {props.name?.toLowerCase() === "pro" && (
        <MUI.BoxShowChip
          sx={{
            position: "absolute",
            top: 0,
            mt: 6,
            mr: 15,
          }}
        >
          <Chip
            label="Popular"
            sx={{ color: "#17766B", background: "#DAE9E7", fontWeight: "700" }}
          />
        </MUI.BoxShowChip>
      )}

      <MUI.BoxShowPriceIcon>
        <img
          src="https://cdn-icons-png.flaticon.com/512/5893/5893015.png"
          alt="currentPackagePrice icon"
        />
      </MUI.BoxShowPriceIcon>
      <Typography variant="h3">{props.name}</Typography>
      <Typography variant="h6">A simple start for everyone</Typography>
      <Typography
        variant="h6"
        sx={{
          position: "relative",
          p: 5,
        }}
      >
        <strong
          style={{ fontSize: "3rem", color: "#17766B", position: "relative" }}
        >
          <Typography
            component="span"
            className="currency"
            sx={{
              fontWeight: 600,
              position: "absolute",
              top: "40%",
              left: 0,
              transform: "translate(-10px, -50%)",
            }}
          >
            {isCost && paymentSelector.currencySymbol}
          </Typography>
          {isCost ? props._price?.toLocaleString() : "Free"}
        </strong>
        {isCost && (
          <>
            {paymentSelector.packageType === PACKAGE_TYPE.annual
              ? "/year"
              : "/month"}
          </>
        )}
      </Typography>
      <MUI.BoxShowFeatureList>
        {features.map((feature, index) => {
          return (
            <Typography
              component="div"
              key={index}
              sx={{
                display: "flex",
                justifyContent: "start",
                margin: "0.5rem 0",
                fontSize: "0.95rem",
              }}
            >
              <Typography
                component="span"
                sx={{
                  lineHeight: 1,
                  pt: 1,
                  pr: 1,
                }}
              >
                <CircleOutlinedIcon
                  sx={{ fontSize: "0.8rem" }}
                  className="circle"
                />
              </Typography>
              <Typography
                variant="6"
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  lineHeight: "1.25rem",
                  marginLeft: "5px",
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: "inherit",
                    marginRight: 1,
                  }}
                >
                  {feature.title} {feature.context}
                </Typography>
              </Typography>
            </Typography>
          );
        })}
      </MUI.BoxShowFeatureList>
      {userPackage._id === props._id && (
        <NormalButton
          sx={{
            color: "rgba(40, 199, 111)",
            marginTop: 3,
            height: "35px",
            borderRadius: 1,
            backgroundColor: "rgba(40, 199, 111, 0.16)",
            textAlign: "center",
            display: "block",
            cursor: "default",
          }}
          fullWidth
        >
          Your current plan
        </NormalButton>
      )}
      {userPackage._id !== props._id &&
        activePackageData._id === props._id &&
        activePackageType === props._type && (
          <NormalButton
            sx={{
              color: "rgba(40, 199, 111)",
              marginTop: 3,
              height: "35px",
              borderRadius: 1,
              backgroundColor: "rgba(40, 199, 111, 0.16)",
              textAlign: "center",
              display: "block",
              cursor: "default",
            }}
            fullWidth
          >
            Your selected plan
          </NormalButton>
        )}
      {userPackage._id !== props._id &&
        (activePackageData._id !== props._id ||
          (activePackageData._id === props._id &&
            activePackageType !== props._type)) && (
          <NormalButton
            {...{
              ...(isCost
                ? {
                    onClick: buttonPropsOnClick,
                    ...buttonProps,
                  }
                : {
                    ...buttonProps,
                    disabled: true,
                  }),
            }}
            sx={{
              marginTop: 3,
              height: "35px",
              borderRadius: 1,
              backgroundColor: "#DAE9E7",
              textAlign: "center",
              display: "block",
              color: "#17766B",
              ...(isCost
                ? {
                    "&:hover": {
                      backgroundColor: (theme) =>
                        theme.palette.primaryTheme.main,
                      color: "white !important",
                    },
                  }
                : {
                    cursor: "default",
                  }),
            }}
            fullWidth
          >
            {isCost ? "Upgrade" : "Free"}
          </NormalButton>
        )}
    </MUI.BoxShowPriceCard>
  );
}

export default PriceCard;
