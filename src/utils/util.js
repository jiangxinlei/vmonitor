import userAgent from 'user-agent';

function onload(callback) {
  if (document.readyState === 'complete') {
    callback();
  } else {
    window.addEventListener('load', callback);
  }
}

function getSelector(path) {
  return path.reverse().filter(el => {
    return el !== document && el !== window;
  }).map(el => {
    let selector = '';
    if (el.id) {
      selector = `${el.nodeName.toLowerCase()}#${el.id}`;
    } else if (el.className && typeof el.className === 'string') {
      selector = `${el.nodeName.toLowerCase()}.${el.className}`;
    } else {
      selector = el.nodeName.toLowerCase();
    }
    return selector;
  }).join(' ');
}

function getSelectors(pathsOrTarget) {
  if (Array.isArray(pathsOrTarget)) { //可能是一个数组
    return getSelector(pathsOrTarget);
  } else {//也有可有是一个对象 
    let path = [];
    while (pathsOrTarget) {
      path.push(pathsOrTarget);
      pathsOrTarget = pathsOrTarget.parentNode;
    }
    return getSelector(path);
  }
}

function getLastEvent() {
  const events = ['click', 'touchstart', 'mousedown', 'keydown', 'mouseover'];
  let lastEvent;
  events.forEach(eventType => {
    document.addEventListener(eventType, (event) => {
      lastEvent = event;
    }, {
      capture: true,  // 捕获阶段
      passive: true   // 默认不阻止默认事件
    });
});
    return lastEvent;
}

function getStackLines(stack) {
  return stack.split('\n').slice(1).map((item) => item.replace(/^\s+at\s+/g, '')).join('^');
}

function getExtraData() {
  return {
    title: document.title,
    url: location.href,
    timestamp: Date.now(),
    userAgent: userAgent.parse(navigator.userAgent).name
  }
}

export {
  onload,
  getSelectors,
  getLastEvent,
  getStackLines,
  getExtraData
}