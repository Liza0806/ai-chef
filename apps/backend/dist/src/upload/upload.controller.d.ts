import { RecognizeService } from '../recognize/recognize.service';
export declare class UploadController {
    private readonly recognizeService;
    constructor(recognizeService: RecognizeService);
    uploadFile(file: Express.Multer.File): Promise<{
        success: boolean;
        predictions: import("@tensorflow-models/coco-ssd").DetectedObject[];
        error?: undefined;
        details?: undefined;
    } | {
        error: string;
        details: any;
        success?: undefined;
        predictions?: undefined;
    }>;
}
