/**
 * @description 防抖。immediate设置是否立即执行第一次回调
 * @param {Function} func 需要防抖的函数
 * @param {number} [wait=0] 防抖间隔时间
 * @param {boolean} [immediate=false] 是否立即执行第一次回调
 * @returns {Function}
 */
const debounce = function(func: any, wait = 0, immediate = false) {
  let timeout: any, result: any

  const debounced = function(this: any) {
    const _this = this;
    const _arguments = arguments;

    timeout && clearTimeout(timeout);
    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(function() {
        timeout = null;
      }, wait);
      callNow && (result = func.apply(_this, _arguments));
    } else {
      timeout = setTimeout(function() {
        func.apply(_this, _arguments);
      }, wait);
    }
    return result;
  }

  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced
}

export default debounce;
