import React, { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';

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

const onRegister = ({ password, username }, setRegisterResponse) =>
  axios
    .post('/api/register', {
      password,
      username,
    })
    .then(res => {
      setRegisterResponse(res.data);
    });

const passwordValidation = {
  minLength: {
    message: 'Passwords should be at least 8 characters long',
    value: 8,
  },
  required: 'Password is required',
};

const usernameValidation = {
  minLength: {
    message: 'Usernames should be at least 4 characters long',
    value: 4,
  },
  required: 'Username is required',
};

const Register = () => {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({ mode: 'onSubmit' });
  const onSubmit = data => onRegister(data, setRegisterResponse);

  const [registerResponse, setRegisterResponse] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = useCallback(() => setShowPassword(!showPassword), [setShowPassword, showPassword]);

  return (
    <Flex alignItems='center' flexDirection='column' height='400px' justifyContent='center'>
      <Stack alignItems='center' flexDirection='column' justifyContent='center' width='400px'>
        <Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing='4'>
              <FormControl isInvalid={!!errors.username}>
                <Input {...register('username', usernameValidation)} placeholder='Username' type='text' />
                <FormErrorMessage>{errors?.username?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.password}>
                <InputGroup>
                  <Input
                    {...register('password', passwordValidation)}
                    placeholder='Password'
                    type={showPassword ? 'text' : 'password'}
                  />
                  <InputRightElement onClick={toggleShowPassword}>
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
              </FormControl>
              <Button isLoading={isSubmitting} type='submit'>
                Register
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      {registerResponse?.registerMsg && (
        <Box color={registerResponse?.registerError ? 'red.500' : 'green.500'}>{registerResponse?.registerMsg}</Box>
      )}
      <Box>
        Have an account? <Link href='/'>Login</Link>
      </Box>
    </Flex>
  );
};

export default Register;
