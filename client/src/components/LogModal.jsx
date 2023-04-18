import React, { useCallback, useMemo, useState } from "react";

import { InfoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Code,
  FormControl,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
} from "@chakra-ui/react";

const BACKSPACE = "Backspace";
const ENTER = "Enter";
const PROCESS_KEYS_INFO = `This will remove control, function, and navigation keys, and replace [ENTER] with a newline and delete a character for each [BACKSPACE].`;

export const parseKeystrokes = (keystrokes, processKeys = false) => {
  const decodedKeystrokes = JSON.parse(atob(keystrokes));
  if (processKeys) {
    const processed = decodedKeystrokes
      .filter((key) => key.length < 2 || key === ENTER || key === BACKSPACE)
      .map((key) => (key === ENTER ? "\n" : key));
    const deleted = [];
    processed.forEach((key) =>
      key !== BACKSPACE ? deleted.push(key) : deleted.pop()
    );
    return deleted.join("");
  }
  return decodedKeystrokes.map((key) =>
    key.length > 1 ? (
      <Code colorScheme="green" margin="1px">
        {key.toUpperCase()}
      </Code>
    ) : (
      key
    )
  );
};

const LogModal = ({ selectedLog, setShowDetails, showDetails }) => {
  const [processKeys, setProcessKeys] = useState(false);

  const toggleProcessKeys = useCallback(
    () => setProcessKeys(!processKeys),
    [processKeys, setProcessKeys]
  );

  const processedKeys = useMemo(
    () =>
      selectedLog?.keystrokes &&
      parseKeystrokes(selectedLog?.keystrokes, processKeys),
    [selectedLog, processKeys]
  );

  return (
    <Modal
      blockScrollOnMount={false}
      isCentered
      isOpen={showDetails}
      onClose={() => setShowDetails(null)}
      size="lg"
    >
      <ModalOverlay />
      <ModalContent height="500px">
        <ModalHeader>Keystrokes for {selectedLog.ip}</ModalHeader>
        <ModalBody overflowY="scroll">
          <FormControl mb="5">
            <Checkbox onChange={toggleProcessKeys}>Process keystrokes</Checkbox>
            <Tooltip label={PROCESS_KEYS_INFO}>
              <InfoIcon ml="2" />
            </Tooltip>
          </FormControl>
          <Box borderRadius="md" bg="gray.200" p="10px">
            <Text mb="1rem" style={{ whiteSpace: "pre-line" }}>
              {processedKeys}
            </Text>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => setShowDetails(null)}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LogModal;
