import React, { useState } from 'react';

import { CopyIcon } from '@chakra-ui/icons';
import {
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from '@chakra-ui/react';

import { delayedClosePopover } from '../helpers';

const CopyPayload = ({ copyPayloadToClipboard }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover closeOnBlur={true} isOpen={open} onClose={() => setOpen(false)} placement='bottom'>
      <PopoverTrigger>
        <Tooltip label='Copy to Clipboard'>
          <IconButton
            colorScheme='orange'
            icon={<CopyIcon />}
            marginLeft='15px'
            onClick={() => {
              copyPayloadToClipboard();
              delayedClosePopover(setOpen);
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
