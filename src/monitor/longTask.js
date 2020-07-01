import { useTracker } from '../utils/tracker';
import { getLastEvent, getSelectors } from '../utils/util';

function injectLongTask() {
  new PerformanceObserver(list => { 
    list.getEntries().forEach(entry => {
      if (entry.duration > 100) {

        let lastEvent = getLastEvent();
          requestIdleCallback(() => {
            const longTaskLog = {
              kind: 'experience',
              type: 'longTask',
              eventType: lastEvent.type,
              startTime: entry.startTime,  // 开始时间 
              duration: entry.duration,    // 持续时间 
              selector: lastEvent ? getSelectors(lastEvent.path || lastEvent.target) : '' 
            };

            useTracker('longTask', longTaskLog);
          });
      }
    })
  }).observe({ entryTypes: ["longtask"] });
}

export default injectLongTask;

