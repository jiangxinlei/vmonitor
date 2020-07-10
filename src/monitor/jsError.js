import { useTracker } from '../utils/tracker';
import { getLastEvent, getSelectors, getStackLines } from '../utils/util';

function injectJsError() {

  window.addEventListener('error', (e) => {
    e.preventDefault()

    let lastEvent = getLastEvent();

    if (e.target && (e.target.src || e.target.href)) {
      // 脚本加载错误
      const resourceErrorLog = {
        kind: 'stability',                   // 监控指标的大类
        type: 'error',                       // 小类型，这是 error 类型
        errorType: 'resourceError',          // js执行报错
        filename: e.target.src || e.target.href,  // 哪个文件报错
        tagName: e.target.tagName,
        selector: getSelectors(e.path),      // 代表最后一个操作的元素
      };
      useTracker('resourceError', resourceErrorLog);
      
    } else {
      console.log(e);
      // js 异常
      const jsErrorLog = {
        kind: 'stability',                   // 监控指标的大类
        type: 'error',                       // 小类型，这是 error 类型
        errorType: 'jsError',                // js执行报错
        message: e.message,                  // 报错信息
        filename: e.filename,                // 哪个文件报错
        position: `${e.lineno}:${e.colno}`,  // 行列
        stack: getStackLines(e.error.stack),
        selector: lastEvent ? getSelectors(lastEvent.path) : '', // 代表最后一个操作的元素
      };

      useTracker('jsError', jsErrorLog);
    }

  }, true);

  // promise 异常
  window.addEventListener('unhandledrejection', (e) => {
    e.preventDefault()

    let lastEvent = getLastEvent();
    let message;

    let reason = e.reason;

    if (typeof reason === 'string') {
      message = reason;
    } else if (typeof reason === 'object') {

      let filename;
      let lineno = 0;
      let colno = 0;
      let stack = '';

      if (reason.stack) {
        let result = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
        filename = result[1];
        lineno = result[2];
        colno = result[3];
      }

      message = reason.message;
      stack = getStackLines(reason.stack);

      let promiseErrorLog = {
        kind: 'stability',               // 监控指标的大类
        type: 'error',                   // 小类型，这是 error 类型
        errorType: 'promiseError',       // js执行报错
        message,                         // 报错信息
        filename,                        // 哪个文件报错
        position: `${lineno}:${colno}`,  // 行列
        stack,
        selector: lastEvent ? getSelector(lastEvent.path) : '', // 代表最后一个操作的元素
      };

      useTracker('promiseError', promiseErrorLog);
    }
  }, true)
}

export default injectJsError;