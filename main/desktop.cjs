const { createInterface } = require('node:readline');

const waiting = new Map();
let nextId = 0;

// The child process owns this pipe. Renderer calls go through the Rust window host.
const send = (message, flushed) => process.stdout.write(`${JSON.stringify(message)}\n`, flushed);

function notify(operation, payload) {
  send({ type: 'host', operation, payload });
}

function request(operation, payload) {
  const id = ++nextId;
  return new Promise((resolve, reject) => {
    waiting.set(id, { resolve, reject });
    send({ type: 'host', id, operation, payload });
  });
}

function listen(call, event) {
  const input = createInterface({ input: process.stdin });
  const reply = (id, value, error) => send({ type: 'reply', id, value: value ?? null, error });
  input.on('line', async line => {
    const message = JSON.parse(line);
    if (message.type === 'host_reply') {
      const pending = waiting.get(message.id);
      waiting.delete(message.id);
      if (pending) {
        if (message.error) pending.reject(Error(message.error));
        else pending.resolve(message.value);
      }
      return;
    }
    try {
      if (message.type === 'call') reply(message.id, await call(message.window, message.method, ...message.args));
      if (message.type === 'event') await event(message.event, message.payload);
    } catch (error) {
      if (message.type === 'call') reply(message.id, null, error.message);
      else console.error(error);
    }
  });
  input.on('close', () => {
    for (const pending of waiting.values()) pending.reject(Error('Desktop host closed.'));
    waiting.clear();
    void Promise.resolve(event('host-closed')).catch(console.error);
  });
}

function exit(code = 0) {
  send({ type: 'host', operation: 'exit', payload: code }, () => process.exit(code));
}

module.exports = { exit, listen, notify, request };
