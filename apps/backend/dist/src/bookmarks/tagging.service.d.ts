export declare class TaggingService {
    private manager;
    constructor();
    private fetchPageText;
    private extractReadableText;
    private cleanText;
    generateTags(url: string, topN?: number): Promise<string[]>;
}
