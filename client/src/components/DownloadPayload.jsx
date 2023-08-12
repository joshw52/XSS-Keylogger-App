import React, { useCallback, useState } from 'react';

import { DownloadIcon } from '@chakra-ui/icons';
import {
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from '@chakra-ui/react';

import { delayedClosePopover } from '../helpers';

const DownloadPayload = ({ payload }) => {
  const [open, setOpen] = useState(false);

  const downloadPayload = useCallback(() => {
    const element = document.createElement('a');
    element.setAttribute('id', 'payloadDownload');
    const file = new Blob([payload?.payload], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(file);
    element.download = `${payload.name}.js`;
    document.body.appendChild(element);
    element.click();
    delayedClosePopover(setOpen);
    document.body.removeChild(element);
  }, [payload, setOpen]);

  return (
    <Popover closeOnBlur={true} isOpen={open} onClose={() => setOpen(false)} placement='bottom'>
      <PopoverTrigger>
        <Tooltip label='Download Payload'>
          <IconButton
            colorScheme='teal'
            icon={<DownloadIcon />}
            marginLeft='15px'
            onClick={downloadPayload}
          />
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>Payload downloaded!</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default DownloadPayload;
