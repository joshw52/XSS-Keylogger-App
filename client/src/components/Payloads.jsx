import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Stack,
  Tooltip,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import Editor from '@monaco-editor/react';

import CopyPayload from './CopyPayload';
import DeletePayload from './DeletePayload';
import DownloadPayload from './DownloadPayload';
import NewPayloadModal from './NewPayloadModal';
import PayloadInfo from './PayloadInfo';
import SavePayload from './SavePayload';

const getPayloads = (setPayloads, setCurrentPayload) =>
  axios.get('/api/payloads', { withCredentials: true }).then(response => {
    setPayloads(response.data.payloads);
    if (response?.data?.payloads?.length > 0) setCurrentPayload(response.data.payloads[0]);
  });

const savePayload = (payloadId, payloadData, fetchPayloads) =>
  axios
    .put(`/api/payloads/${payloadId}`, payloadData, { withCredentials: true })
    .then(() => fetchPayloads());

const Payload = () => {
  const { colorMode } = useColorMode();

  const optionsBg = useColorModeValue('gray.300', 'gray.700');
  const optionsInputBg = useColorModeValue('gray.100', 'gray.600');

  const payloadDrawerRef = useRef(null);
  const payloadEditorRef = useRef(null);

  const handleEditorDidMount = editor => {
    payloadEditorRef.current = editor;
  };

  const [currentPayload, setCurrentPayload] = useState(null);
  const [fontSize, setFontSize] = useState(localStorage.getItem('payloadFontSize') || '14');
  const [newPayloadOpen, setNewPayloadOpen] = useState(false);
  const [payloads, setPayloads] = useState([]);

  const fetchPayloads = useCallback(
    () => getPayloads(setPayloads, setCurrentPayload),
    [setCurrentPayload],
  );

  useEffect(() => {
    fetchPayloads();
  }, []);

  const updatePayload = useCallback(() => {
    const updatedPayload = {
      ...currentPayload,
      payload: payloadEditorRef.current.getValue(),
    };
    savePayload(currentPayload?.id, updatedPayload, fetchPayloads);
  }, [currentPayload, payloadEditorRef]);

  const copyPayloadToClipboard = useCallback(
    () => navigator.clipboard.writeText(payloadEditorRef.current.getValue()),
    [payloadEditorRef],
  );

  return (
    <Stack>
      <NewPayloadModal
        fetchPayloads={fetchPayloads}
        newPayloadOpen={newPayloadOpen}
        setCurrentPayload={setCurrentPayload}
        setNewPayloadOpen={setNewPayloadOpen}
      />
      <Box
        bg={optionsBg}
        borderRadius='sm'
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        width='100%'
      >
        <Box
          display='flex'
          flexDirection='row'
          justifyContent='flex-start'
          alignItems='flex-end'
          padding='20px'
          width='60%'
        >
          <FormControl marginRight='15px' width='300px'>
            <FormLabel>Select a Payload to Edit</FormLabel>
            <Select
              bg={optionsInputBg}
              onChange={e =>
                setCurrentPayload(payloads.find(p => Number(p.id) === Number(e.target.value)))
              }
              placeholder='- Select a Payload -'
              value={currentPayload?.id}
            >
              {payloads.map(({ id, name }) => (
                <option key={`payload/${id}`} value={id}>
                  {name}
                </option>
              ))}
            </Select>
          </FormControl>
          {currentPayload ? (
            <>
              <FormControl width='300px'>
                <FormLabel>Payload Name</FormLabel>
                <Input
                  bg={optionsInputBg}
                  id='payloadName'
                  onChange={e =>
                    setCurrentPayload({
                      ...currentPayload,
                      name: e.target.value,
                    })
                  }
                  ref={payloadDrawerRef}
                  placeholder='Enter a payload name'
                  value={currentPayload?.name}
                />
              </FormControl>
              <FormControl marginLeft='15px' width='90px'>
                <FormLabel>Font Size</FormLabel>
                <NumberInput
                  bg={optionsInputBg}
                  borderRadius='md'
                  max={30}
                  onChange={valueString => {
                    const updatedValue = valueString.replace(/^\$/, '');
                    setFontSize(updatedValue);
                    localStorage.setItem('payloadFontSize', updatedValue);
                  }}
                  value={fontSize}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </>
          ) : (
            <Tooltip label='New Payload'>
              <IconButton
                colorScheme='green'
                icon={<AddIcon />}
                onClick={() => setNewPayloadOpen(true)}
              />
            </Tooltip>
          )}
        </Box>
        <Box
          display='flex'
          flexDirection='row'
          justifyContent='flex-end'
          alignItems='flex-end'
          padding='20px'
        >
          {currentPayload && (
            <>
              <Tooltip label='New Payload'>
                <IconButton
                  colorScheme='green'
                  icon={<AddIcon />}
                  onClick={() => setNewPayloadOpen(true)}
                />
              </Tooltip>
              <PayloadInfo />
              <SavePayload updatePayload={updatePayload} />
              <CopyPayload copyPayloadToClipboard={copyPayloadToClipboard} />
              <DownloadPayload payload={currentPayload} />
              <DeletePayload
                currentPayload={currentPayload}
                fetchPayloads={fetchPayloads}
                setCurrentPayload={setCurrentPayload}
              />
            </>
          )}
        </Box>
      </Box>
      {currentPayload && (
        <Box height='100%' width='100%'>
          <Editor
            defaultLanguage='javascript'
            defaultValue={currentPayload?.payload}
            height='90vh'
            onMount={handleEditorDidMount}
            options={{
              fontSize,
              minimap: { enabled: false },
            }}
            theme={colorMode === 'dark' ? 'vs-dark' : 'light'}
            value={currentPayload?.payload}
          />
        </Box>
      )}
    </Stack>
  );
};

export default Payload;
