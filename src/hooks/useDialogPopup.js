import { noop } from "lodash";
import { useState } from "react";

function useDialogPopup() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [cancelActionTitle, setCancelActionTitle] = useState("Cancel");
  const [confirmActionTitle, setConfirmActionTitle] = useState("Confirm");
  const [confirmText, setConfirmText] = useState(undefined);
  const [confirmActionFunction, setConfirmActionFunction] = useState(noop);

  const handleDialogPopup = (dialogProps) => {
    console.log(dialogProps);
    setTitle(dialogProps.title);
    setContent(dialogProps.content);
    setCancelActionTitle(dialogProps.cancelActionTitle || cancelActionTitle);
    setConfirmActionTitle(dialogProps.confirmActionTitle || confirmActionTitle);
    setConfirmText(dialogProps.confirmText);
    setConfirmActionFunction(dialogProps.setConfirmActionFunction);
  };

  return {
    handleDialogPopup,
    open,
    setOpen,
    title,
    content,
    cancelActionTitle,
    confirmActionTitle,
    confirmText,
    confirmActionFunction,
  };
}

export default useDialogPopup;
