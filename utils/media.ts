const imageToDownload = (imageData: ImageState) => {
  if (imageData?.preview) {
    const imageToDownload = document.createElement("a");
    imageToDownload.href = imageData.preview;
    imageToDownload.download = imageData.filename ?? "downloaded-image";
    imageToDownload.click();
  }
};

// TODO: (WARN) MIGHT LEAD BUGS (promises that never finishes)
const getImageDimensionsByString = async (
  fileUrl: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.src = fileUrl;
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
  });
};

// TODO: (WARN) MIGHT LEAD BUGS (promises that never finishes)
const getImageDimensionsByFile = async (
  file: File
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image(); // Conflict with Next.js Image component
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

async function extractMediaMetadata(file: File) {
  const metadata: Record<string, any> = {};

  // IMAGE
  if (file.type.startsWith("image/")) {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
    metadata.width = img.width;
    metadata.height = img.height;
    URL.revokeObjectURL(img.src);
  }

  // VIDEO
  if (file.type.startsWith("video/")) {
    const video = await new Promise<HTMLVideoElement>((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const vid = document.createElement("video");
      vid.onloadedmetadata = () => resolve(vid);
      vid.onerror = reject;
      vid.src = url;
    });
    metadata.duration = video.duration;
    metadata.width = video.videoWidth;
    metadata.height = video.videoHeight;
    URL.revokeObjectURL(video.src);
  }

  return metadata;
}

export {
  imageToDownload,
  getImageDimensionsByString,
  getImageDimensionsByFile,
  extractMediaMetadata,
};
