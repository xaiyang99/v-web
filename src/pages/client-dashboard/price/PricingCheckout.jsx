import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// material ui icon and component
import { Box, Divider, useMediaQuery } from "@mui/material";
import Steps from "../components/Steps";
import * as Icons from "./icons";

// componento
import * as MUI from "../css/pricingCheckoutStyle";

// graphql
import { useLazyQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import { PackageChecker } from "../../../contexts/PackageCheckerContext";
import { decryptId } from "../../../functions";
import useFirstRender from "../../../hooks/useFirstRender";
import {
  PACKAGE_TYPE,
  PAYMENT_METHOD,
  paymentState,
  resetPayment,
  setActivePaymentId,
  setActivePaymentMethod,
  setActiveStep,
  setAddressData,
  setCalculatePrice,
  setPackageData,
  setPaymentId,
  setShowBcel,
  setShowStrip,
} from "../../../redux/slices/paymentSlice";
import Address from "./components/sections/Address";
import Cart from "./components/sections/Cart";
import Confirmation from "./components/sections/Confirmation";
import Payment from "./components/sections/Payment";
import useFilter from "./hooks/useFilter";
import useManagePackages from "./hooks/useManagePackages";
import "./steps-animation.css";

import { QUERY_SETTING } from "../../dashboards/settings/apollo";

const { REACT_APP_ENCRYPTION_KEY } = process.env;

function Index() {
  const isMobile = useMediaQuery("(max-width:950px)");
  const params = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const status = searchParams.get("status");

  const packageId = decryptId(params.packageId, REACT_APP_ENCRYPTION_KEY);
  const dispatch = useDispatch();
  const { activeStep, paymentSteps, packageType, ...paymentSelector } =
    useSelector(paymentState);
  const filter = useFilter();
  const packages = useManagePackages({ filter: filter.data });
  const memorizedPackages = useRef({});
  const isFirstRender = useFirstRender();
  const navigate = useNavigate();
  const [toggle, setToggle] = React.useState(null);
  const { paymentStatus, isPayment } = paymentSelector;
  const [getSetting] = useLazyQuery(QUERY_SETTING, {
    fetchPolicy: "no-cache",
  });

  const packageData =
    packageType === PACKAGE_TYPE.annual
      ? memorizedPackages.current.filteredAnnualData || packages.annualData
      : memorizedPackages.current.filteredMonthlyData || packages.monthlyData;

  const settingKeys = {
    Strip: "SRIPETE",
    Bcel: "CELBENE",
  };

  useEffect(() => {
    memorizedPackages.current = packages;
  }, [packages]);

  const [dataForEvents, setDataForEvents] = React.useState({
    action: null,
    type: null,
    data: {},
  });

  useEffect(() => {
    if (id) {
      dispatch(setPaymentId({ id: id, status: status }));
    }
  }, [id]);

  useEffect(() => {
    async function fetchPaymentSetting() {
      try {
        const result = await getSetting({
          variables: {
            where: {
              groupName: "payment_setting",
            },
          },
        });

        if (result.data?.general_settings?.data) {
          const settings = result.data?.general_settings?.data;
          let dataBcel = null;
          let dataStrip = null;
          dispatch(setActivePaymentMethod(""));

          dataBcel = settings?.find((el) => el.productKey === settingKeys.Bcel);
          if (dataBcel) {
            if (dataBcel?.status === "on") {
              dispatch(setShowBcel(true));
              dispatch(setActivePaymentMethod(PAYMENT_METHOD.bcelOne));
            } else {
              dispatch(setShowBcel(false));
            }
          }

          dataStrip = settings?.find(
            (el) => el.productKey === settingKeys.Strip,
          );
          if (dataStrip) {
            if (dataStrip?.status === "on") {
              dispatch(setShowStrip(true));
              if (dataBcel?.status === "on") {
                dispatch(setActivePaymentMethod(PAYMENT_METHOD.bcelOne));
              } else {
                dispatch(setActivePaymentMethod(PAYMENT_METHOD.stripe));
              }
            } else {
              dispatch(setShowStrip(false));
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchPaymentSetting();
  }, []);

  useEffect(() => {
    if (packages.data) {
      dispatch(setPackageData(packages.data));
    }
  }, [packages.data, dispatch]);

  useEffect(() => {
    if (packageId) {
      dispatch(setActivePaymentId(packageId));
    }
  }, [packageId, dispatch]);

  useEffect(() => {
    if (paymentSelector.packageData && paymentSelector.activePackageId) {
      dispatch(setCalculatePrice());
    }
  }, [paymentSelector.packageData, paymentSelector.activePackageId]);

  React.useEffect(() => {
    const localStorageToggled = localStorage.getItem("toggle");
    if (localStorageToggled) {
      setToggle(localStorageToggled === "list" ? "list" : "grid");
    }
  }, []);

  useEffect(() => {
    if (dataForEvents.action && dataForEvents.data) {
      menuOnClick(dataForEvents.action);
    }
  }, [dataForEvents.action]);

  const menuOnClick = async () => {};

  const duration = 500;

  const PricingProcesses = () => {
    let step = null;
    switch (activeStep) {
      case 0:
        step = (
          <Cart
            onSubmit={() => {
              dispatch(setActiveStep(1));
            }}
            packageData={packageData}
          />
        );
        break;
      case 1:
        step = (
          <Address
            onSubmit={(values) => {
              dispatch(setAddressData(values));
              dispatch(setActiveStep(2));
            }}
          />
        );
        break;
      case 2:
        step = (
          <Payment
            onSubmit={(values) => {
              dispatch(setAddressData(values));
              dispatch(setActiveStep(2));
            }}
          />
        );
        break;
      case 3:
        step = (
          <>
            <Confirmation
              onSubmit={(values) => {
                dispatch(setAddressData(values));
                dispatch(setActiveStep(3));
              }}
            />
          </>
        );
        break;
      default:
        step = null;
    }
    return (
      <TransitionGroup
        style={{
          position: "relative",
        }}
      >
        <CSSTransition key={activeStep} classNames="fade" timeout={duration}>
          <div
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            >
              {step}
            </div>
          </div>
        </CSSTransition>
      </TransitionGroup>
    );
  };

  useEffect(() => {
    return () => {
      dispatch(resetPayment());
    };
  }, [dispatch]);

  if (isFirstRender) {
    return null;
  }

  if (!packageId) {
    navigate("/pricing");
    return null;
  }

  return (
    <PackageChecker>
      <React.Fragment>
        {/* <MUI.ExtendContainer> */}
        <MUI.TitleAndSwitch className="title-n-switch">
          <BreadcrumbNavigate
            titlePath="/pricing"
            title="Pricing"
            readablePath={["Pricing", "Checkout"]}
            path={["pricing"]}
          />
        </MUI.TitleAndSwitch>
        {!paymentSelector.isPaymentLoading && (
          <MUI.PricingCheckoutContainer>
            <MUI.PricingCheckoutHeader>
              <Box
                sx={{
                  width: "100%",
                  minHeight: "180px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...(isMobile && {
                    padding: 5,
                    justifyContent: "flex-start",
                  }),
                }}
              >
                <Steps
                  handleStep={(step) => dispatch(setActiveStep(step))}
                  activeStepState={[activeStep, setActiveStep]}
                  stepperProps={{
                    connector: (
                      <>
                        {!isMobile && (
                          <Icons.ChevronRightIcon
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "calc(-35% + 20px)",
                              right: "calc(35% + 20px)",
                              transform: "translateY(-60%)",
                            }}
                          />
                        )}
                      </>
                    ),
                    steps: ["Cart", "Address", "Payment", "Confirmation"],
                    isCompletedSteps: [
                      paymentSteps[0],
                      paymentSteps[1],
                      paymentSteps[2],
                      paymentSteps[3],
                    ],
                    icons: {
                      1: <Icons.CartIcon />,
                      2: <Icons.AddressIcon />,
                      3: <Icons.PaymentIcon />,
                      4: <Icons.ConfirmationIcon />,
                    },
                  }}
                  stepProps={{
                    sx: {
                      width: "200px",
                    },
                  }}
                />
              </Box>
            </MUI.PricingCheckoutHeader>
            <Divider
              sx={{
                color: "black",
              }}
            />
            <MUI.PricingCheckoutBody
              sx={{
                minHeight:
                  paymentSelector.paymentStatus === "processing"
                    ? "1300px"
                    : "700px",
                ...(isMobile && {
                  minHeight:
                    paymentSelector.paymentStatus === "processing"
                      ? "1800px"
                      : "950px",
                }),
              }}
            >
              {PricingProcesses()}
            </MUI.PricingCheckoutBody>
          </MUI.PricingCheckoutContainer>
        )}
      </React.Fragment>
    </PackageChecker>
  );
}

export default Index;
