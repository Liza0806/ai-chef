import { RecognizeService } from './recognize.service';
import { ModuleRef } from '@nestjs/core';
export declare class RecognizeController {
    private readonly recognizeService;
    private readonly moduleRef;
    constructor(recognizeService: RecognizeService, moduleRef: ModuleRef);
    getRecipes(ingredientsQuery?: string): Promise<any>;
    recognize(file: Express.Multer.File): Promise<import("@tensorflow-models/coco-ssd").DetectedObject[] | {
        error: string;
        details?: undefined;
    } | {
        error: string;
        details: any;
    }>;
}
