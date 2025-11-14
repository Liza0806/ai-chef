import * as cocoSsd from '@tensorflow-models/coco-ssd';
export declare class RecognizeService {
    private model;
    private readonly logger;
    private readonly modelUrl;
    loadModel(): Promise<cocoSsd.ObjectDetection>;
    recognize(imageBuffer: Buffer): Promise<cocoSsd.DetectedObject[]>;
}
export declare class AppModule {
}
