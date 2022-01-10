import { useEffect, useState } from "react";

const TIME_INTERVAL = 2000;

function useCopyToClipboard() {
  const [isCopied, setCopied] = useState(false);

  useEffect(() => {
    let timeout;
    if (isCopied) {
      timeout = setTimeout(() => setCopied(false), TIME_INTERVAL);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isCopied]);

  const handleCopy = async (value) => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
  };

  return [isCopied, handleCopy];
}

export default useCopyToClipboard;
