import { useLazyQuery } from "@apollo/client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import DialogPaymentPackage from "../client-components/dialogs/DialogPaymentPackage";
import useAuth from "../hooks/useAuth";
import { PACKAGE_TYPE, paymentState } from "../redux/slices/paymentSlice";
import { QUERY_PAYMENTS } from "./apollo/Payment";

export const PackageCheckerContext = createContext({});

const PackageCheckerProvider = ({ children }) => {
  const { user } = useAuth();
  const paymentSelector = useSelector(paymentState);
  const userPackage = user?.packageId;
  const activePackage = paymentSelector.activePackageData;
  const [canAccess, setCanAccess] = useState("initial");
  const [status, setStatus] = useState("initial");
  const [getPayments, { data: paymentData }] = useLazyQuery(QUERY_PAYMENTS);
  const [isDialogPaymentPackageOpen, setIsDialogPaymentPackageOpen] =
    useState(false);

  const onHandleDialogPaymentPackageClose = () => {
    setIsDialogPaymentPackageOpen(false);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    if (!pathname.includes("pricing")) {
      if (user?._id) {
        getPayments({
          variables: {
            where: {
              payerId: user._id,
            },
          },
        });
      }
    }
  }, [user, pathname]);

  useEffect(() => {
    const payments = paymentData?.getPayments?.data;
    if (payments) {
      const dateList = payments.map((data) => data.expired);
      const latestDate = new Date(Math.max(...dateList));
      latestDate.setSeconds(latestDate.getSeconds() - 3);
      const currentTime = new Date();
      const msTimeOut = latestDate.getTime() - currentTime.getTime();
      const timer = setTimeout(() => {
        setIsDialogPaymentPackageOpen(true);
      }, msTimeOut);
      return () => clearTimeout(timer);
    }
  }, [paymentData]);

  useEffect(() => {
    const checkingPackage = new Promise((res) => {
      if (userPackage && activePackage) {
        /* const userPackagePrice =
          paymentSelector.packageType === PACKAGE_TYPE.annual
            ? userPackage.annualPrice
            : userPackage.monthlyPrice; */

        const activePackagePrice =
          paymentSelector.packageType === PACKAGE_TYPE.annual
            ? activePackage.annualPrice
            : activePackage.monthlyPrice;

        if (pathname.includes("pricing/checkout")) {
          if (paymentSelector.paymentStatus === null) {
            res("allowed");
            /* if (activePackagePrice) {
              res("allowed");
            }
            if (!activePackagePrice) {
              res("disallowed");
            } */
          }
        }
      }
    });
    checkingPackage
      .then((data) => {
        setCanAccess(data);
      })
      .catch((data) => {
        setCanAccess(data);
      });
  }, [pathname, userPackage, activePackage]);

  useEffect(() => {
    setStatus(canAccess);
  }, [canAccess]);

  return (
    <PackageCheckerContext.Provider value={{ status, setCanAccess }}>
      {children}
      <DialogPaymentPackage
        isOpen={isDialogPaymentPackageOpen}
        onClose={onHandleDialogPaymentPackageClose}
        onConfirm={() => {
          setIsDialogPaymentPackageOpen(false);
          navigate("pricing");
        }}
      />
    </PackageCheckerContext.Provider>
  );
};

export const PackageChecker = ({ children }) => {
  const { status, setCanAccess } = useContext(PackageCheckerContext);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      setCanAccess("initial");
    };
  }, []);

  if (status === "initial") {
    return null;
  }

  if (status === "allowed") {
    return children;
  }

  if (status === "disallowed") {
    navigate("/pricing", { replace: true });
    return null;
  }
};

export default PackageCheckerProvider;
