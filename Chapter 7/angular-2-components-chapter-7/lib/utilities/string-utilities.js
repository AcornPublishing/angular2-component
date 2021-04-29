// This function will truncate a string if it exceedes a limit and add an elipsis character if truncated
export function limitWithElipsis(str, limit) {
  if (str.length > limit) {
    return str.slice(0, limit - 1) + '…';
  } else {
    return str;
  }
}
