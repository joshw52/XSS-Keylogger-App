export const delayedClosePopover = setOpen => {
  setOpen(true);
  setTimeout(() => {
    setOpen(false);
  }, [5000]);
};
