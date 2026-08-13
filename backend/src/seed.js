const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

async function seedAdmin(query) {
  const email = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
  const rows = await query('SELECT id FROM users WHERE email = ?', [email]);
  if (rows.length === 0) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    await query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [process.env.ADMIN_NAME || 'Admin', email, hash, 'admin']
    );
    console.log(`Created admin user: ${email} (password: ${process.env.ADMIN_PASSWORD || 'admin123'})`);
  }
}

async function seedAbout(query) {
  const rows = await query('SELECT id FROM about WHERE id = 1');
  if (rows.length > 0) return;
  await query(
    `INSERT INTO about (id, first_name, last_name, title_en, title_ar, headline_en, headline_ar,
      bio_en, bio_ar, location_en, location_ar, email, phone, years_experience,
      projects_completed, clients_served, certification_count, available_for_hire,
      languages_en, languages_ar, hobbies_en, hobbies_ar)
     VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'John',
      'Developer',
      'Software Engineer',
      'مهندس برمجيات',
      'I build fast, scalable, beautiful web & mobile applications.',
      'أبني تطبيقات ويب وموبايل سريعة وقابلة للتوسع وواجهات جميلة.',
      'Passionate software engineer with a focus on full-stack development, cloud infrastructure and clean, maintainable code.',
      'مهندس برمجيات شغوف بتطوير الويب الكامل والبنية التحتية السحابية وكتابة كود نظيف وقابل للصيانة.',
      'Cairo, Egypt',
      'القاهرة، مصر',
      'hello@example.com',
      '+20 100 000 0000',
      5,
      40,
      12,
      15,
      1,
      'Arabic (Native), English (Fluent)',
      'العربية (اللغة الأم)، الإنجليزية (طلاقة)',
      'Reading, Football, Open Source',
      'القراءة، كرة القدم، المصادر المفتوحة',
    ]
  );
}

async function seedSampleData(query) {
  const { collections } = require('./config/collections');
  const { buildTableSQL } = require('./config/schema');

  const samples = {
    slides: [
      { title_en: 'Welcome to my Portfolio', title_ar: 'مرحباً بكم في ملفي الشخصي', subtitle_en: 'Software Engineer & Problem Solver', subtitle_ar: 'مهندس برمجيات وحلّ المشكلات', image: '/uploads/slide1.svg', active: 1, sort_order: 1 },
      { title_en: 'Full-Stack Development', title_ar: 'تطوير الويب الكامل', subtitle_en: 'React · Node.js · MySQL · Cloud', subtitle_ar: 'رياكت · نود جي إس · ماي إس كيو إل · السحابة', image: '/uploads/slide2.svg', active: 1, sort_order: 2 },
      { title_en: "Let's Build Something Great", title_ar: 'لنبنِ شيئاً رائعاً معاً', subtitle_en: 'Available for freelance & full-time', subtitle_ar: 'متاح للعمل الحر والوظائف بدوام كامل', image: '/uploads/slide3.svg', active: 1, sort_order: 3 },
    ],
    skills: [
      { name_en: 'JavaScript / TypeScript', name_ar: 'جافا سكريبت / تايب سكريبت', category: 'Languages', icon: 'fa-brands fa-js', level: 95, sort_order: 1 },
      { name_en: 'React & Next.js', name_ar: 'رياكت و نيكست', category: 'Frameworks', icon: 'fa-brands fa-react', level: 92, sort_order: 2 },
      { name_en: 'Node.js & Express', name_ar: 'نود جي إس و إكسبريس', category: 'Frameworks', icon: 'fa-brands fa-node', level: 90, sort_order: 3 },
      { name_en: 'MySQL & PostgreSQL', name_ar: 'ماي إس كيو إل و بوستجري', category: 'Databases', icon: 'fa-solid fa-database', level: 88, sort_order: 4 },
      { name_en: 'Docker & DevOps', name_ar: 'دوكر و ديف أوبس', category: 'Tools', icon: 'fa-brands fa-docker', level: 80, sort_order: 5 },
      { name_en: 'Git & CI/CD', name_ar: 'جيت و سي آي/سي دي', category: 'Tools', icon: 'fa-brands fa-git-alt', level: 90, sort_order: 6 },
    ],
    projects: [
      {
        title_en: 'E-Commerce Platform', title_ar: 'منصة التجارة الإلكترونية',
        summary_en: 'A full-featured storefront with payments, admin panel and analytics.',
        summary_ar: 'متجر إلكتروني متكامل مع مدفوعات ولوحة تحكم وتحليلات.',
        description_en: 'Built with React, Node.js and MySQL. Includes Stripe integration, inventory management, order tracking and a real-time admin dashboard.',
        description_ar: 'بُنيت باستخدام رياكت ونود جي إس وماي إس كيو إل. تشمل تكامل سترايب وإدارة المخزون وتتبع الطلبات ولوحة تحكم فورية.',
        category: 'Web App', tech_stack: '["React","Node.js","MySQL","Stripe"]',
        image: '/uploads/project1.svg', github_url: 'https://github.com/', live_url: 'https://example.com',
        start_date: '2024-01-15', end_date: '2024-08-30', featured: 1, published: 1, sort_order: 1,
      },
      {
        title_en: 'AI Chat Assistant', title_ar: 'مساعد دردشة ذكي',
        summary_en: 'Conversational AI assistant with RAG pipeline and vector search.',
        summary_ar: 'مساعد ذكاء اصطناعي محادثة مع خط استرجاع وبحث متجه.',
        description_en: 'RAG-powered assistant using OpenAI, Pinecone and FastAPI with a React front-end.',
        description_ar: 'مساعد مدعوم بخط الاسترجاع المعزز باستخدام أوبن إيه آي و بينكون و فاست آي بي آي مع واجهة رياكت.',
        category: 'AI / ML', tech_stack: '["React","Python","OpenAI","Pinecone"]',
        image: '/uploads/project2.svg', github_url: 'https://github.com/', live_url: 'https://example.com',
        start_date: '2024-09-01', end_date: '2025-02-15', featured: 1, published: 1, sort_order: 2,
      },
      {
        title_en: 'Task Manager Mobile App', title_ar: 'تطبيق إدارة المهام',
        summary_en: 'Cross-platform productivity app with offline-first sync.',
        summary_ar: 'تطبيق إنتاجية متعدد المنصات مع مزامنة تعمل دون اتصال.',
        description_en: 'React Native app with Redux Toolkit, offline persistence and real-time collaboration via WebSockets.',
        description_ar: 'تطبيق رياكت نيتيف مع ريدكس وحفظ دون اتصال وتعاون فوري عبر ويب سوكيت.',
        category: 'Mobile', tech_stack: '["React Native","Redux","WebSockets"]',
        image: '/uploads/project3.svg', github_url: 'https://github.com/', live_url: 'https://example.com',
        start_date: '2025-03-01', end_date: '2025-07-01', featured: 0, published: 1, sort_order: 3,
      },
    ],
    experiences: [
      {
        role_en: 'Senior Software Engineer', role_ar: 'مهندس برمجيات أول',
        company: 'Tech Corp', location_en: 'Remote', location_ar: 'عن بُعد',
        description_en: 'Leading a team of 6 engineers building a SaaS platform serving 100k+ users.',
        description_ar: 'قيادة فريق من 6 مهندسين لبناء منصة SaaS تخدم أكثر من 100 ألف مستخدم.',
        start_date: '2023-02-01', current: 1, sort_order: 1,
      },
      {
        role_en: 'Full-Stack Developer', role_ar: 'مطور ويب كامل',
        company: 'StartupHub', location_en: 'Cairo, Egypt', location_ar: 'القاهرة، مصر',
        description_en: 'Developed microservices and dashboards for multiple early-stage products.',
        description_ar: 'تطوير خدمات مصغرة ولوحات تحكم لمنتجات متعددة في مراحلها المبكرة.',
        start_date: '2020-06-01', end_date: '2023-01-31', current: 0, sort_order: 2,
      },
    ],
    trophies: [
      { title_en: 'Best Innovation Award', title_ar: 'جائزة أفضل ابتكار', description_en: 'Winner at the National Tech Hackathon 2024.', description_ar: 'فائز في الهاكاثون التقني الوطني 2024.', issuer: 'TechSummit', year: 2024, sort_order: 1 },
      { title_en: 'Top 10 Developer', title_ar: 'أفضل 10 مطورين', description_en: 'Recognized among the top 10 developers in the region.', description_ar: 'تم التكريم ضمن أفضل 10 مطورين في المنطقة.', issuer: 'DevCommunity', year: 2023, sort_order: 2 },
    ],
    certificates: [
      { title_en: 'AWS Solutions Architect', title_ar: 'مهندس حلول AWS', issuer: 'Amazon Web Services', description_en: 'Cloud architecture & design best practices.', description_ar: 'أفضل ممارسات معمارية وتصميم السحابة.', credential_url: 'https://example.com', issue_date: '2024-05-10', sort_order: 1 },
      { title_en: 'Meta Front-End Developer', title_ar: 'مطور واجهات ميتا', issuer: 'Coursera / Meta', description_en: 'Advanced front-end development with React.', description_ar: 'تطوير متقدم للواجهات باستخدام رياكت.', credential_url: 'https://example.com', issue_date: '2023-09-01', sort_order: 2 },
    ],
    participations: [
      { title_en: 'Global AI Hackathon', title_ar: 'هاكاثون الذكاء الاصطناعي العالمي', event_type: 'Hackathon', role_en: 'Team Lead', role_ar: 'قائد فريق', description_en: 'Led a team to build an AI-powered accessibility tool in 48 hours.', description_ar: 'قُدت فريقاً لبناء أداة وصول مدعومة بالذكاء الاصطناعي خلال 48 ساعة.', date: '2025-03-20', link: 'https://example.com', sort_order: 1 },
      { title_en: 'Open Source Conference', title_ar: 'مؤتمر المصادر المفتوحة', event_type: 'Conference', role_en: 'Speaker', role_ar: 'متحدث', description_en: 'Gave a talk on building maintainable React applications.', description_ar: 'قدمت محاضرة عن بناء تطبيقات رياكت قابلة للصيانة.', date: '2024-11-05', link: 'https://example.com', sort_order: 2 },
    ],
    services: [
      { title_en: 'Web Development', title_ar: 'تطوير الويب', description_en: 'Modern, responsive web applications using the latest stack.', description_ar: 'تطبيقات ويب حديثة ومتجاوبة باستخدام أحدث التقنيات.', icon: 'fa-solid fa-code', sort_order: 1 },
      { title_en: 'API Design', title_ar: 'تصميم واجهات برمجية', description_en: 'Scalable REST & GraphQL APIs with clean documentation.', description_ar: 'واجهات REST و GraphQL قابلة للتوسع مع توثيق واضح.', icon: 'fa-solid fa-plug', sort_order: 2 },
      { title_en: 'Cloud & DevOps', title_ar: 'السحابة و DevOps', description_en: 'CI/CD pipelines, Docker, Kubernetes and monitoring.', description_ar: 'خطوط CI/CD و دوكر و كوبرنيتيس والمراقبة.', icon: 'fa-solid fa-cloud', sort_order: 3 },
    ],
    testimonials: [
      { name: 'Sarah Ahmed', role_en: 'Product Manager', role_ar: 'مديرة المنتج', company: 'Tech Corp', content_en: 'One of the most reliable engineers I have worked with. Delivers high quality work on time.', content_ar: 'من أكثر المهندسين موثوقية الذين عملت معهم. يسلّم عملاً عالي الجودة في الوقت المحدد.', sort_order: 1 },
      { name: 'Omar Khaled', role_en: 'CTO', role_ar: 'مدير تقني', company: 'StartupHub', content_en: 'Brilliant problem solver with a deep understanding of the full stack.', content_ar: 'حلّال مشاكل بارع مع فهم عميق لتقنيات الويب الكامل.', sort_order: 2 },
    ],
    posts: [
      {
        title_en: 'Scaling Node.js Apps in Production', title_ar: 'توسيع تطبيقات نود جي إس في الإنتاج',
        excerpt_en: 'Lessons learned scaling a service to 100k users.',
        excerpt_ar: 'دروس مستفادة من توسيع خدمة لتخدم 100 ألف مستخدم.',
        content_en: '# Scaling Node.js\nUse clustering, load balancers and caching wisely...',
        content_ar: '# توسيع نود جي إس\nاستخدم التجميع وموازنات الحمل والتخزين المؤقت بحكمة...',
        category: 'Engineering', image: '/uploads/post1.svg', published: 1, sort_order: 1,
      },
    ],
    educations: [
      { degree_en: 'B.Sc. Computer Science', degree_ar: 'بكالوريوس علوم الحاسب', institution: 'Cairo University', field_en: 'Computer Science', field_ar: 'علوم الحاسب', start_date: '2016-09-01', end_date: '2020-06-01', sort_order: 1 },
    ],
    socials: [
      { label: 'GitHub', url: 'https://github.com/', icon: 'fa-brands fa-github', sort_order: 1 },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/', icon: 'fa-brands fa-linkedin', sort_order: 2 },
      { label: 'Twitter / X', url: 'https://x.com/', icon: 'fa-brands fa-x-twitter', sort_order: 3 },
    ],
  };

  let inserted = 0;
  for (const [key, items] of Object.entries(samples)) {
    const coll = collections[key];
    if (!coll) continue;
    const count = await query(`SELECT COUNT(*) as c FROM \`${coll.table}\``);
    if (count[0].c > 0) continue;
    for (const item of items) {
      const cols = Object.keys(item);
      await query(
        `INSERT INTO \`${coll.table}\` (${cols.map((c) => `\`${c}\``).join(',')}) VALUES (${cols.map(() => '?').join(',')})`,
        Object.values(item)
      );
      inserted++;
    }
  }
  if (inserted) console.log(`Seeded ${inserted} sample items.`);
}

module.exports = { seedAdmin, seedAbout, seedSampleData, seedAll: async (query) => {
  await seedAdmin(query);
  await seedAbout(query);
  await seedSampleData(query);
} };