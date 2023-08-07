import React, { useEffect, useMemo, useState } from 'react';

import moment from 'moment-timezone';
import { uniq } from 'lodash';
import axios from 'axios';

import { MdCookie, MdStorage } from 'react-icons/md';

import {
  Card,
  CardBody,
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
} from '@chakra-ui/react';

import LogModal, { parseKeystrokes } from './LogModal';

const getLogs = setLogs =>
  axios
    .get(`/api/logs`, { withCredentials: true })
    .then(response => setLogs(response.data.logs));

const getIPs = logs => uniq(logs?.map(({ ip }) => ip));

const filterLogs = (logs, ip) => logs.filter(log => (ip ? log.ip === ip : log));

const processLogs = logs =>
  logs.map(log => ({
    ...log,
    keystrokes: parseKeystrokes(log.keystrokes),
  }));

const searchKeystrokes = (logs, searchTerm) =>
  logs.filter(
    log =>
      JSON.parse(atob(log.keystrokes))
        .join('')
        .toLowerCase()
        .indexOf(searchTerm.toLowerCase()) > -1,
  );

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [selectedIp, setSelectedIp] = useState(null);
  const [showDetails, setShowDetails] = useState(null);

  useEffect(() => {
    getLogs(setLogs);
  }, []);

  const selectedLog = useMemo(
    () => showDetails && logs?.find(log => log.id === showDetails),
    [logs, showDetails],
  );

  const filteredLogs = useMemo(() => {
    let filtered = filterLogs(logs, selectedIp);
    if (searchTerm) {
      filtered = searchKeystrokes(filtered, searchTerm);
    }
    return processLogs(filtered);
  }, [logs, searchTerm, selectedIp]);

  return (
    <Stack spacing="0">
      {selectedLog && (
        <LogModal
          selectedLog={selectedLog}
          setShowDetails={setShowDetails}
          showDetails={showDetails}
        />
      )}
      <Card
        bg="gray.300"
        borderRadius="sm"
        direction={{ base: 'column', sm: 'row' }}
      >
        <CardBody>
          <Select
            bg="gray.100"
            onChange={e => setSelectedIp(e.target.value)}
            placeholder="Filter by IP address"
          >
            {getIPs(logs).map(ip => (
              <option key={`ipOption/${ip}`} value={ip}>
                {ip}
              </option>
            ))}
          </Select>
        </CardBody>
        <CardBody>
          <Input
            bg="gray.100"
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search Logs"
            value={searchTerm}
          />
        </CardBody>
      </Card>
      <TableContainer borderRadius="sm" maxHeight="500px" overflowY="auto">
        <Table>
          <Thead bg="gray.200" position="sticky" top={0}>
            <Tr>
              <Th>IP</Th>
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
                id,
                ip,
                keystrokes,
                local_storage,
                session_storage,
                user_agent,
              }) => (
                <Tr
                  key={`log/${created_at}/${ip}`}
                  onClick={() => setShowDetails(id)}
                  sx={{
                    cursor: 'pointer',
                  }}
                >
                  <Td>{ip}</Td>
                  <Td>{moment(created_at).format('MMM DD, YYYY hh:mm a')}</Td>
                  <Td>
                    <Text
                      style={{
                        height: '75px',
                        overflowX: 'scroll',
                        whiteSpace: 'pre-line',
                        width: '250px',
                      }}
                    >
                      {user_agent}
                    </Text>
                  </Td>
                  <Td>
                    <Text
                      style={{
                        height: '75px',
                        overflowX: 'scroll',
                        whiteSpace: 'pre-line',
                        width: '400px',
                      }}
                    >
                      {keystrokes}
                    </Text>
                  </Td>
                  <Td>{cookies && <Icon as={MdCookie} />}</Td>
                  <Td>
                    {(local_storage || session_storage) && (
                      <Icon as={MdStorage} />
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
