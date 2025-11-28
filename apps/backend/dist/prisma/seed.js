"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_service_1 = require("./prisma.service");
const config_1 = require("@nestjs/config");
const initialTags = [
    'javascript',
    'typescript',
    'nodejs',
    'react',
    'nest.js',
    'next.js',
    'web3',
    'blockchain',
    'solidity',
    'productivity',
    'notes',
    'bookmark',
    'task management',
    'calendar',
    'todo',
    'project management',
    'artificial intelligence',
    'machine learning',
    'deep learning',
    'neural networks',
    'nlp',
    'computer vision',
    'ui',
    'ux',
    'design systems',
    'figma',
    'adobe',
    'illustrator',
    'photoshop',
    'graphic design',
    'finance',
    'investment',
    'crypto',
    'stocks',
    'trading',
    'personal finance',
    'banking',
    'fintech',
    'education',
    'learning',
    'online courses',
    'tutorials',
    'books',
    'programming',
    'study',
    'health',
    'fitness',
    'nutrition',
    'wellness',
    'mental health',
    'meditation',
    'exercise',
    'science',
    'physics',
    'chemistry',
    'biology',
    'astronomy',
    'research',
    'space',
    'news',
    'blog',
    'article',
    'video',
    'podcast',
    'entertainment',
    'music',
    'movies',
    'sports',
    'travel',
];
class SeedService {
    config;
    prisma;
    constructor(config) {
        this.config = config;
        this.prisma = new prisma_service_1.PrismaService(this.config);
    }
    async seedTags() {
        console.log('Starting to seed tags...');
        let created = 0;
        let skipped = 0;
        for (const name of initialTags) {
            try {
                const normalizedName = name.trim().toLowerCase();
                const existingTag = await this.prisma.tag.findUnique({
                    where: { name: normalizedName },
                });
                if (existingTag) {
                    skipped++;
                    continue;
                }
                await this.prisma.tag.create({
                    data: { name: normalizedName },
                });
                created++;
            }
            catch (error) {
                console.error(`Error seeding tag "${name}":`, error);
            }
        }
        console.log(`✅ Seeded tags successfully. Created: ${created}, Skipped: ${skipped}`);
    }
    async run() {
        try {
            await this.seedTags();
        }
        catch (error) {
            console.error('Error during seeding:', error);
            throw error;
        }
    }
}
async function main() {
    const seedService = new SeedService(new config_1.ConfigService());
    await seedService.run();
}
main()
    .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
})
    .finally(() => {
    console.log('Seed completed');
});
//# sourceMappingURL=seed.js.map