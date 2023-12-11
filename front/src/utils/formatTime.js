export default function formatTimeAgo(timestamp) {
  const currentDate = new Date();
  const reviewDate = new Date(timestamp);

  const timeDifference = currentDate.getTime() - reviewDate.getTime();
  const secondsDifference = Math.floor(timeDifference / 1000);
  const minutesDifference = Math.floor(secondsDifference / 60);
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);
  const weeksDifference = Math.floor(daysDifference / 7);
  const monthsDifference = Math.floor(daysDifference / 30);
  const yearsDifference = Math.floor(daysDifference / 365);

  if (yearsDifference > 0) {
    return yearsDifference === 1
      ? "1 year ago"
      : `${yearsDifference} years ago`;
  } else if (monthsDifference > 0) {
    return monthsDifference === 1
      ? "1 month ago"
      : `${monthsDifference} months ago`;
  } else if (weeksDifference > 0) {
    return weeksDifference === 1
      ? "1 week ago"
      : `${weeksDifference} weeks ago`;
  } else if (daysDifference > 0) {
    return daysDifference === 1 ? "1 day ago" : `${daysDifference} days ago`;
  } else if (hoursDifference > 0) {
    return hoursDifference === 1
      ? "1 hour ago"
      : `${hoursDifference} hours ago`;
  } else if (minutesDifference > 0) {
    return minutesDifference === 1
      ? "1 minute ago"
      : `${minutesDifference} minutes ago`;
  } else {
    return "Just now";
  }
}
