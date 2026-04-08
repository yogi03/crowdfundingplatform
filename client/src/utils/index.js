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
  let isCalled = false;
  const singleCallback = (value) => {
    if (!isCalled) {
      isCalled = true;
      callback(value);
    }
  };

  if (!url) {
    singleCallback(false);
    return;
  }

  if (url.startsWith('data:image')) {
    singleCallback(true);
    return;
  }

  const img = new Image();
  img.src = url;

  if (img.complete) {
    singleCallback(true);
    return;
  }

  img.onload = () => singleCallback(true);
  img.onerror = () => singleCallback(false);
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

export const compressImage = (file, maxWidth = 500, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert heavily to highly-compressed jpeg base64
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const uploadImageToImgBB = async (base64Data) => {
  try {
    const rawData = base64Data.split(',')[1] || base64Data; // Get purely the base64 content
    
    const formData = new FormData();
    formData.append('image', rawData);

    const response = await fetch('https://api.imgbb.com/1/upload?key=7a36f040233e3dd6b7c177571780494e', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    if (result.status === 200) {
      return result.data.url;
    } else {
      throw new Error(result.error?.message || 'Image upload failed');
    }
  } catch (error) {
    console.error('Error uploading image to ImgBB:', error);
    throw error;
  }
};
