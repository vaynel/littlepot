(() => {
  const tauri = window.__TAURI__;
  if (!tauri) return;

  const { invoke } = tauri.core;
  const currentWindow = tauri.webviewWindow.getCurrentWebviewWindow();
  const call = async (method, ...args) => {
    const reply = await invoke('garden', { method, args });
    if (!reply.ok) throw Error(reply.error);
    return reply.value;
  };
  const subscribe = (event, callback) => {
    const cleanup = currentWindow.listen(event, ({ payload }) => callback(payload));
    cleanup.catch(console.error);
    return () => { void cleanup.then(unlisten => unlisten()).catch(console.error); };
  };

  window.garden = {
    state: () => call('state'),
    diagnostics: (command, value) => call('diagnostics', command, value),
    themes: (command, ...args) => call('themes', command, ...args),
    font: (command, token) => call('font', command, token),
    takeReview: () => call('takeReview'),
    manage: (method, ...args) => call('manage', method, ...args),
    revise: (id, mode, folders, once, layout) => call('revise', id, mode, folders, once, layout),
    onNavigate: callback => subscribe('garden:navigate', callback),
    widgetMenu: () => call('widgetMenu'),
    bind: (id, name) => call('bind', id, name),
    renamePlant: (id, name) => call('renamePlant', id, name),
    pickFolder: id => call('pickFolder', id),
    pick: id => call('pick', id),
    drop: (files, id) => call('drop', files[0]?.token, id),
    taskRetry: id => call('taskRetry', id),
    execute: id => call('execute', id),
    undo: id => call('undo', id),
    recover: () => call('recover'),
    cancel: () => call('cancel'),
    setting: (key, value) => call('setting', key, value),
    openFolder: id => call('openFolder', id),
    widget: () => call('widget'),
    manager: (page = 'garden') => call('manager', page),
    view: value => call('view', value),
    quit: () => call('quit'),
    subscribe: callback => subscribe('garden:changed', callback),
    widgetGesture: kind => invoke('widget_gesture', { kind }),
    readDroppedImage: async ({ token, first }) => new File([await invoke('read_dropped_image', { token })], first, {
      type: /\.jpe?g$/i.test(first) ? 'image/jpeg' : `image/${first.split('.').pop().toLowerCase()}`,
    }),
  };

  subscribe('garden:native-drop', detail => {
    for (const item of document.querySelectorAll('.file-drop-hover, .drop.drag')) {
      item.classList.remove('file-drop-hover', 'drag');
    }
    if (detail.phase === 'leave') return;
    const target = document.elementFromPoint(detail.x, detail.y) ?? document.querySelector('#app');
    target?.dispatchEvent(new CustomEvent('garden-native-drop', { detail, bubbles: true }));
  });
})();
