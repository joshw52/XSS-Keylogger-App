import React, { useCallback, useMemo, useState } from 'react';

import { MdCookie, MdKeyboard, MdStorage } from 'react-icons/md';
import { InfoIcon } from '@chakra-ui/icons';

import {
  Box,
  Button,
  Checkbox,
  Code,
  FormControl,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import moment from 'moment-timezone';

const BACKSPACE = 'Backspace';
const ENTER = 'Enter';
const PROCESS_KEYS_INFO = `This will remove control, function, and navigation keys, and replace [ENTER] with a newline and delete a character for each [BACKSPACE].`;

export const parseKeystrokes = (keystrokes, processKeys = false) => {
  const decodedKeystrokes = JSON.parse(atob(keystrokes));
  if (processKeys) {
    const processed = decodedKeystrokes
      .filter(key => key.length < 2 || key === ENTER || key === BACKSPACE)
      .map(key => (key === ENTER ? '\n' : key));
    const deleted = [];
    processed.forEach(key => (key !== BACKSPACE ? deleted.push(key) : deleted.pop()));
    return deleted.join('');
  }
  return decodedKeystrokes.map(key =>
    key.length > 1 ? (
      <Code colorScheme='green' margin='1px'>
        {key.toUpperCase()}
      </Code>
    ) : (
      key
    ),
  );
};

const LogModal = ({ selectedLog, setShowDetails, showDetails }) => {
  const logsModalTextBg = useColorModeValue('gray.200', 'gray.600');

  const [processKeys, setProcessKeys] = useState(false);

  const toggleProcessKeys = useCallback(() => setProcessKeys(!processKeys), [processKeys, setProcessKeys]);

  const processedKeys = useMemo(
    () => selectedLog?.keystrokes && parseKeystrokes(selectedLog?.keystrokes, processKeys),
    [selectedLog, processKeys],
  );

  return (
    <Modal blockScrollOnMount={false} isCentered isOpen={showDetails} onClose={() => setShowDetails(null)} size='lg'>
      <ModalOverlay />
      <ModalContent height='500px'>
        <ModalHeader>
          {selectedLog.ip} - {moment(selectedLog.created_at).format('MMM DD, YYYY hh:mm a')}
        </ModalHeader>
        <ModalBody overflowY='scroll'>
          <Tabs variant='soft-rounded' colorScheme='green'>
            <TabList>
              <Tab>
                Keystrokes &nbsp;
                <Icon as={MdKeyboard} />
              </Tab>
              {selectedLog.cookies && (
                <Tab>
                  Cookies &nbsp;
                  <Icon as={MdCookie} />
                </Tab>
              )}
              {(selectedLog.local_storage || selectedLog.session_storage) && (
                <Tab>
                  Storage &nbsp;
                  <Icon as={MdStorage} />
                </Tab>
              )}
            </TabList>
            <TabPanels>
              <TabPanel>
                <FormControl mb='5'>
                  <Checkbox onChange={toggleProcessKeys}>Process keystrokes</Checkbox>
                  <Tooltip label={PROCESS_KEYS_INFO}>
                    <InfoIcon ml='2' />
                  </Tooltip>
                </FormControl>
                <Box borderRadius='md' bg={logsModalTextBg} p='10px'>
                  <Text mb='1rem' style={{ whiteSpace: 'pre-line' }}>
                    {processedKeys}
                  </Text>
                </Box>
              </TabPanel>
              {selectedLog.cookies && (
                <TabPanel>
                  <Box borderRadius='md' bg={logsModalTextBg} p='10px'>
                    <Text mb='1rem' style={{ whiteSpace: 'pre-line' }}>
                      {atob(selectedLog.cookies)}
                    </Text>
                  </Box>
                </TabPanel>
              )}
              {(selectedLog.local_storage || selectedLog.session_storage) && (
                <TabPanel>
                  {selectedLog.local_storage && (
                    <>
                      <Heading as='h4' size='md'>
                        Local Storage
                      </Heading>
                      <Box borderRadius='md' bg={logsModalTextBg} p='10px'>
                        <Text mb='1rem' style={{ whiteSpace: 'pre-line' }}>
                          {atob(selectedLog.local_storage)}
                        </Text>
                      </Box>
                    </>
                  )}
                  {selectedLog.session_storage && (
                    <>
                      <Heading as='h4' size='md'>
                        Session Storage
                      </Heading>
                      <Box borderRadius='md' bg={logsModalTextBg} p='10px'>
                        <Text mb='1rem' style={{ whiteSpace: 'pre-line' }}>
                          {atob(selectedLog.session_storage)}
                        </Text>
                      </Box>
                    </>
                  )}
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={() => setShowDetails(null)}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LogModal;
