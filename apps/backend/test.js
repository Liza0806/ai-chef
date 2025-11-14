import fetch from 'node-fetch';
globalThis.fetch = fetch;

import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

console.log('TensorFlow.js Node успешно подключен, версия:', tf.version.tfjs);
