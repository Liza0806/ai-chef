// import fs from 'fs/promises';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const MODEL_DIR = path.join(__dirname, '../models/coco-ssd');
// const MODEL_URL = 'https://storage.googleapis.com/tfjs-models/savedmodel/ssd_mobilenet_v2/';

// const FILES = [
//   'model.json',
//   'group1-shard1of5.bin',
//   'group1-shard2of5.bin',
//   'group1-shard3of5.bin',
//   'group1-shard4of5.bin',
//   'group1-shard5of5.bin',
// ];

// async function downloadFile(url, dest) {
//   const res = await fetch(url);

//   if (!res.ok) {
//     throw new Error(`Ошибка при скачивании ${url}: ${res.status} ${res.statusText}`);
//   }

//   const arrayBuffer = await res.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);
//   await fs.writeFile(dest, buffer);
// }

// (async () => {
//   await fs.mkdir(MODEL_DIR, { recursive: true });

//   console.log('⬇️  Скачивание COCO-SSD модели...');

//   for (const file of FILES) {
//     const url = `${MODEL_URL}${file}`;
//     const dest = path.join(MODEL_DIR, file);

//     try {
//       // Если файл уже есть — пропускаем
//       await fs.access(dest);
//       console.log(`✅ ${file} уже существует, пропускаем`);
//       continue;
//     } catch {
//       console.log(`📦 Скачиваем ${file}...`);
//     }

//     try {
//       await downloadFile(url, dest);
//       console.log(`✅ Успешно скачано: ${file}`);
//     } catch (err) {
//       console.error(`❌ Ошибка при скачивании ${file}: ${err.message}`);
//     }
//   }

//   console.log('🎉 Модель полностью скачана в ./models/coco-ssd');
// })();
import fs from "fs";
import https from "https";
import path from "path";

const modelDir = path.resolve("./models/coco-ssd");
const baseUrl = "https://storage.googleapis.com/tfjs-models/savedmodel/ssd_mobilenet_v2/";

if (!fs.existsSync(modelDir)) {
  fs.mkdirSync(modelDir, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(
          new Error(
            `Ошибка при скачивании ${url}: ${response.statusCode} ${response.statusMessage}`
          )
        );
        return;
      }
      response.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

// Проверяем, что файл существует и имеет размер > 0
function isFileValid(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).size > 0;
}

async function downloadModel() {
  console.log("⬇️  Скачивание COCO-SSD модели...");

  const modelJsonPath = path.join(modelDir, "model.json");
  const modelJsonUrl = baseUrl + "model.json";

  // Скачиваем model.json
  console.log("📦 Скачиваем model.json...");
  if (!isFileValid(modelJsonPath)) {
    try {
      await downloadFile(modelJsonUrl, modelJsonPath);
      console.log("✅ Успешно скачано: model.json");
    } catch (err) {
      console.error("❌ Ошибка при скачивании model.json:", err.message);
      return;
    }
  } else {
    console.log("✅ model.json уже скачан");
  }

  // Читаем model.json и достаем список файлов весов
  const modelJson = JSON.parse(fs.readFileSync(modelJsonPath, "utf8"));
  const shardFiles = modelJson.weightsManifest.flatMap((m) => m.paths);

  // Скачиваем каждый файл весов с проверкой размера
  for (const shard of shardFiles) {
    const url = baseUrl + shard;
    const dest = path.join(modelDir, shard);

    if (isFileValid(dest)) {
      console.log(`✅ ${shard} уже скачан и валиден`);
      continue;
    }

    console.log(`📦 Скачиваем ${shard}...`);
    let success = false;
    let attempts = 0;
    while (!success && attempts < 3) {
      attempts++;
      try {
        await downloadFile(url, dest);
        if (!isFileValid(dest)) throw new Error("Файл пустой после скачивания");
        console.log(`✅ Успешно скачано: ${shard}`);
        success = true;
      } catch (err) {
        console.error(`❌ Ошибка при скачивании ${shard} (попытка ${attempts}): ${err.message}`);
        if (attempts < 3) console.log("⏳ Пытаемся снова...");
      }
    }

    if (!success) {
      console.error(`❌ Не удалось скачать ${shard} после 3 попыток`);
    }
  }

  console.log("🎉 Модель полностью скачана в ./models/coco-ssd");
}

downloadModel();
