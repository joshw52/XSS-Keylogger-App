import React, { useState } from "react";

import { CopyIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@chakra-ui/react";

const CopyPayload = ({ copyPayloadToClipboard }) => {
  const [open, setOpen] = useState(false);

  const delayedClosePopover = () => {
    setTimeout(() => {
      setOpen(false);
    }, [5000]);
  };

  return (
    <Popover
      closeOnBlur={true}
      isOpen={open}
      onClose={() => setOpen(false)}
      placement="bottom"
    >
      <PopoverTrigger>
        <Tooltip label="Copy to Clipboard">
          <IconButton
            colorScheme="orange"
            icon={<CopyIcon />}
            marginLeft="15px"
            onClick={() => {
              copyPayloadToClipboard();
              setOpen(true);
              delayedClosePopover();
            }}
          />
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>Payload copied to clipboard!</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default CopyPayload;
