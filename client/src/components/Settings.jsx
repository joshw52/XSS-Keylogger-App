import React, { useState } from 'react';

import axios from 'axios';

import {
    FormControl,
    FormLabel,
    Stack,
    Switch,
} from '@chakra-ui/react';

const toggleDarkMode = darkMode =>
  axios
    .put(`/api/darkmode`, { darkMode }, { withCredentials: true })
    .then(response => response.data.logs);

const Settings = () => {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <Stack spacing="0">
        <Stack direction='row'>
            <FormControl display='flex' alignItems='center' justifyContent='center'>
                <FormLabel htmlFor='isChecked'>Dark Mode</FormLabel>
                <Switch
                    isChecked={darkMode}
                    onChange={() => {
                        setDarkMode(!darkMode);
                    }}
                />
            </FormControl>
        </Stack>
    </Stack>
  );
};

export default Settings;
