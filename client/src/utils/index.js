export const daysLeft = (deadline) => {
  const difference = new Date(deadline * 1000).getTime() - Date.now();
  const days = Math.ceil(difference / (1000 * 3600 * 24));

  return days > 0 ? days : 0;
};

export const calculateBarPercentage = (target, amountCollected) => {
  const percentage = Math.round((amountCollected * 100) / target);

  return percentage;
};

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};

export const getGoogleDriveImage = (url) => {
  if (!url) return '';
  if (!url.includes('drive.google.com')) return url;

  // Regex to extract file ID from various Google Drive link formats
  const regex = /(?:\/d\/|id=)([\w-]+)/;
  const match = url.match(regex);

  if (match && match[1]) {
    // Return a direct download/view link
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }

  return url;
};
