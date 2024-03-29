import React from 'react';

import { InfoIcon } from '@chakra-ui/icons';
import {
  Box,
  Code,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tooltip,
} from '@chakra-ui/react';

const PayloadInfo = () => (
  <Popover>
    <Tooltip label='Information'>
      <Box display='inline-block' marginLeft='15px'>
        <PopoverTrigger>
          <IconButton colorScheme='purple' icon={<InfoIcon />} />
        </PopoverTrigger>
      </Box>
    </Tooltip>
    <PopoverContent width='600px'>
      <PopoverArrow />
      <PopoverCloseButton />
      <PopoverHeader>Payload Creation Info</PopoverHeader>
      <PopoverBody textAlign='left'>
        For the XSS payload to send keystrokes to the server, it will need to record keystrokes
        (each recorded key as an item in an array), stringify the data, then base64 encode it. This
        base64 data will need to be sent as the value to key{' '}
        <Code colorScheme='purple'>keystrokes</Code> in a JSON blob.
        <br />
        <br />
        This JSON data will need to then be sent to the server at{' '}
        <Code colorScheme='purple'>/api/logs</Code> in a POST request.
        <br />
        <br />
        You can also send <Code colorScheme='purple'>cookies</Code>,{' '}
        <Code colorScheme='purple'>localStorage</Code>, and{' '}
        <Code colorScheme='purple'>sessionStorage</Code>. These will similarly need to be base64
        encoded before sending to <Code colorScheme='purple'>/api/logs</Code>.
        <br />
        <br />
        See the <Code colorScheme='purple'>Default XSS Payload</Code> payload for an example.
      </PopoverBody>
    </PopoverContent>
  </Popover>
);

export default PayloadInfo;
