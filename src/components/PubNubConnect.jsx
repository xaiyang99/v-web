import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";

const pubnub = new PubNub({
  uuid: "BCELBANK",
  subscribeKey: "sub-c-91489692-fa26-11e9-be22-ea7c5aada356",
  ssl: true,
});

const PubNubConnect = ({ children }) => {
  return <PubNubProvider client={pubnub}>{children}</PubNubProvider>;
};

export default PubNubConnect;
