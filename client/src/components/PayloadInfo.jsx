import React from 'react';

import { InfoIcon } from '@chakra-ui/icons';
import {
  Code,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/react';

const PayloadInfo = () => (
  <Popover>
    <PopoverTrigger>
      <IconButton colorScheme="purple" icon={<InfoIcon />} marginLeft="15px" />
    </PopoverTrigger>
    <PopoverContent width="500px">
      <PopoverArrow />
      <PopoverCloseButton />
      <PopoverHeader>Payload Creation Info</PopoverHeader>
      <PopoverBody textAlign="left">
        For the XSS payload to send keystrokes to the server, it will need to record keystrokes (each recorded key as an
        item in an array), stringify the data, then base64 encode it. This base64 data will need to be sent as the value
        to key <Code colorScheme="purple">keystrokes</Code> in a JSON blob.
        <br />
        <br />
        This JSON data will need to then be sent to the server at <Code colorScheme="purple">/api/logs</Code> in a POST
        request.
        <br />
        <br />
        See the <Code colorScheme="purple">Default XSS Payload</Code> payload for an example.
      </PopoverBody>
    </PopoverContent>
  </Popover>
);

export default PayloadInfo;
