/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { NlpManager } from 'node-nlp';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

@Injectable()
export class TaggingService {
  private manager: NlpManager;

  constructor() {
    this.manager = new NlpManager({ languages: ['en'], forceNER: true });
  }

  /**
   * Fetch and clean page content
   */
  private async fetchPageText(url: string): Promise<string> {
    try {
      const { data } = await axios.get(url, { timeout: 5000 });
      const $ = cheerio.load(data);

      // Remove scripts, styles, nav, footer
      $('script, style, nav, footer').remove();

      // Get visible text
      const text = $('body').text();
      return text.replace(/\s+/g, ' ').trim();
    } catch (error) {
      console.error('error', error);
      console.warn('Failed to fetch page content:', (error as Error).message);
      return '';
    }
  }

  private extractReadableText(html: string, url: string): string {
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    // article.textContent = cleaned, readable text
    return article?.textContent || '';
  }

  private cleanText(str: string): string {
    return str.replace(/\s+/g, ' ').replace(/\n+/g, ' ').trim();
  }

  /**
   * Generate ML tags from bookmark content
   */
  async generateTags(url: string, topN = 5): Promise<string[]> {
    console.log('generateTags', url, topN);
    // Fetch page content
    const pageText = await this.fetchPageText(url);
    const readableText = this.extractReadableText(pageText, url);
    const textToClassify = this.cleanText(readableText);
    console.log('textToClassify', textToClassify);
    if (!textToClassify) return ['Untitled']; // fallback

    // Run zero-shot classification
    const result = await this.manager.process('en', textToClassify);
    console.log('result', result);
    // Safely handle result in case of error
    if (
      !result ||
      typeof result !== 'object' ||
      !Array.isArray(result.entities)
    ) {
      console.warn(
        'Tagging failed: unexpected result from NLP manager',
        result,
      );
      return [];
    }
    // Extract the 'tag' from NLP entities, filter to unique tag names, limit to topN
    const tags = result.entities
      .map((entity: any) => entity.option || entity.text || entity.entity)
      .filter((tag: any) => typeof tag === 'string' && tag.trim().length > 0);

    // Remove duplicates and limit to topN
    const uniqueTags = [...new Set(tags as string[])].slice(0, topN);
    console.log('uniqueTags', uniqueTags);
    return uniqueTags;
  }
}
