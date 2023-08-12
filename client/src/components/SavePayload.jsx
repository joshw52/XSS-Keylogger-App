import React, { useState } from 'react';
import { MdSave } from 'react-icons/md';

import {
  Icon,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from '@chakra-ui/react';

import { delayedClosePopover } from '../helpers';

const CopyPayload = ({ updatePayload }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover closeOnBlur={true} isOpen={open} onClose={() => setOpen(false)} placement='bottom'>
      <PopoverTrigger>
        <Tooltip label='Save Payload'>
          <IconButton
            colorScheme='blue'
            icon={<Icon as={MdSave} />}
            marginLeft='15px'
            onClick={() => {
              updatePayload();
              delayedClosePopover(setOpen);
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
