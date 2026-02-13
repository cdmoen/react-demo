function GlobalMessage({ message }) {
  if (!message) return null;
  return <div className="message">{message}</div>;
}

export default GlobalMessage;
