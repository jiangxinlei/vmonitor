import { useTracker } from '../utils/tracker';

// 接口监控
function injectXHR() {
  let XMLHttpRequest = window.XMLHttpRequest;

  let oldOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, async) {
    if (!url.match(/logstores/) && !url.match(/sockjs/) && !url.match(/hot/)) {
      this.loadData = { method, url, async };
    }
    return oldOpen.apply(this, arguments)
  }

  let oldSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(body) {

    if (this.loadData) {
      let startTime = Date.now();        // 发送之前记录开始时间
      const handler = (type) => (e) => {
        let duration = Date.now() - startTime;
        let status = this.status;        // 200 / 500
        let statusText = this.statusText; 

        const xhrLog = {
          kind: 'stability',
          type: 'xhr',
          eventType: type,                    // load / error / abort
          pathname: this.loadData.url,        // 请求路径
          status: status + '_' + statusText,  // 状态码
          duration,                           // 持续时间
          response: this.response ? JSON.stringify(this.response) : '',  // 响应体
          params: body || ''
        };

        useTracker(`xhr-${type}`, xhrLog);
      }
      this.addEventListener('load', handler('load'), false);
      this.addEventListener('error', handler('error'), false);
      this.addEventListener('abort', handler('abort'), false);
    }
    return oldSend.apply(this, arguments)
  }
}

export default injectXHR;