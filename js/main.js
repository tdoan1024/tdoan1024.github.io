'use strict';

// A local guide. All answers come from Tai's public portfolio biography.
const answers = {
  work: "I'm a software engineer at Nordstrom in Seattle. I build software for both customers and employees.",
  learning: "Lately, I'm exploring AI-assisted engineering — using tools like Claude Code and agentic workflows to build faster and think through system design.",
  outside: "Away from the keyboard, you'll find me playing soccer, running, or chasing fresh snow in the Cascades.",
  background: "I studied Computer Engineering at Seattle Pacific University. Before Nordstrom, I built web applications at FreeLock Computing and interned at Bellmont Cabinets.",
  contact: "Let's connect! Email me at tdoan1024@gmail.com, or find my GitHub and LinkedIn links in the Contact section.",
  resume: "You can open my resume from the navigation or the Experience section. It has the full details of my work history.",
  fallback: "That one's beyond my little bio. Try asking about my work, background, what I'm learning, or life outside work — or email me at tdoan1024@gmail.com."
};

function topicFor(question) {
  const text = question.toLowerCase();
  if (/\b(contact|email|connect|reach|hire|hiring|opportunit\w*)\b/.test(text)) return 'contact';
  if (/\b(resume|cv)\b/.test(text)) return 'resume';
  if (/\b(hobb\w*|outside|soccer|running|snowboard\w*|free time|fun|sport\w*)\b/.test(text)) return 'outside';
  if (/\b(learn\w*|ai|claude|agent\w*)\b/.test(text)) return 'learning';
  if (/\b(background|education|college|university|stud\w*|degree|before|school)\b/.test(text)) return 'background';
  if (/\b(work\w*|job|nordstrom|engineer\w*|build\w*|experience|career)\b/.test(text)) return 'work';
  return 'fallback';
}

const answer = document.getElementById('answer');
const questions = document.querySelectorAll('[data-topic]');
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
let timer;
let currentAnswer = answer.textContent;

function finishAnswer() {
  clearInterval(timer);
  answer.textContent = currentAnswer;
  answer.setAttribute('aria-busy', 'false');
  document.body.classList.remove('is-speaking');
}

function respond(topic) {
  clearInterval(timer);
  currentAnswer = answers[topic] || answers.fallback;
  questions.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === topic)));
  if (motion.matches) { finishAnswer(); return; }
  document.body.classList.add('is-speaking');
  answer.setAttribute('aria-busy', 'true');
  answer.textContent = '';
  let position = 0;
  timer = setInterval(() => {
    position = Math.min(position + 3, currentAnswer.length);
    answer.textContent = currentAnswer.slice(0, position);
    if (position === currentAnswer.length) finishAnswer();
  }, 24);
}

questions.forEach(button => button.addEventListener('click', () => respond(button.dataset.topic)));
document.getElementById('ask-form').addEventListener('submit', event => {
  event.preventDefault();
  const input = document.getElementById('question');
  if (!input.value.trim()) { input.value = ''; input.focus(); return; }
  respond(topicFor(input.value));
  input.value = '';
});
motion.addEventListener('change', () => { if (motion.matches) finishAnswer(); });

// Links remain visible without JavaScript.
const menu = document.querySelector('.menu-toggle');
const nav = document.getElementById('nav-links');
document.documentElement.classList.add('js');
menu.hidden = false;
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  nav.classList.toggle('is-open', open);
});
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open menu');
  nav.classList.remove('is-open');
}
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});


const themeToggle = document.querySelector('.theme-toggle');
const themeColor = document.querySelector('meta[name="theme-color"]');

function updateThemeToggle() {
  const light = document.documentElement.dataset.theme === 'light';
  themeToggle.setAttribute('aria-pressed', String(light));
  themeToggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  themeToggle.querySelector('span').textContent = light ? '☾' : '☀';
  themeColor.setAttribute('content', light ? '#f8f5ef' : '#191919');
}

themeToggle.hidden = false;
updateThemeToggle();
themeToggle.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem('portfolio-theme', theme);
  } catch {}
  updateThemeToggle();
});
