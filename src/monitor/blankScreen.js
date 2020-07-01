import { useTracker } from '../utils/tracker';
import { onload } from '../utils/util';

// 白屏
class BlankScreen {
  emptyPoints = 0;

  isWrapper(el) {
    const wrapperEl = ['html', 'body', '#root'];
    let selector = this.getSelector(el);

    if (wrapperEl.indexOf(selector) !== -1) {
      this.emptyPoints++;
    }
  }

  getSelector(el) {
    if (el.id) {
      return '#' + el.id;
    } else if (el.className) {

      el.className.split(' ').filter(item => !!item).join('.');
      return '.' + el.className
    } else {
      return el.nodeName.toLowerCase();
    }
  }

  inject() {
    onload(() => {
      // 将屏幕分成水平、垂直两个方向，在两条线上分别取 9 个点，看各个点上有没有元素
      for (let i = 1; i <= 9; i++) {
        let xEl = document.elementsFromPoint(window.innerWidth * i / 10, window.innerHeight / 2);
        let yEl = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight * i / 10);
    
        this.isWrapper(xEl[0]);
        this.isWrapper(yEl[0]);
      }
  
      if (this.emptyPoints > 0) {
        let centerEl = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    
        const blankLog = {
          kind: 'stability',
          type: 'blank',
          emptyPoints: this.emptyPoints,
          screen: window.screen.width + 'X' + window.screen.height,
          viewPoint: window.innerWidth + 'X' + window.innerHeight,
          selector: this.getSelector(centerEl[0])
        };
  
        useTracker('blank', blankLog);
      }
    })
  }
}

export default new BlankScreen;