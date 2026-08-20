const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getImageUrl = (imagePath) => {
    //console.log(imagePath);
    
    if (!imagePath) {
        return "";
    }

    // Blob URL from a newly selected local file
    if (imagePath.startsWith("blob:")) {
        return imagePath;
    }

    // Already a complete URL
    if (
        imagePath.startsWith("http://") ||
        imagePath.startsWith("https://")
    ) {
        return imagePath;
    }

    // Backend relative upload path
    return `${API_BASE_URL}${imagePath}`;
};