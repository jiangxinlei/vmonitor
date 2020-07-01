import injectJsError from './monitor/jsError';
import injectXHR from './monitor/xhr';
import injectTiming from './monitor/timing';
import BlankScreen from './monitor/blankScreen';
import injectLongTask from './monitor/longTask';
import injectPv from './monitor/pv';

injectJsError();
injectXHR();
injectTiming();
BlankScreen.inject();
injectLongTask();
injectPv();