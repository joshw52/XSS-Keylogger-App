import React, { useState } from 'react';
import axios from 'axios';

import { DeleteIcon } from '@chakra-ui/icons';
import {
  Button,
  ButtonGroup,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Tooltip,
} from '@chakra-ui/react';

const deletePayload = (payloadId, setCurrentPayload, fetchPayloads) =>
  axios.delete(`/api/payloads/${payloadId}`, { withCredentials: true }).then(response => {
    setCurrentPayload(null);
    fetchPayloads();
    return response.data;
  });

const DeletePayload = ({ currentPayload, fetchPayloads, setCurrentPayload }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover closeOnBlur={true} isOpen={open} onClose={() => setOpen(false)} placement='left'>
      <PopoverTrigger>
        <Tooltip label='Delete Payload'>
          <IconButton colorScheme='red' icon={<DeleteIcon />} marginLeft='15px' onClick={() => setOpen(true)} />
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader fontWeight='semibold'>Delete Payload Confirmation</PopoverHeader>
        <PopoverBody>{`Are you sure you want to delete "${currentPayload?.name}"?`}</PopoverBody>
        <PopoverFooter display='flex' justifyContent='flex-end'>
          <ButtonGroup size='sm'>
            <Button onClick={() => setOpen(false)} variant='outline'>
              Cancel
            </Button>
            <Button
              colorScheme='red'
              onClick={() => deletePayload(currentPayload?.id, setCurrentPayload, fetchPayloads)}
            >
              Delete
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default DeletePayload;
