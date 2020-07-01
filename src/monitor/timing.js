// 时间监控
import { useTracker } from '../utils/tracker';
import { getLastEvent, getSelectors, onload } from '../utils/util';

function injectTiming() {

  let FMP, LCP;

  // 增加一个性能条目的观察者
  new PerformanceObserver((entryList, observe) => {
    let perfEntries = entryList.getEntries();
    FMP = perfEntries ? perfEntries[0] : { startTime: 0 };
    observe.disconnect();                  // 不再观察了
  }).observe({ entryTypes: ['element'] }); // 观察页面中的有意义的元素

  new PerformanceObserver((entryList, observe) => {
    let perfEntries = entryList.getEntries();
    LCP = perfEntries[0];
    observe.disconnect();                                   // 不再观察了
  }).observe({ entryTypes: ['largest-contentful-paint'] }); // 观察页面中的有意义的元素

  // FID
  new PerformanceObserver((entryList, observe) => {
    let firstInput = entryList.getEntries()[0];

    if (firstInput) {
      // processingStart 开始处理的时间
      // startTime 开始点击的时间
      // inputDelay 就是处理的延迟
      let inputDelay = firstInput.processingStart - firstInput.startTime;
      let duration = firstInput.duration;  // 处理的耗时

      let lastEvent = getLastEvent();
      if (inputDelay > 0 || duration > 0 ) {
        const inputDelayLog = {
          kind: 'experience',       // 用户体验指标
          type: 'firstInputDelay',  // 统计每个阶段的时间
          inputDelay,               // 延时的时间
          duration,                 // 处理的时间
          startTime: firstInput.startTime,
          selector: lastEvent ? getSelectors(lastEvent.path || lastEvent.target) : '',
        };

        useTracker('firstInputDelay', inputDelayLog);
      }
    }
    observe.disconnect();  // 不再观察了
  }).observe({ type: 'first-input', buffered: true }); // first-input - 用户第一次交互，点击页面

  onload(() => {
    // 设置延时更准确
    setTimeout(() => {
      const {
        fetchStart,
        connectStart,
        connectEnd,
        requestStart,
        responseStart,
        responseEnd,
        domLoading,
        domInteractive,
        domContentLoadedEventStart,
        domContentLoadedEventEnd,
        loadEventStart
      } = performance.timing;

      const timinglog = {
        kind: 'experience',  // 用户体验指标
        type: 'timing',      // 统计每个阶段的时间
        connectTime: connectEnd - connectStart,         // 连接时间
        ttfbTime: responseStart - requestStart,         // 首字节渲染时间
        responseTime: responseEnd - responseStart,      // 响应的读取时间
        parseDOMTime: loadEventStart - domLoading,      // DOM 解析时间
        domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart, // DOMContentLoaded 事件执行的时间
        timeToInteractive: domInteractive - fetchStart, // 首次可交互时间
        loadTime: loadEventStart - fetchStart,          // 完成的加载时间
      };

      useTracker('timing', timinglog);

      // 开始发送性能指标
      if (FMP && LCP) {
        let FP = performance.getEntriesByName('first-paint')[0];
        let FCP = performance.getEntriesByName('first-contentful-paint')[0];
        const paintlog = {
          kind: 'experience',  // 用户体验指标
          type: 'paint',       // 统计每个阶段的时间
          firstPaint: FP.startTime,
          firstContentfulPaint: FCP.startTime,
          firstMeaningfulPaint: FMP.startTime,
          largestContentfulPaint: LCP.startTime
        };

        useTracker('paint', paintlog);
      }
      
    }, 3000)
  })
}

export default injectTiming;