import React, { useEffect, useRef, useState } from "react";
import * as MUI from "../css/priceStyle";

import { useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  PACKAGE_TYPE,
  paymentState,
  setActivePaymentId,
  setActivePaymentType,
  setCalculatePrice,
} from "../../../redux/slices/paymentSlice";
import DialogPricingCondition from "../components/DialogPricingCondition";
import PricingPlans from "./components/PricingPlans";
import PricingPlansTable from "./components/PricingPlansTable";
import useFilter from "./hooks/useFilter";
import useManagePackages from "./hooks/useManagePackages";

function Index() {
  const filter = useFilter();
  const { packageType } = useSelector(paymentState);
  const packages = useManagePackages({ filter: packageType });
  const isMobile = useMediaQuery("(max-width:600px)");
  const memorizedPackages = useRef({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [packageId, setPackageId] = useState("");
  const [isDialogTermsAndConditionsOpen, setIsDialogTermsAndConditionsOpen] =
    useState(false);
  const packageData =
    packageType === PACKAGE_TYPE.annual
      ? memorizedPackages.current.filteredAnnualData || packages.annualData
      : memorizedPackages.current.filteredMonthlyData || packages.monthlyData;
  useEffect(() => {
    memorizedPackages.current = packages;
  }, [packages]);

  return (
    <React.Fragment>
      <MUI.PaperGlobal sx={{ margin: isMobile ? "2rem 0" : "2rem" }}>
        <PricingPlans
          data={packageData}
          onDialogTermsAndConditionsOpen={(id, data) => {
            setPackageId(id);
            dispatch(setActivePaymentType(data._type));
            dispatch(setActivePaymentId(data._id));
            dispatch(setCalculatePrice());
            navigate(`checkout/${id}`);
            /* setIsDialogTermsAndConditionsOpen(true); */
          }}
        />
        <PricingPlansTable
          data={packageData}
          onDialogTermsAndConditionsOpen={(id, data) => {
            setPackageId(id);
            dispatch(setActivePaymentType(data._type));
            dispatch(setActivePaymentId(data._id));
            dispatch(setCalculatePrice());
            navigate(`checkout/${id}`);
            /* setIsDialogTermsAndConditionsOpen(true); */
          }}
        />
      </MUI.PaperGlobal>
      <DialogPricingCondition
        isOpen={isDialogTermsAndConditionsOpen}
        onConfirm={() => navigate(`checkout/${packageId}`)}
        onClose={() => setIsDialogTermsAndConditionsOpen(false)}
      />
    </React.Fragment>
  );
}

export default Index;
