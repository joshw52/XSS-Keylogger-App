import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import capitalize from 'lodash/capitalize';

import axios from 'axios';

import { MoonIcon, SunIcon, ViewIcon, ViewOffIcon, WarningIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Switch,
  Text,
  Tooltip,
  useColorMode,
} from '@chakra-ui/react';

const updateDarkMode = (data, setDarkModeResponse, toggleDarkMode) =>
  axios.put(`/api/darkmode`, data, { withCredentials: true }).then(response => {
    setDarkModeResponse(response.data);
    toggleDarkMode();
  });

const updatePassword = (data, setUpdatePasswordMsg) =>
  axios
    .put(`/api/change-password`, data, { withCredentials: true })
    .then(response => setUpdatePasswordMsg(response.data));

const Settings = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [darkModeResponse, setDarkModeResponse] = useState(null);

  const onToggleDarkMode = useCallback(() => {
    updateDarkMode({ darkMode: !(colorMode === 'dark') }, setDarkModeResponse, toggleColorMode);
  }, [colorMode, setDarkModeResponse, toggleColorMode]);

  const renderDarkModeIcon = useCallback(
    response => {
      if (response?.darkModeError) {
        return (
          <Tooltip label={response?.darkModeMsg}>
            <WarningIcon color='red.500' h='6' ml='3' w='6' />
          </Tooltip>
        );
      }
      return colorMode === 'dark' ? <MoonIcon h='6' ml='3' w='6' /> : <SunIcon h='6' ml='3' w='6' />;
    },
    [colorMode],
  );

  const [passwordResponse, setPasswordResponse] = useState(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    formState: { errors, isDirty, isSubmitting },
    handleSubmit,
    register,
  } = useForm({ mode: 'onSubmit' });

  const onSubmit = data => updatePassword(data, setPasswordResponse);

  const toggleShowOldPassword = useCallback(
    () => setShowOldPassword(!showOldPassword),
    [setShowOldPassword, showOldPassword],
  );

  const toggleShowNewPassword = useCallback(
    () => setShowNewPassword(!showNewPassword),
    [setShowNewPassword, showNewPassword],
  );

  return (
    <Flex alignItems='center' flexDirection='column' height='300px' justifyContent='center'>
      <Flex alignItems='baseline' flexDirection='row' justifyContent='center'>
        <FormControl display='flex' alignItems='center' justifyContent='center' m='10'>
          <Text fontSize='xl'>{capitalize(colorMode)} Mode</Text>
          <Switch isChecked={colorMode === 'dark'} ml='3' onChange={onToggleDarkMode} size='lg' />
          {renderDarkModeIcon(darkModeResponse)}
        </FormControl>
      </Flex>
      <Stack alignItems='center' flexDirection='column' justifyContent='center' width='400px'>
        <Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing='4'>
              <FormControl isInvalid={!!errors.oldPassword}>
                <InputGroup>
                  <Input
                    {...register('oldPassword', {})}
                    placeholder='Old Password'
                    type={showOldPassword ? 'text' : 'password'}
                  />
                  <InputRightElement onClick={toggleShowOldPassword}>
                    {showOldPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors?.oldPassword?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.newPassword}>
                <InputGroup>
                  <Input
                    {...register('newPassword', {})}
                    placeholder='New Password'
                    type={showNewPassword ? 'text' : 'password'}
                  />
                  <InputRightElement onClick={toggleShowNewPassword}>
                    {showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors?.newPassword?.message}</FormErrorMessage>
              </FormControl>
              <Button isDisabled={!isDirty} isLoading={isSubmitting} type='submit'>
                Update Password
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      {passwordResponse?.passwordMsg && (
        <Box color={passwordResponse?.passwordError ? 'red.500' : 'green.500'} mt='2'>
          {passwordResponse?.passwordMsg}
        </Box>
      )}
    </Flex>
  );
};

export default Settings;
