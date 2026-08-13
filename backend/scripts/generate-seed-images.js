const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const colors = ['#4f46e5', '#7c3aed', '#06b6d4', '#f59e0b', '#10b981', '#ec4899'];

function slide(icon, title, sub, c1, c2) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="800" fill="url(#g)"/>
  <circle cx="1050" cy="180" r="220" fill="#ffffff" opacity="0.12"/>
  <circle cx="180" cy="620" r="260" fill="#ffffff" opacity="0.10"/>
  <circle cx="640" cy="400" r="150" fill="#ffffff" opacity="0.15"/>
  <text x="640" y="200" font-family="Segoe UI, Tahoma, sans-serif" font-size="120" fill="#ffffff" text-anchor="middle" opacity="0.9">${icon}</text>
  <text x="640" y="420" font-family="Segoe UI, Tahoma, sans-serif" font-size="52" font-weight="bold" fill="#ffffff" text-anchor="middle">${title}</text>
  <text x="640" y="490" font-family="Segoe UI, Tahoma, sans-serif" font-size="28" fill="#ffffff" opacity="0.85" text-anchor="middle">${sub}</text>
</svg>`;
}

const files = {
  'slide1.svg': slide('🚀', 'Software Engineer', 'Building great digital products', colors[0], colors[1]),
  'slide2.svg': slide('💻', 'Full-Stack Development', 'React  Node  MySQL  Cloud', colors[2], colors[0]),
  'slide3.svg': slide('🤝', "Let's Build Together", 'Available for freelance and full-time', colors[4], colors[2]),
  'project1.svg': slide('🛒', 'E-Commerce Platform', 'Storefront, payments & analytics', colors[3], colors[5]),
  'project2.svg': slide('🤖', 'AI Chat Assistant', 'RAG-powered conversational AI', colors[2], colors[4]),
  'project3.svg': slide('📱', 'Task Manager', 'Cross-platform productivity app', colors[5], colors[1]),
  'post1.svg': slide('📝', 'Scaling Node.js', 'Lessons from production', colors[1], colors[2]),
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name), content);
  console.log('wrote', name);
}
console.log('Seed images generated in backend/uploads/');