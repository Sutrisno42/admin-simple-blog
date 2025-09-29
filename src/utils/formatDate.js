import moment from 'moment'
export function formatDefaultDate(date) {
  if (date) {
    return moment(date, 'YYYY-MM-DD HH:mm:ss').format('DD MMM YYYY - HH:mm:ss')
  }
  return ''
}
export function formatCustomDate(date, customFirst, customLast) {
  if (date) {
    return moment(date, `${customFirst}`).format(`${customLast}`)
  }
  return ''
}
export function formatDate  (dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day} ${month} ${year}, ${hours}:${minutes}`;
};


export function getDateIndex(dateString, monthIndex = true) {
  if(monthIndex){
    return new Date(dateString).getMonth() + 1;
  }

  return new Date(dateString).getFullYear();
}
export function convertDateToMonthYear(dateString) {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  return `${month}/${year}`;
}