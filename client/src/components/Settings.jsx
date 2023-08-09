import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import axios from 'axios';

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Switch,
} from '@chakra-ui/react';

const darkModeValidation = {};

const oldPasswordValidation = {};

const newPasswordValidation = {
  minLength: {
    message: 'Passwords should be at least 8 characters long',
    value: 8,
  },
};

const updateSettings = (updatedSettings, setUpdateSettingsMsg) =>
  axios
    .put(`/api/settings`, updatedSettings, { withCredentials: true })
    .then(response => setUpdateSettingsMsg(response.data));

const Settings = () => {
  const [settingsResponse, setSettingsResponse] = useState(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({ mode: 'onSubmit' });

  const onSubmit = data => updateSettings(data, setSettingsResponse);

  const toggleShowOldPassword = useCallback(
    () => setShowOldPassword(!showOldPassword),
    [setShowOldPassword, showOldPassword],
  );

  const toggleShowNewPassword = useCallback(
    () => setShowNewPassword(!showNewPassword),
    [setShowNewPassword, showNewPassword],
  );

  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      height="300px"
      justifyContent="center"
    >
      <Stack
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
        width="400px"
      >
        <Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing="4">
              <FormControl
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FormLabel htmlFor="isChecked">Dark Mode</FormLabel>
                <Switch {...register('darkMode', darkModeValidation)} />
              </FormControl>
              <FormControl isInvalid={!!errors.oldPassword}>
                <InputGroup>
                  <Input
                    {...register('oldPassword', oldPasswordValidation)}
                    placeholder="Old Password"
                    type={showOldPassword ? 'text' : 'password'}
                  />
                  <InputRightElement onClick={toggleShowOldPassword}>
                    {showOldPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors?.oldPassword?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.newPassword}>
                <InputGroup>
                  <Input
                    {...register('newPassword', newPasswordValidation)}
                    placeholder="New Password"
                    type={showNewPassword ? 'text' : 'password'}
                  />
                  <InputRightElement onClick={toggleShowNewPassword}>
                    {showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors?.newPassword?.message}
                </FormErrorMessage>
              </FormControl>
              <Button isLoading={isSubmitting} type="submit">
                Update Settings
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      {settingsResponse?.settingsMsg && (
        <Box color={settingsResponse?.settingsError ? 'red' : 'green'}>
          {settingsResponse?.settingsMsg}
        </Box>
      )}
    </Flex>
  );
};

export default Settings;
