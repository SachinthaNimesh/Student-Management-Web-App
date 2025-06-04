export const getCurrentDateTime = () => {
  // Convert to IST by adding the offset (UTC+5:30)
  const date = new Date();
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const istOffset = 5.5 * 60 * 60000; // 5.5 hours in milliseconds
  const istDate = new Date(utc + istOffset);
  
  // Format the time
  const hours = istDate.getHours();
  const minutes = istDate.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
  
  // Format the date
  const day = istDate.getDate().toString().padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[istDate.getMonth()];
  
  return `${formattedHours}:${minutes} ${period} ${day} ${month}`;
};