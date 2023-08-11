import React from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

const createNewPayload = (payloadData, fetchPayloads, setCurrentPayload) =>
  axios.post(`/api/payloads`, payloadData, { withCredentials: true }).then(response => {
    fetchPayloads();
    setCurrentPayload(response.data['payloadAddData']);
  });

const payloadNameValidation = {
  required: 'Name is required for new payload',
};

const NewPayloadModal = ({
  fetchPayloads,
  newPayloadOpen,
  setCurrentPayload,
  setNewPayloadOpen,
}) => {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({ mode: 'onSubmit' });

  const resetNewPayloadForm = () => reset({ name: '' });

  const cancelNewPayloadCreate = () => {
    setNewPayloadOpen(false);
    resetNewPayloadForm();
  };

  const onSubmit = data => {
    setNewPayloadOpen(false);
    createNewPayload({ name: data.payloadName, payload: '' }, fetchPayloads, setCurrentPayload);
    resetNewPayloadForm();
  };

  return (
    <Modal
      blockScrollOnMount={false}
      isCentered
      isOpen={newPayloadOpen}
      onClose={() => setNewPayloadOpen(false)}
      size='lg'
    >
      <ModalOverlay />
      <ModalContent height='200px'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Create New Payload</ModalHeader>
          <ModalBody overflowY='scroll'>
            <FormControl isInvalid={!!errors.payloadName}>
              <Input
                {...register('payloadName', payloadNameValidation)}
                placeholder='New Payload Name'
                type='text'
              />
              <FormErrorMessage>{errors?.payloadName?.message}</FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button mr={5} onClick={cancelNewPayloadCreate}>
              Cancel
            </Button>
            <Button colorScheme='green' isLoading={isSubmitting} type='submit'>
              Create
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default NewPayloadModal;
