function compressImage(base64, maxSizeKB = 600) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = "data:image/jpeg;base64," + base64;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      let width = img.width;
      let height = img.height;

      const scale = Math.sqrt((maxSizeKB * 1024) / (base64.length * 0.75));
      if (scale < 1) {
        width *= scale;
        height *= scale;
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.8).split(",")[1]);
    };
  });
}
