/**
 * Detect device by User Agent
 */
export const isMobileDevice = () => {
  const n = navigator.userAgent;
  return (
    n.match(/Android/i) ||
    n.match(/webOS/i) ||
    n.match(/iPhone/i) ||
    n.match(/iPad/i) ||
    n.match(/iPod/i) ||
    n.match(/BlackBerry/i)
  );
};
