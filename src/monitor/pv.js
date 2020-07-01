import { useTracker } from '../utils/tracker';
function injectPv() {
  var connection = navigator.connection; 

  // RTT(Round Trip Time)一个连接的往返时间，即数据发送时刻到接收到确认的时刻的差值
  const pvLog = {
    kind: 'business',
    type: 'pv',
    effectiveType: connection.effectiveType,                   //网络环境
    rtt: connection.rtt,                                       //往返时间
    screen: `${window.screen.width}x${window.screen.height}`   //设备分辨率
  }

  useTracker('pv', pvLog);

  let startTime = Date.now();

  window.addEventListener('unload', () => { 
    let stayTime = Date.now() - startTime; 
    const stayTimeLog = {
      kind: 'business',
      type: 'stayTime',
      stayTime
    };

    useTracker('stayTime', stayTimeLog);

  }, false);
}

export default injectPv;