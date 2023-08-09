import React, { useCallback, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
} from '@chakra-ui/react';

import { AuthContext } from '../authContext';

const passwordValidation = {
  required: 'Password is required',
};

const usernameValidation = {
  required: 'Username is required',
};

const Login = () => {
  const { onLogin } = useContext(AuthContext);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({ mode: 'onSubmit' });
  const onSubmit = data => onLogin(data, setLoginResponse);

  const [loginResponse, setLoginResponse] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = useCallback(() => setShowPassword(!showPassword), [setShowPassword, showPassword]);

  return (
    <Flex alignItems="center" flexDirection="column" height="400px" justifyContent="center">
      <Stack alignItems="center" flexDirection="column" justifyContent="center" width="400px">
        <Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing="4">
              <FormControl isInvalid={!!errors.username}>
                <Input {...register('username', usernameValidation)} placeholder="Username" type="text" />
                <FormErrorMessage>{errors?.username?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.password}>
                <InputGroup>
                  <Input
                    {...register('password', passwordValidation)}
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                  />
                  <InputRightElement onClick={toggleShowPassword}>
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
              </FormControl>
              <Button isLoading={isSubmitting} type="submit">
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      {loginResponse?.loginMsg && (
        <Box color={loginResponse?.loginError ? 'red' : 'green'}>{loginResponse?.loginMsg}</Box>
      )}
      <Box>
        No Account? <Link href="/register">Register</Link>
      </Box>
    </Flex>
  );
};

export default Login;
