export const delayedClosePopover = setOpen => {
  setOpen(true);
  setTimeout(() => {
    setOpen(false);
  }, [5000]);
};

const BACKSPACE = 'Backspace';
const ENTER = 'Enter';

export const parseKeystrokes = (keystrokes, processKeys = false) => {
  const decodedKeystrokes = JSON.parse(atob(keystrokes));
  if (processKeys) {
    const processed = decodedKeystrokes
      .filter(key => key.length < 2 || key === ENTER || key === BACKSPACE)
      .map(key => (key === ENTER ? '\n' : key));
    const deleted = [];
    processed.forEach(key => (key !== BACKSPACE ? deleted.push(key) : deleted.pop()));
    return deleted.join('');
  }
  return decodedKeystrokes.map(key =>
    key.length > 1 ? (
      <Code colorScheme='green' margin='1px'>
        {key.toUpperCase()}
      </Code>
    ) : (
      key
    ),
  );
};
