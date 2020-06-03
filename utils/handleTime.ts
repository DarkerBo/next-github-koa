import moment from 'moment';
// moment.locale('zh-cn');

export function getTimeFromNow(time: Date | string) {
  return moment(time).fromNow()
}