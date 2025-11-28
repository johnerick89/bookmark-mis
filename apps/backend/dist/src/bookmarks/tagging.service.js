"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaggingService = void 0;
const common_1 = require("@nestjs/common");
const node_nlp_1 = require("node-nlp");
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const jsdom_1 = require("jsdom");
const readability_1 = require("@mozilla/readability");
let TaggingService = class TaggingService {
    manager;
    constructor() {
        this.manager = new node_nlp_1.NlpManager({ languages: ['en'], forceNER: true });
    }
    async fetchPageText(url) {
        try {
            const { data } = await axios_1.default.get(url, { timeout: 5000 });
            const $ = cheerio.load(data);
            $('script, style, nav, footer').remove();
            const text = $('body').text();
            return text.replace(/\s+/g, ' ').trim();
        }
        catch (error) {
            console.error('error', error);
            console.warn('Failed to fetch page content:', error.message);
            return '';
        }
    }
    extractReadableText(html, url) {
        const dom = new jsdom_1.JSDOM(html, { url });
        const reader = new readability_1.Readability(dom.window.document);
        const article = reader.parse();
        return article?.textContent || '';
    }
    cleanText(str) {
        return str.replace(/\s+/g, ' ').replace(/\n+/g, ' ').trim();
    }
    async generateTags(url, topN = 5) {
        console.log('generateTags', url, topN);
        const pageText = await this.fetchPageText(url);
        const readableText = this.extractReadableText(pageText, url);
        const textToClassify = this.cleanText(readableText);
        console.log('textToClassify', textToClassify);
        if (!textToClassify)
            return ['Untitled'];
        const result = await this.manager.process('en', textToClassify);
        console.log('result', result);
        if (!result ||
            typeof result !== 'object' ||
            !Array.isArray(result.entities)) {
            console.warn('Tagging failed: unexpected result from NLP manager', result);
            return [];
        }
        const tags = result.entities
            .map((entity) => entity.option || entity.text || entity.entity)
            .filter((tag) => typeof tag === 'string' && tag.trim().length > 0);
        const uniqueTags = [...new Set(tags)].slice(0, topN);
        console.log('uniqueTags', uniqueTags);
        return uniqueTags;
    }
};
exports.TaggingService = TaggingService;
exports.TaggingService = TaggingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TaggingService);
//# sourceMappingURL=tagging.service.js.map