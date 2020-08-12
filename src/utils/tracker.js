import localforage from 'localforage';

// ajax 上报 阿里云 sls服务
function useSlsTracker(data = {}) {
  let project = '', host = '', logStore = '';
  let url = `http://${project}.${host}/logstores/${logStore}/track`;  // 上报路径
  let xhr = new XMLHttpRequest();

  let extraData = this.getExtraData();

  let log = { ...extraData, ...data };

  for (let key in log) {
    if (typeof log[key] === 'number') {
      log[key] = `${log[key]}`;
    }
  }

  console.log(log);

  xhr.open('POST', url, true);

  let body = JSON.stringify({
    __logs__: [log]
  });

  xhr.setRequestHeader('Content-Type', 'application/json');  // 请求体类型
  xhr.setRequestHeader('x-log-apiversion', '0.6.0');  // 版本号
  xhr.setRequestHeader('x-log-bodyrawsize', body.length);  // 请求体大小

  // xhr.onload = function() {
  //   console.log(this.xhr);
  // }
  // xhr.onerror = function(error) {
  //   console.log(error);
  // }

  xhr.send(body);
}

function useImgTracker(data = {}) {
  let reportUrl = '';
  new Image().src = `${reportUrl}?logs=${JSON.stringify(data)}`;
}

function useTracker(logType, data = {}) {

  localforage.getItem(logType, (err, value) => {
    if (err == null && value) {
      value.push({...data});

      localforage.setItem(logType, value, (res) => {
        if (res === null) {
          console.log(`${logType}-set success`);
        }
      })
    } else {
      localforage.setItem(logType, [{...data}], (res) => {
        if (res === null) {
          console.log(`${logType}-initial set success`);
        }
      })
    }
  });
}

export {
  useSlsTracker,
  useImgTracker,
  useTracker
}