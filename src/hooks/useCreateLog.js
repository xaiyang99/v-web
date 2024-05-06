import { useState } from "react";

import { useMutation } from "@apollo/client";
import { CREATE_LOG } from "../contexts/apollo/Login";

const useCreateLog = async () => {
  const [createLog] = useMutation(CREATE_LOG);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async (id, name, refreshId, formattedResult) => {
    setIsCreating(true);
    setError(null);

    try {
      await createLog({
        variables: {
          input: {
            createdBy: parseInt(id),
            name: name,
            refreshID: refreshId,
            description: formattedResult,
          },
        },
      });
    } catch (error) {
      setError("refresh token failed");
    } finally {
      setIsCreating(false);
    }
  };

  return { handleCreate, isCreating, error };
};

export { useCreateLog };
