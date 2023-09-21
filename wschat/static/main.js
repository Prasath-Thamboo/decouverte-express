// get page DOM nodes elements
const dom = { form: 0, chat: 0, name: 0, message: 0 };
for (let n in dom)
  dom[n] = document.getElementById(n);

console.log(dom);


// set random user's name
dom.name.value = decodeURIComponent(location.search.trim().slice(1, 1 + window.cfg.nameLen)) || 'Anonymous' + Math.floor(Math.random() * 99999);

wsInit(`ws://${location.hostname}:${window.cfg.wsPort}`);

// handle WebSocket communication
function wsInit(wsServer) {

  const ws = new WebSocket(wsServer);

  // connect to server // client connexion server dispatch event
  ws.addEventListener('open', () => {
    sendMessage('vient d\'entrer dans le chat room');
  });

  // receive message //
  ws.addEventListener('message', e => {

    try {

      const
        chat = JSON.parse(e.data),
        name = document.createElement('div'),
        msg = document.createElement('div');

      name.className = 'name';
      name.textContent = (chat.name || 'unknown');
      dom.chat.appendChild(name);

      msg.className = 'msg';
      msg.textContent = (chat.msg || 'n\'a rien dit');
      dom.chat.appendChild(msg).scrollIntoView({ behavior: 'smooth' });

    }
    catch (err) {
      console.log('invalid JSON', err);
    }

  });


  // form submit
  dom.form.addEventListener('submit', e => {
    e.preventDefault();
    sendMessage();
    dom.message.value = '';
    dom.message.focus();
  }, false);

  // send message
  function sendMessage(setMsg) {
    let
      name = dom.name.value.trim(),
      msg = setMsg || dom.message.value.trim();
    //dispatch message to clients "ws.send"
    name && msg && ws.send(JSON.stringify({ name, msg }));
  }
}
