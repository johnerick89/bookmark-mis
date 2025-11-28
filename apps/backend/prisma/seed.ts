import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';

const initialTags = [
  // Technology
  'javascript',
  'typescript',
  'nodejs',
  'react',
  'nest.js',
  'next.js',
  'web3',
  'blockchain',
  'solidity',
  // Productivity
  'productivity',
  'notes',
  'bookmark',
  'task management',
  'calendar',
  'todo',
  'project management',
  // AI / ML
  'artificial intelligence',
  'machine learning',
  'deep learning',
  'neural networks',
  'nlp',
  'computer vision',
  // Design
  'ui',
  'ux',
  'design systems',
  'figma',
  'adobe',
  'illustrator',
  'photoshop',
  'graphic design',
  // Finance
  'finance',
  'investment',
  'crypto',
  'stocks',
  'trading',
  'personal finance',
  'banking',
  'fintech',
  // Education
  'education',
  'learning',
  'online courses',
  'tutorials',
  'books',
  'programming',
  'study',
  // Health
  'health',
  'fitness',
  'nutrition',
  'wellness',
  'mental health',
  'meditation',
  'exercise',
  // Science
  'science',
  'physics',
  'chemistry',
  'biology',
  'astronomy',
  'research',
  'space',
  // Misc
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
  private prisma: PrismaService;
  constructor(private config: ConfigService) {
    this.prisma = new PrismaService(this.config);
  }

  async seedTags(): Promise<void> {
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
      } catch (error) {
        console.error(`Error seeding tag "${name}":`, error);
      }
    }

    console.log(
      `✅ Seeded tags successfully. Created: ${created}, Skipped: ${skipped}`,
    );
  }

  async run(): Promise<void> {
    try {
      await this.seedTags();
    } catch (error) {
      console.error('Error during seeding:', error);
      throw error;
    }
  }
}

async function main() {
  const seedService = new SeedService(new ConfigService());
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
