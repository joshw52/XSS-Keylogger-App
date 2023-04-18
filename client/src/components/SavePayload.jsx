import React, { useState } from "react";

import { EditIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@chakra-ui/react";

const CopyPayload = ({ updatePayload }) => {
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
        <Tooltip label="Save Payload">
          <IconButton
            colorScheme="blue"
            icon={<EditIcon />}
            marginLeft="15px"
            onClick={() => {
              updatePayload();
              setOpen(true);
              delayedClosePopover();
            }}
          />
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>Payload saved!</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default CopyPayload;
