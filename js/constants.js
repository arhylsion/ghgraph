export const WEEKS = 52;
export const DAYS = 7;
export const LEVEL_COMMITS = { 0: 0, 1: 1, 2: 3, 3: 6, 4: 10 };
export const START_DATE = new Date('2024-06-02T00:00:00Z');

export const OS_COMMANDS = {
  windows: {
    download: 'curl.exe -O https://raw.githubusercontent.com/arhylsion/ghgraph/main/ghgraph.py',
    token: '$env:GITHUB_TOKEN = "ghp_your_token_here"'
  },
  unix: {
    download: 'curl -O https://raw.githubusercontent.com/arhylsion/ghgraph/main/ghgraph.py',
    token: 'export GITHUB_TOKEN="ghp_your_token_here"'
  }
};

export const SIMPLE_ICONS_CDN = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/';
export const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const STUDIO_CARDS = [
  { id: 'heatmap', label: 'Heatmap', desc: 'Animated 52-week contribution graph' },
  { id: 'hero', label: 'Hero Banner', desc: 'Editorial intro with avatar & headline' },
  { id: 'stack', label: 'Tech Stack', desc: 'Dynamic Simple Icons tool pills' },
  { id: 'project', label: 'Project', desc: 'Drag-and-drop bento work canvas & icon picker' },
  { id: 'contact', label: 'Contact', desc: 'Social media links with Simple Icons' },
  { id: 'quote', label: 'Dev Quote', desc: 'M3 styled random or custom dev quote' }
];

export const DEV_QUOTES = [
  { text: 'Within a computer, natural language is unnatural.', author: 'Alan Perlis' },
  { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
  { text: 'Simplicity is prerequisite for reliability.', author: 'Edsger W. Dijkstra' },
  { text: 'Programs must be written for people to read, and only incidentally for machines to execute.', author: 'Harold Abelson' },
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
  { text: 'Premature optimization is the root of all evil.', author: 'Donald Knuth' },
  { text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', author: 'Martin Fowler' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'Code is like humor. When you have to explain it, it is bad.', author: 'Cory House' },
  { text: 'Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.', author: 'Antoine de Saint-Exupery' },
  { text: 'Controlling complexity is the essence of computer programming.', author: 'Brian Kernighan' },
  { text: 'The best error message is the one that never shows up.', author: 'Thomas Fuchs' }
];

export const QUICK_PICK_TECHS = [
  'TypeScript', 'Python', 'React', 'Next.js', 'React Native', 'Expo',
  'Node.js', 'Vite', 'Astro', 'Tailwind CSS', 'PostgreSQL', 'Supabase',
  'Docker', 'Cursor', 'Claude', 'n8n', 'Go', 'Rust', 'Figma', 'Git'
];

export const QUICK_PICK_SOCIALS = [
  { name: 'GitHub', url: 'https://github.com/username' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/username' },
  { name: 'X', url: 'https://x.com/username' },
  { name: 'Instagram', url: 'https://instagram.com/username' },
  { name: 'WhatsApp', url: 'https://wa.me/628123456789' },
  { name: 'Luma', url: 'https://lu.ma/username' },
  { name: 'Discord', url: 'https://discord.com/users/username' },
  { name: 'YouTube', url: 'https://youtube.com/@username' },
  { name: 'Telegram', url: 'https://t.me/username' },
  { name: 'Gmail', url: 'mailto:you@example.com' },
  { name: 'Bluesky', url: 'https://bsky.app/profile/username' },
  { name: 'Threads', url: 'https://threads.net/@username' }
];

export const QUICK_PICK_PROJECT_ICONS = [
  { slug: 'sparkles', label: 'Sparkles' },
  { slug: 'terminal', label: 'Terminal' },
  { slug: 'code', label: 'Code' },
  { slug: 'globe', label: 'Web' },
  { slug: 'layers', label: 'Layers' },
  { slug: 'mobile', label: 'Mobile' },
  { slug: 'desktop', label: 'Desktop' },
  { slug: 'cube', label: '3D' },
  { slug: 'bolt', label: 'Bolt' },
  { slug: 'palette', label: 'Design' },
  { slug: 'database', label: 'Data' },
  { slug: 'rocket', label: 'Rocket' },
  { slug: 'github', label: 'GitHub' },
  { slug: 'react', label: 'React' },
  { slug: 'nextdotjs', label: 'Next.js' },
  { slug: 'figma', label: 'Figma' },
  { slug: 'apple', label: 'macOS' },
  { slug: 'openai', label: 'AI' },
  { slug: 'vercel', label: 'Vercel' },
  { slug: 'rust', label: 'Rust' }
];
