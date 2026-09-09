const fs = require("fs");
const path = require("path");

// Путь к папке со всеми изображениями товаров
const PRODUCT_IMAGES_DIRECTORY = path.join(
  __dirname,
  "..",
  "public",
  "product_img",
);

// Поддерживаемые форматы дополнительных изображений
const IMAGE_EXTENSIONS = [".jpeg", ".jpg", ".png", ".webp"];

// Получаем дополнительные изображения конкретного товара
function getProductImages(productId) {
  // Если папки с изображениями нет, возвращаем пустой массив
  if (!fs.existsSync(PRODUCT_IMAGES_DIRECTORY)) {
    return [];
  }

  // Получаем список всех файлов из папки product_img
  const files = fs.readdirSync(PRODUCT_IMAGES_DIRECTORY);

  return files
    .filter((fileName) => {
      const extension = path.extname(fileName).toLowerCase();

      // Оставляем только дополнительные изображения нужного товара
      // Например, для productId = 1: 1-1.jpeg, 1-2.jpeg, 1-3.jpeg
      return (
        fileName.startsWith(`${productId}-`) &&
        IMAGE_EXTENSIONS.includes(extension)
      );
    })
    .sort((firstFile, secondFile) =>
      // Сохраняем правильный числовой порядок изображений
      firstFile.localeCompare(secondFile, undefined, {
        numeric: true,
      }),
    )
    .map(
      // Преобразуем имя файла в публичный URL для frontend
      (fileName) => `/product_img/${fileName}`,
    );
}

module.exports = {
  getProductImages,
};
