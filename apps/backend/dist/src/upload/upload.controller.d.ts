import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadFile(file: Express.Multer.File): Promise<{
        success: boolean;
        result: {
            message: string;
            data: import("@tensorflow-models/coco-ssd").DetectedObject[];
        };
    }>;
}
