import * as cocoSsd from '@tensorflow-models/coco-ssd';
export declare class RecognizeService {
    private model;
    private readonly logger;
    loadModel(): Promise<void>;
    recognize(buffer: Buffer): Promise<cocoSsd.DetectedObject[]>;
}
