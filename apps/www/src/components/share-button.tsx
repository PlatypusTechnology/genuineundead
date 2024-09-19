"use client";

import * as React from "react";
import { Check, Share } from "lucide-react";
import { Button } from "@genuineundead/ui/components/button";

interface ShareButtonProps {
  buttonProps?: React.ComponentProps<typeof Button>;
  iconProps?: React.ComponentProps<typeof Share>;
}

export function ShareButton({ buttonProps, iconProps }: ShareButtonProps) {
  const [isCopied, setIsCopied] = React.useState(false);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCopied) {
      timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000); // Reset the state after 2 seconds
    }
    return () => clearTimeout(timer); // Clear the timer when the component is unmounted
  }, [isCopied]);

  const handleShareClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleShareClick}
      {...buttonProps}
    >
      {isCopied ? (
        <Check className="mr-1.5 h-4 w-4" {...iconProps} />
      ) : (
        <Share className="mr-1.5 h-4 w-4" {...iconProps} />
      )}

      {isCopied ? "Copied" : "Share"}
    </Button>
  );
}
