import { useSnackbar as useSnackbarNotistack } from "notistack";
import { useCallback } from "react";

export default function useSnackbar() {
  const { enqueueSnackbar } = useSnackbarNotistack();

  const enqueueMessage = useCallback(
    (message, variant = "info", action) => {
      let finalMessage = "";

      if (message) {
        if (typeof message === "string") {
          finalMessage = message;
        } else if (typeof message.message === "string") {
          finalMessage = message.message;
        } else if (
          message.message &&
          typeof message.message.detail === "string"
        ) {
          finalMessage = message.message.detail;
        }
      }

      if (!finalMessage && variant === "error") {
        finalMessage = "Sorry, there was an error.";
      }

      if (!finalMessage && variant !== "error") {
        return;
      }

      enqueueSnackbar(finalMessage, {
        variant,
        action,
      });
    },
    [enqueueSnackbar]
  );

  return enqueueMessage;
}
