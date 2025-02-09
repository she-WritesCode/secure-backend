import { Product } from '../schemas/product.schema';
import { ProductRepository } from '../product.repository';

export const seedProducts = async (productRepository: ProductRepository) => {
  const count = await productRepository.count();
  if (count >= 1) {
    return;
  }
  const products: Partial<Product>[] = [
    {
      name: '404 Not Found T-Shirt',
      description:
        "Perfect for those days when you just can't be located. A classic web error turned into wearable humor.",
      price: 29.99,
      quantity: 100,
      category: 'Programming Humor',
      tags: ['web development', 'HTTP errors', 'coding humor'],
      imageUrl: '/404-shirt.jpg',
      isActive: true,
    },
    {
      name: 'Hello World! T-Shirt',
      description:
        'The classic first program everyone writes, now on a comfortable cotton blend shirt.',
      price: 24.99,
      quantity: 150,
      category: 'Programming Basics',
      tags: ['beginner friendly', 'programming basics', 'classic code'],
      imageUrl: '/hello-world-shirt.jpg',
      isActive: true,
    },
    {
      name: 'Coffee.forEach(drink) T-Shirt',
      description:
        "For JavaScript lovers who can't start coding without their coffee.",
      price: 27.99,
      quantity: 80,
      category: 'JavaScript',
      tags: ['javascript', 'coffee', 'programming lifestyle'],
      imageUrl: '/coffee-foreach-shirt.jpg',
      isActive: true,
    },
    {
      name: 'CSS Is Awesome T-Shirt',
      description:
        'A humorous take on CSS overflow issues, featuring the classic overflow box joke.',
      price: 25.99,
      quantity: 120,
      category: 'Web Development',
      tags: ['css', 'web design', 'frontend'],
      imageUrl: '/css-awesome-shirt.jpg',
      isActive: true,
    },
    {
      name: 'Git Push --Force T-Shirt',
      description:
        'Living dangerously? Show it with this shirt. (Warning: Wear at your own risk!)',
      price: 26.99,
      quantity: 90,
      category: 'Version Control',
      tags: ['git', 'version control', 'dangerous code'],
      imageUrl: '/git-push-force-shirt.jpg',
      isActive: true,
    },
    {
      name: 'Node.js Ninja T-Shirt',
      description:
        'For the backend developer who moves silently through asynchronous code.',
      price: 29.99,
      quantity: 100,
      category: 'Backend Development',
      tags: ['nodejs', 'backend', 'javascript'],
      imageUrl: '/nodejs-ninja-shirt.jpg',
      isActive: true,
    },
    {
      name: 'Try Catch Finally Sleep T-Shirt',
      description:
        'The only exception handling that matters after a long day of coding.',
      price: 28.99,
      quantity: 110,
      category: 'Programming Humor',
      tags: ['error handling', 'sleep', 'coding life'],
      imageUrl: '/try-catch-shirt.jpg',
      isActive: true,
    },
    {
      name: 'Binary Hero T-Shirt',
      description: 'Because sometimes you just need to speak in 1s and 0s.',
      price: 24.99,
      quantity: 130,
      category: 'Computer Science',
      tags: ['binary', 'computer science', 'geek wear'],
      imageUrl: '/binary-hero-shirt.jpg',
      isActive: true,
    },
    {
      name: 'React State of Mind T-Shirt',
      description: 'Keep your components pure and your state managed.',
      price: 27.99,
      quantity: 95,
      category: 'Frontend Frameworks',
      tags: ['react', 'frontend', 'javascript'],
      imageUrl: '/react-state-shirt.jpg',
      isActive: true,
    },
    {
      name: 'SQL Query Master T-Shirt',
      description: "SELECT * FROM wardrobe WHERE style = 'awesome';",
      price: 26.99,
      quantity: 85,
      category: 'Database',
      tags: ['sql', 'database', 'query'],
      imageUrl: '/sql-master-shirt.jpg',
      isActive: true,
    },
    {
      name: 'Callback Hell Survivor T-Shirt',
      description:
        'Made it through the pyramid of doom? This shirt is for you!',
      price: 25.99,
      quantity: 75,
      category: 'JavaScript',
      tags: ['javascript', 'async', 'callbacks'],
      imageUrl: '/callback-hell-shirt.jpg',
      isActive: true,
    },
    {
      name: 'Python Charmer T-Shirt',
      description:
        'Snake case styling meets actual snakes in this Python-themed design.',
      price: 28.99,
      quantity: 110,
      category: 'Python',
      tags: ['python', 'programming language', 'snake case'],
      imageUrl: '/python-charmer-shirt.jpg',
      isActive: true,
    },
    {
      name: 'Docker Captain T-Shirt',
      description: 'Container shipping has never looked this good.',
      price: 29.99,
      quantity: 80,
      category: 'DevOps',
      tags: ['docker', 'containers', 'devops'],
      imageUrl: '/docker-captain-shirt.jpg',
      isActive: true,
    },
    {
      name: 'Code Review Survivor T-Shirt',
      description:
        "For those who've faced the toughest pull request reviews and lived to tell the tale.",
      price: 26.99,
      quantity: 90,
      category: 'Development Process',
      tags: ['code review', 'git', 'team work'],
      imageUrl: '/code-review-shirt.jpg',
      isActive: true,
    },
    {
      name: 'Infinite Loop T-Shirt',
      description: 'while(true) { keepLooking(); } // This shirt is awesome!',
      price: 25.99,
      quantity: 100,
      category: 'Programming Humor',
      tags: ['loops', 'programming basics', 'humor'],
      imageUrl: '/infinite-loop-shirt.jpg',
      isActive: true,
    },
    {
      name: 'Full Stack Overflow T-Shirt',
      description:
        'Copy and paste your way to success with this stackoverflow inspired design.',
      price: 27.99,
      quantity: 120,
      category: 'Full Stack',
      tags: ['stackoverflow', 'full stack', 'development'],
      imageUrl: '/stack-overflow-shirt.jpg',
      isActive: true,
    },
    {
      name: 'Bug Hunter T-Shirt',
      description: "Finding bugs is not a problem, it's an adventure!",
      price: 28.99,
      quantity: 85,
      category: 'Quality Assurance',
      tags: ['debugging', 'testing', 'qa'],
      imageUrl: '/bug-hunter-shirt.jpg',
      isActive: true,
    },
    {
      name: 'Clean Code Guru T-Shirt',
      description:
        "Because readable code is not just a preference, it's a way of life.",
      price: 26.99,
      quantity: 95,
      category: 'Code Quality',
      tags: ['clean code', 'best practices', 'programming'],
      imageUrl: '/clean-code-shirt.jpg',
      isActive: true,
    },
    {
      name: 'Agile Ninja T-Shirt',
      description: 'Sprint through your tasks with this scrum-inspired design.',
      price: 25.99,
      quantity: 110,
      category: 'Agile Development',
      tags: ['agile', 'scrum', 'project management'],
      imageUrl: '/agile-ninja-shirt.jpg',
      isActive: true,
    },
    {
      name: 'Legacy Code Whisperer T-Shirt',
      description:
        'For those brave souls who maintain code older than themselves.',
      price: 29.99,
      quantity: 70,
      category: 'Maintenance',
      tags: ['legacy code', 'maintenance', 'debugging'],
      imageUrl: '/legacy-code-shirt.jpg',
      isActive: true,
    },
  ];

  for (const product of products) {
    await productRepository.create(product);
  }

  console.log('Products seeded successfully!');
};
