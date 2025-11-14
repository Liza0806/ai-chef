import { RecognizeService } from '../recognize/recognize.service';
export declare class UploadService {
    private readonly recognizeService;
    private readonly logger;
    constructor(recognizeService: RecognizeService);
    processFile(filePath: string): Promise<{
        message: string;
        data: import("@tensorflow-models/coco-ssd").DetectedObject[];
    }>;
}
