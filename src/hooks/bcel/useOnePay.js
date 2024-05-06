import OnePay from "./OnePay";

const useOnePay = (mcid = "mch5c2f0404102fb", mcc = "5732") => {
  const onePay = new OnePay(mcid, mcc);
  return onePay;
};

export default useOnePay;
