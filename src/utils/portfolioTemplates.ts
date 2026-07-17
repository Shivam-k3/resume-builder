import type { Resume } from '../types/resume';

export type PortfolioTheme = 'developer' | 'creative' | 'corporate';

export function generatePortfolioHTML(resume: Resume, theme: PortfolioTheme): string {
  const { links } = resume;

  // Generate Social Icons HTML using link.type and link.label
  const socialIconsHTML = links.map(link => {
    const type = link.type.toLowerCase();
    let iconSvg = '';
    
    // Choose appropriate SVG path for standard developer platforms
    if (type.includes('github')) {
      iconSvg = `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.08-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.18 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>`;
    } else if (type.includes('linkedin')) {
      iconSvg = `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`;
    } else if (type.includes('portfolio') || type.includes('other')) {
      iconSvg = `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>`;
    }

    return `
      <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="social-icon-link p-2 rounded-full transition-all" title="${link.label || link.type}">
        ${iconSvg}
      </a>
    `;
  }).join('');

  // Choose Theme Template
  if (theme === 'developer') {
    return getDeveloperTemplate(resume, socialIconsHTML);
  } else if (theme === 'creative') {
    return getCreativeTemplate(resume, socialIconsHTML);
  } else {
    return getCorporateTemplate(resume, socialIconsHTML);
  }
}

// Helper to format experience descriptions (array of strings)
const formatExperienceDescription = (bullets: string[]) => {
  if (!bullets || bullets.length === 0) return '';
  return `<ul class="list-disc pl-5 space-y-1.5">${bullets.map(p => `<li>${p}</li>`).join('')}</ul>`;
};

// ----------------------------------------------------
// THEME 1: MODERN DEVELOPER (DARK MODE CODE ACCENTS)
// ----------------------------------------------------
function getDeveloperTemplate(resume: Resume, socialIcons: string): string {
  const { personalInfo, experience, education, projects, skills } = resume;

  const experienceHTML = experience.map(exp => `
    <div class="border border-slate-800 bg-slate-900/60 rounded-xl p-6 transition hover:border-emerald-500/30">
      <div class="flex flex-wrap justify-between items-start gap-2 mb-3">
        <div>
          <h4 class="text-md font-bold text-slate-100">${exp.position}</h4>
          <p class="text-sm text-emerald-400 font-mono">${exp.company} • ${exp.location || 'Remote'}</p>
        </div>
        <span class="text-xs px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono">
          ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}
        </span>
      </div>
      <div class="text-sm text-slate-350 leading-relaxed font-sans">
        ${formatExperienceDescription(exp.description)}
      </div>
    </div>
  `).join('');

  const educationHTML = education.map(edu => `
    <div class="border border-slate-800 bg-slate-900/30 rounded-xl p-5">
      <div class="flex flex-wrap justify-between items-start gap-1 mb-2">
        <h4 class="text-md font-bold text-slate-200">${edu.degree} in ${edu.field}</h4>
        <span class="text-xs text-slate-400 font-mono">${edu.startDate} - ${edu.endDate}</span>
      </div>
      <p class="text-sm text-slate-400">${edu.institution}</p>
      ${edu.description ? `<p class="text-xs text-slate-500 mt-2 font-mono">${edu.description}</p>` : ''}
    </div>
  `).join('');

  const projectsHTML = projects.map(proj => `
    <div class="border border-slate-800 bg-slate-900/60 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition">
      <div>
        <div class="flex justify-between items-start gap-2 mb-3">
          <h4 class="text-md font-extrabold text-slate-100">${proj.name}</h4>
          ${proj.link ? `
            <a href="${proj.link}" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300 p-1">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          ` : ''}
        </div>
        <p class="text-sm text-slate-350 mb-4 leading-relaxed">${proj.description}</p>
      </div>
      <div class="flex flex-wrap gap-1.5 mt-auto">
        ${proj.technologies.map(tech => `<span class="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">${tech}</span>`).join('')}
      </div>
    </div>
  `).join('');

  const skillsHTML = skills.map(cat => `
    <div class="space-y-2">
      <h5 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">${cat.category}</h5>
      <div class="flex flex-wrap gap-1.5">
        ${cat.skills.map(s => `<span class="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">${s}</span>`).join('')}
      </div>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personalInfo.fullName} | Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&family=Inter:wght@300;400;600;750;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
    code, pre, .font-mono { font-family: 'Fira Code', monospace; }
    .social-icon-link { color: #94a3b8; }
    .social-icon-link:hover { color: #34d399; background-color: #1e293b; }
  </style>
</head>
<body class="bg-slate-955 text-slate-100 min-h-screen selection:bg-emerald-500 selection:text-slate-950">

  <!-- Floating Nav -->
  <nav class="sticky top-0 z-50 bg-slate-950/80 backdrop-blur border-b border-slate-900 py-4 px-6">
    <div class="max-w-5xl mx-auto flex justify-between items-center">
      <a href="#hero" class="text-lg font-black tracking-tight font-mono text-emerald-400">&lt;${personalInfo.fullName.split(' ')[0] || 'Dev'} /&gt;</a>
      <div class="flex items-center gap-6 text-sm font-mono text-slate-400">
        <a href="#about" class="hover:text-emerald-400 transition">about</a>
        ${experience.length > 0 ? `<a href="#experience" class="hover:text-emerald-400 transition">work</a>` : ''}
        ${projects.length > 0 ? `<a href="#projects" class="hover:text-emerald-400 transition">projects</a>` : ''}
        <a href="#contact" class="px-3 py-1.5 rounded border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition">contact</a>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section id="hero" class="py-20 px-6 max-w-5xl mx-auto flex flex-col justify-center min-h-[75vh]">
    <p class="font-mono text-emerald-400 text-sm mb-3">// Hello, my name is</p>
    <h1 class="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-4">${personalInfo.fullName}</h1>
    <h2 class="text-2xl sm:text-4xl font-bold text-slate-400 mb-6">${personalInfo.title}</h2>
    <p class="text-md text-slate-350 max-w-2xl leading-relaxed mb-8">${personalInfo.summary}</p>
    
    <div class="flex items-center gap-4">
      <a href="#projects" class="px-6 py-3 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/10">View My Work</a>
      <div class="flex gap-2">${socialIcons}</div>
    </div>
  </section>

  <!-- About & Skills Section -->
  <section id="about" class="py-20 px-6 max-w-5xl mx-auto border-t border-slate-900">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
      <div class="md:col-span-2 space-y-6">
        <div class="flex items-center gap-3">
          <span class="font-mono text-emerald-400">01.</span>
          <h3 class="text-2xl font-bold text-slate-100">About Me</h3>
          <div class="h-[1px] bg-slate-800 flex-1"></div>
        </div>
        <p class="text-sm text-slate-350 leading-relaxed">${personalInfo.summary}</p>
        
        <div class="grid grid-cols-2 gap-4 pt-4 text-xs font-mono text-slate-400">
          <div class="flex items-center gap-2">
            <span class="text-emerald-400">▹</span> ${personalInfo.location || 'Remote'}
          </div>
          <div class="flex items-center gap-2">
            <span class="text-emerald-400">▹</span> ${personalInfo.email}
          </div>
        </div>
      </div>
      
      <div class="space-y-6">
        <h4 class="text-sm font-mono uppercase tracking-wider text-emerald-400">// Technical Stack</h4>
        <div class="space-y-4">${skillsHTML}</div>
      </div>
    </div>
  </section>

  <!-- Experience Section -->
  ${experience.length > 0 ? `
  <section id="experience" class="py-20 px-6 max-w-5xl mx-auto border-t border-slate-900">
    <div class="flex items-center gap-3 mb-10">
      <span class="font-mono text-emerald-400">02.</span>
      <h3 class="text-2xl font-bold text-slate-100">Where I've Worked</h3>
      <div class="h-[1px] bg-slate-800 flex-1"></div>
    </div>
    <div class="space-y-6 max-w-3xl">${experienceHTML}</div>
  </section>
  ` : ''}

  <!-- Projects Section -->
  ${projects.length > 0 ? `
  <section id="projects" class="py-20 px-6 max-w-5xl mx-auto border-t border-slate-900">
    <div class="flex items-center gap-3 mb-10">
      <span class="font-mono text-emerald-400">03.</span>
      <h3 class="text-2xl font-bold text-slate-100">Featured Projects</h3>
      <div class="h-[1px] bg-slate-800 flex-1"></div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">${projectsHTML}</div>
  </section>
  ` : ''}

  <!-- Education Section -->
  ${education.length > 0 ? `
  <section id="education" class="py-20 px-6 max-w-5xl mx-auto border-t border-slate-900">
    <div class="flex items-center gap-3 mb-10">
      <span class="font-mono text-emerald-400">04.</span>
      <h3 class="text-2xl font-bold text-slate-100">Education</h3>
      <div class="h-[1px] bg-slate-800 flex-1"></div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">${educationHTML}</div>
  </section>
  ` : ''}

  <!-- Contact Section -->
  <section id="contact" class="py-20 px-6 max-w-xl mx-auto border-t border-slate-900 text-center">
    <span class="font-mono text-emerald-400 text-sm">// What's Next?</span>
    <h3 class="text-4xl font-extrabold text-white mt-2 mb-4">Get In Touch</h3>
    <p class="text-sm text-slate-350 leading-relaxed mb-8">Feel free to reach out if you have any questions or would like to work together!</p>
    
    <form onsubmit="event.preventDefault(); document.getElementById('success').classList.remove('hidden');" class="space-y-4 text-left border border-slate-800 bg-slate-900/30 rounded-2xl p-6">
      <div id="success" class="hidden p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl text-center font-bold">
        🎉 Message sent successfully! (Simulated)
      </div>
      <div>
        <label class="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Your Name</label>
        <input type="text" required class="w-full bg-slate-955 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-emerald-500 outline-none">
      </div>
      <div>
        <label class="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Your Email</label>
        <input type="email" required class="w-full bg-slate-955 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-emerald-500 outline-none">
      </div>
      <div>
        <label class="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Message</label>
        <textarea required rows="4" class="w-full bg-slate-955 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-emerald-500 outline-none"></textarea>
      </div>
      <button type="submit" class="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition">Send Message</button>
    </form>
  </section>

  <!-- Footer -->
  <footer class="border-t border-slate-900 py-8 px-6 text-center text-xs font-mono text-slate-500">
    <p>Designed & Built by ${personalInfo.fullName}</p>
    <p class="mt-1">&copy; ${new Date().getFullYear()} • All Rights Reserved</p>
  </footer>

</body>
</html>
  `;
}

// ----------------------------------------------------
// THEME 2: MINIMALIST CREATIVE (LIGHT MODE ELEGANCE)
// ----------------------------------------------------
function getCreativeTemplate(resume: Resume, socialIcons: string): string {
  const { personalInfo, experience, education, projects, skills } = resume;

  const experienceHTML = experience.map(exp => `
    <div class="border-l border-slate-900 pl-6 space-y-2 py-2">
      <div class="flex flex-wrap justify-between items-start gap-1">
        <h4 class="text-lg font-bold text-slate-900 font-serif">${exp.position}</h4>
        <span class="text-xs uppercase tracking-wider text-slate-500 font-sans">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</span>
      </div>
      <p class="text-xs font-bold text-slate-700 uppercase tracking-widest">${exp.company} • ${exp.location || 'Remote'}</p>
      <div class="text-sm text-slate-650 leading-relaxed font-sans mt-2">
        ${formatExperienceDescription(exp.description)}
      </div>
    </div>
  `).join('');

  const educationHTML = education.map(edu => `
    <div class="space-y-1">
      <div class="flex flex-wrap justify-between items-start gap-1">
        <h4 class="text-sm font-bold text-slate-900">${edu.degree} in ${edu.field}</h4>
        <span class="text-xs text-slate-500">${edu.startDate} - ${edu.endDate}</span>
      </div>
      <p class="text-xs text-slate-700">${edu.institution}</p>
    </div>
  `).join('');

  const projectsHTML = projects.map(proj => `
    <div class="border border-slate-900 p-6 flex flex-col justify-between bg-white hover:bg-slate-55 transition">
      <div>
        <div class="flex justify-between items-start gap-2 mb-2">
          <h4 class="text-md font-bold text-slate-900 font-serif">${proj.name}</h4>
          ${proj.link ? `
            <a href="${proj.link}" target="_blank" rel="noopener noreferrer" class="text-slate-900 hover:text-slate-600 p-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          ` : ''}
        </div>
        <p class="text-xs text-slate-600 mb-4 leading-relaxed">${proj.description}</p>
      </div>
      <div class="flex flex-wrap gap-1 mt-auto">
        ${proj.technologies.map(tech => `<span class="text-[10px] border border-slate-900 px-2 py-0.5 rounded text-slate-750 font-sans">${tech}</span>`).join('')}
      </div>
    </div>
  `).join('');

  const skillsHTML = skills.map(cat => `
    <div class="space-y-1.5">
      <h5 class="text-xs uppercase tracking-widest font-bold text-slate-900">${cat.category}</h5>
      <div class="flex flex-wrap gap-1">
        ${cat.skills.map(s => `<span class="text-xs border border-slate-300 px-2 py-0.5 rounded text-slate-700">${s}</span>`).join('')}
      </div>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personalInfo.fullName} | Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    h1, h2, h3, h4, .font-serif { font-family: 'Playfair Display', serif; }
    .social-icon-link { color: #1e293b; border: 1px solid #1e293b; }
    .social-icon-link:hover { color: #ffffff; background-color: #1e293b; }
  </style>
</head>
<body class="bg-stone-50 text-slate-900 min-h-screen selection:bg-slate-900 selection:text-white">

  <!-- Header -->
  <header class="border-b border-slate-900 py-6 px-6 bg-stone-50/90 backdrop-blur sticky top-0 z-50">
    <div class="max-w-4xl mx-auto flex justify-between items-center">
      <a href="#hero" class="text-md font-bold tracking-widest text-slate-900 font-serif">${personalInfo.fullName.toUpperCase()}</a>
      <div class="flex items-center gap-6 text-xs uppercase tracking-widest text-slate-700 font-semibold">
        <a href="#about" class="hover:text-slate-900 transition">about</a>
        ${experience.length > 0 ? `<a href="#experience" class="hover:text-slate-900 transition">experience</a>` : ''}
        ${projects.length > 0 ? `<a href="#projects" class="hover:text-slate-900 transition">projects</a>` : ''}
        <a href="#contact" class="hover:text-slate-900 transition">contact</a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section id="hero" class="py-24 px-6 max-w-4xl mx-auto flex flex-col justify-center min-h-[70vh]">
    <h1 class="text-5xl sm:text-7xl font-bold tracking-tight text-slate-900 mb-4">${personalInfo.fullName}</h1>
    <h2 class="text-xl sm:text-2xl italic text-slate-600 mb-6 font-serif">${personalInfo.title}</h2>
    <p class="text-md sm:text-lg text-slate-700 max-w-2xl leading-relaxed mb-8 font-light">${personalInfo.summary}</p>
    
    <div class="flex items-center gap-4 flex-wrap">
      <a href="#contact" class="px-6 py-3 border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-900 hover:text-white transition uppercase tracking-widest text-xs">Let's Connect</a>
      <div class="flex gap-2">${socialIcons}</div>
    </div>
  </section>

  <!-- About Section -->
  <section id="about" class="py-20 px-6 max-w-4xl mx-auto border-t border-slate-900">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
      <div class="md:col-span-2 space-y-6">
        <h3 class="text-3xl font-bold text-slate-900 font-serif">About Me</h3>
        <p class="text-sm text-slate-755 leading-relaxed font-light">${personalInfo.summary}</p>
        <p class="text-xs text-slate-500 font-sans">Currently based in: <strong>${personalInfo.location || 'Remote'}</strong></p>
      </div>
      <div class="space-y-6">
        <h3 class="text-xs uppercase tracking-widest font-bold text-slate-900">Core Expertise</h3>
        <div class="space-y-4">${skillsHTML}</div>
      </div>
    </div>
  </section>

  <!-- Experience Section -->
  ${experience.length > 0 ? `
  <section id="experience" class="py-20 px-6 max-w-4xl mx-auto border-t border-slate-900">
    <h3 class="text-3xl font-bold text-slate-900 font-serif mb-10">Selected Experience</h3>
    <div class="space-y-12 max-w-3xl">${experienceHTML}</div>
  </section>
  ` : ''}

  <!-- Projects Section -->
  ${projects.length > 0 ? `
  <section id="projects" class="py-20 px-6 max-w-4xl mx-auto border-t border-slate-900">
    <h3 class="text-3xl font-bold text-slate-900 font-serif mb-10">Recent Projects</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">${projectsHTML}</div>
  </section>
  ` : ''}

  <!-- Education Section -->
  ${education.length > 0 ? `
  <section id="education" class="py-20 px-6 max-w-4xl mx-auto border-t border-slate-900">
    <h3 class="text-3xl font-bold text-slate-900 font-serif mb-8">Education</h3>
    <div class="space-y-6 max-w-2xl">${educationHTML}</div>
  </section>
  ` : ''}

  <!-- Contact Section -->
  <section id="contact" class="py-20 px-6 max-w-xl mx-auto border-t border-slate-900">
    <h3 class="text-3xl font-bold text-slate-900 font-serif text-center mb-2">Let's Work Together</h3>
    <p class="text-xs uppercase tracking-widest text-slate-500 text-center mb-8">Drop me a line below</p>
    
    <form onsubmit="event.preventDefault(); document.getElementById('success').classList.remove('hidden');" class="space-y-4">
      <div id="success" class="hidden p-3 bg-slate-900 text-white text-xs rounded text-center font-bold uppercase tracking-widest">
        🎉 Message sent successfully!
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs uppercase tracking-widest text-slate-955 font-bold mb-1">Your Name</label>
          <input type="text" required class="w-full bg-stone-55 border-b border-slate-900 py-2 text-sm text-slate-900 focus:border-slate-500 outline-none">
        </div>
        <div>
          <label class="block text-xs uppercase tracking-widest text-slate-955 font-bold mb-1">Your Email</label>
          <input type="email" required class="w-full bg-stone-55 border-b border-slate-900 py-2 text-sm text-slate-900 focus:border-slate-500 outline-none">
        </div>
      </div>
      <div>
        <label class="block text-xs uppercase tracking-widest text-slate-955 font-bold mb-1">Message</label>
        <textarea required rows="4" class="w-full bg-stone-55 border-b border-slate-900 py-2 text-sm text-slate-900 focus:border-slate-500 outline-none"></textarea>
      </div>
      <button type="submit" class="w-full py-3 bg-slate-900 hover:bg-slate-855 text-white font-bold rounded text-xs uppercase tracking-widest transition">Send message</button>
    </form>
  </section>

  <!-- Footer -->
  <footer class="border-t border-slate-900 py-10 px-6 text-center text-xs uppercase tracking-widest text-slate-500">
    <p>&copy; ${new Date().getFullYear()} • ${personalInfo.fullName}</p>
  </footer>

</body>
</html>
  `;
}

// ----------------------------------------------------
// THEME 3: EXECUTIVE CORPORATE (NAVY/SLATE GRID)
// ----------------------------------------------------
function getCorporateTemplate(resume: Resume, socialIcons: string): string {
  const { personalInfo, experience, education, projects, skills } = resume;

  const experienceHTML = experience.map(exp => `
    <div class="border-l-4 border-indigo-900 pl-4 py-1 space-y-2">
      <div class="flex flex-wrap justify-between items-start gap-1">
        <h4 class="text-md font-bold text-slate-900">${exp.position}</h4>
        <span class="text-xs font-bold text-indigo-900">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</span>
      </div>
      <p class="text-xs font-semibold text-slate-600">${exp.company} | ${exp.location || 'Remote'}</p>
      <div class="text-sm text-slate-700 leading-relaxed font-sans">
        ${formatExperienceDescription(exp.description)}
      </div>
    </div>
  `).join('');

  const educationHTML = education.map(edu => `
    <div class="space-y-1">
      <div class="flex flex-wrap justify-between items-start gap-1">
        <h4 class="text-sm font-bold text-slate-900">${edu.degree} in ${edu.field}</h4>
        <span class="text-xs text-slate-500 font-semibold">${edu.startDate} - ${edu.endDate}</span>
      </div>
      <p class="text-xs text-slate-600">${edu.institution}</p>
    </div>
  `).join('');

  const projectsHTML = projects.map(proj => `
    <div class="bg-white rounded-xl p-5 border border-slate-200 flex flex-col justify-between shadow-sm hover:shadow-md transition">
      <div>
        <div class="flex justify-between items-start gap-2 mb-2">
          <h4 class="text-sm font-bold text-slate-900">${proj.name}</h4>
          ${proj.link ? `
            <a href="${proj.link}" target="_blank" rel="noopener noreferrer" class="text-indigo-900 hover:text-indigo-700 p-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          ` : ''}
        </div>
        <p class="text-xs text-slate-600 mb-4 leading-relaxed">${proj.description}</p>
      </div>
      <div class="flex flex-wrap gap-1 mt-auto">
        ${proj.technologies.map(tech => `<span class="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">${tech}</span>`).join('')}
      </div>
    </div>
  `).join('');

  const skillsHTML = skills.map(cat => `
    <div class="space-y-1.5">
      <h5 class="text-xs font-bold text-slate-700 uppercase tracking-wider">${cat.category}</h5>
      <div class="flex flex-wrap gap-1">
        ${cat.skills.map(s => `<span class="text-xs bg-indigo-55 border border-indigo-100 px-2 py-1 rounded text-indigo-900 font-semibold">${s}</span>`).join('')}
      </div>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personalInfo.fullName} | Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Outfit', sans-serif; }
    .social-icon-link { color: #475569; }
    .social-icon-link:hover { color: #312e81; background-color: #f1f5f9; }
  </style>
</head>
<body class="bg-slate-55 text-slate-800 min-h-screen selection:bg-indigo-900 selection:text-white">

  <!-- Nav -->
  <nav class="sticky top-0 z-50 bg-white/95 border-b border-slate-202 py-4 px-6 shadow-sm">
    <div class="max-w-5xl mx-auto flex justify-between items-center">
      <a href="#hero" class="text-md font-bold tracking-tight text-slate-900">${personalInfo.fullName}</a>
      <div class="flex items-center gap-6 text-xs uppercase tracking-wider text-slate-605 font-bold">
        <a href="#about" class="hover:text-indigo-900 transition">About</a>
        ${experience.length > 0 ? `<a href="#experience" class="hover:text-indigo-900 transition">Experience</a>` : ''}
        ${projects.length > 0 ? `<a href="#projects" class="hover:text-indigo-900 transition">Projects</a>` : ''}
        <a href="#contact" class="hover:text-indigo-900 transition">Contact</a>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <section id="hero" class="py-24 bg-gradient-to-br from-indigo-955 to-slate-900 text-white px-6">
    <div class="max-w-5xl mx-auto flex flex-col justify-center min-h-[40vh]">
      <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight mb-2">${personalInfo.fullName}</h1>
      <h2 class="text-lg sm:text-2xl text-indigo-300 font-semibold mb-6">${personalInfo.title}</h2>
      <p class="text-md text-slate-300 max-w-3xl leading-relaxed mb-8 font-light">${personalInfo.summary}</p>
      
      <div class="flex items-center gap-4 flex-wrap">
        <a href="#contact" class="px-6 py-3 rounded-lg bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-955/40">Connect With Me</a>
        <div class="flex gap-2 text-white bg-slate-800/40 p-1.5 rounded-lg border border-slate-700">${socialIcons}</div>
      </div>
    </div>
  </section>

  <!-- Main Body Grid -->
  <main class="max-w-5xl mx-auto py-16 px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
    
    <!-- Left Column: Experience & Projects -->
    <div class="lg:col-span-2 space-y-12">
      
      <!-- Experience -->
      ${experience.length > 0 ? `
      <section id="experience" class="space-y-8">
        <h3 class="text-2xl font-extrabold text-slate-900 border-b-2 border-slate-202 pb-2">Professional Experience</h3>
        <div class="space-y-8">${experienceHTML}</div>
      </section>
      ` : ''}

      <!-- Projects -->
      ${projects.length > 0 ? `
      <section id="projects" class="space-y-8">
        <h3 class="text-2xl font-extrabold text-slate-900 border-b-2 border-slate-202 pb-2">Key Projects</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">${projectsHTML}</div>
      </section>
      ` : ''}

    </div>

    <!-- Right Column: Skills, Education, Info -->
    <div class="space-y-12">
      
      <!-- About / Contact Info -->
      <section id="about" class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
        <h4 class="text-md font-bold text-indigo-955 uppercase tracking-wider">Contact & Location</h4>
        <div class="text-xs space-y-2 text-slate-600 font-semibold">
          <p class="flex items-center gap-2">📍 ${personalInfo.location || 'Remote'}</p>
          <p class="flex items-center gap-2">✉️ ${personalInfo.email}</p>
          ${personalInfo.phone ? `<p class="flex items-center gap-2">📞 ${personalInfo.phone}</p>` : ''}
        </div>
      </section>

      <!-- Skills -->
      <section class="space-y-4">
        <h4 class="text-md font-extrabold text-slate-900">Skills & Competencies</h4>
        <div class="space-y-4">${skillsHTML}</div>
      </section>

      <!-- Education -->
      ${education.length > 0 ? `
      <section class="space-y-4">
        <h4 class="text-md font-extrabold text-slate-900">Education</h4>
        <div class="space-y-4">${educationHTML}</div>
      </section>
      ` : ''}

    </div>

  </main>

  <!-- Contact -->
  <section id="contact" class="py-16 bg-slate-100 border-t border-slate-202 px-6">
    <div class="max-w-xl mx-auto bg-white rounded-2xl border border-slate-202 shadow-sm p-6 sm:p-8">
      <h3 class="text-2xl font-extrabold text-slate-900 text-center mb-6">Send a Message</h3>
      
      <form onsubmit="event.preventDefault(); document.getElementById('success').classList.remove('hidden');" class="space-y-4">
        <div id="success" class="hidden p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs rounded-xl text-center font-bold">
          🎉 Your email has been sent successfully!
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-705 uppercase mb-1">Name</label>
          <input type="text" required class="w-full border border-slate-250 rounded-lg p-2.5 text-sm text-slate-900 focus:border-indigo-900 outline-none">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-705 uppercase mb-1">Email</label>
          <input type="email" required class="w-full border border-slate-250 rounded-lg p-2.5 text-sm text-slate-900 focus:border-indigo-900 outline-none">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-705 uppercase mb-1">Message</label>
          <textarea required rows="4" class="w-full border border-slate-250 rounded-lg p-2.5 text-sm text-slate-900 focus:border-indigo-900 outline-none"></textarea>
        </div>
        <button type="submit" class="w-full py-3 bg-indigo-955 hover:bg-indigo-900 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition">Submit Form</button>
      </form>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-slate-900 text-slate-404 py-8 px-6 text-center text-xs">
    <p>&copy; ${new Date().getFullYear()} • ${personalInfo.fullName}</p>
  </footer>

</body>
</html>
  `;
}
