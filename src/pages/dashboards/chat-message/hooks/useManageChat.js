import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { QUERY_CHAT_MESSAGE } from "../apollo";

const useManageChat = (props) => {
  const { typeTicketID } = props;
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [reloading, setReloading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  const [getChatTicket] = useLazyQuery(QUERY_CHAT_MESSAGE, {
    fetchPolicy: "no-cache",
  });

  const handleReloading = () => setReloading(!reloading);

  const handleLimit = (val) => {
    setLimit((prev) => prev + val);
  };

  const customChatMessage = async () => {
    try {
      setReloading(true);
      const res = await getChatTicket({
        variables: {
          where: {
            typeTicketID: parseInt(typeTicketID),
          },
          limit,
          orderBy: "_id_DESC",
          // orderBy: "_id_ASC",
        },
      });
      if (res.data?.tickets?.data) {
        setChatMessages(res.data?.tickets?.data);
        setTotal(res.data?.tickets?.total);
      }
      setReloading(false);
    } catch (error) {
      if (cutErr === "LOGIN_IS_REQUIRED") {
        errorMessage("Please login first!", 3000);
      } else {
        errorMessage("Something went wrong, Please try again", 3000);
      }
      setReloading(false);
    }
  };

  useEffect(() => {
    customChatMessage();
  }, [typeTicketID, limit]);

  return {
    reloading,
    limit,
    data: chatMessages?.map((value, index) => {
      return {
        ...value,
        index: index + 1,
      };
    }),
    total,

    customChatMessage,
    getChatTicket,
    handleReloading,
    handleLimit,
  };
};

export default useManageChat;
