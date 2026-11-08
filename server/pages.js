const li = items => `<ul class="checks">${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
const minis = (items, cols = 2) =>
  `<div class="grid grid--${cols}">${items.map(([t, d]) => `<div class="mini"><h4>${t}</h4><p>${d}</p></div>`).join('')}</div>`;
const kpis = items =>
  `<div class="grid grid--3 grid--spaced">${items.map(([t, d]) => `<div class="kpi"><h4>${t}</h4><p>${d}</p></div>`).join('')}</div>`;

const sec = ({ eyebrow, title, intro = '', inner = '', cls = '' }) => `
    <section class="section ${cls}">
      <div class="container">
        <p class="eyebrow">${eyebrow}</p>
        <h2>${title}</h2>
        ${intro ? `<p class="section__intro">${intro}</p>` : ''}
        ${inner}
      </div>
    </section>`;

const split = ({ eyebrow, title, intro, right, cls = '' }) => `
    <section class="section ${cls}">
      <div class="container split">
        <div>
          <p class="eyebrow">${eyebrow}</p>
          <h2>${title}</h2>
          <p class="section__intro">${intro}</p>
        </div>
        ${right}
      </div>
    </section>`;

const statement = text => `
    <section class="section">
      <div class="container">
        <blockquote class="statement">${text}</blockquote>
      </div>
    </section>`;

const STAGES = [
  ['01', 'Discovery and assessment', 'Understand goals, processes and constraints.'],
  ['02', 'Strategy and design', 'Co-design the solution and roadmap.'],
  ['03', 'Implementation', 'Build and integrate with security built in.'],
  ['04', 'Adoption and training', 'Enable teams and manage change.'],
  ['05', 'Optimization', 'Measure, learn and continuously improve.']
];
const steps = () => `<ol class="steps">${STAGES.map(([n, t, d]) =>
  `<li class="reveal"><span>${n}</span><h4>${t}</h4><p>${d}</p></li>`).join('')}</ol>`;

function servicePage({ focus, focusIntro, cases, outcomes, outcomesIntro }) {
  return [
    split({ eyebrow: 'Focus areas', title: 'What we deliver', intro: focusIntro, right: li(focus) }),
    sec({ eyebrow: 'Use cases', title: 'Where clients start', cls: 'section--alt', inner: minis(cases) }),
    sec({ eyebrow: 'Expected outcomes', title: 'What you can expect', intro: outcomesIntro, cls: 'section--dark', inner: kpis(outcomes) }),
    sec({ eyebrow: 'How we engage', title: 'A phased approach that matches your readiness', inner: steps() })
  ].join('');
}

const PAGES = [
  // About us
  {
    group: 'About us', path: '/about/purpose', label: 'Purpose', icon: '&#127919;',
    desc: 'Why we exist',
    title: 'Our Purpose', eyebrow: 'Why we exist',
    lead: 'To empower organizations to unlock their full potential through technology.',
    body: () => [
      statement('To empower organizations to unlock their full potential by leveraging technology to solve business challenges, drive innovation, improve productivity, and create sustainable value.'),
      sec({
        eyebrow: 'In practice', title: 'What our purpose means for clients', cls: 'section--alt',
        inner: minis([
          ['Solve business challenges', 'We start with the problem to be solved, then choose the technology that fits.'],
          ['Drive innovation', 'We explore better ways of working with emerging and established technologies.'],
          ['Improve productivity', 'We reduce manual effort and help teams do more with the capacity they have.'],
          ['Create sustainable value', 'We build solutions that are maintainable and transfer knowledge to your teams.']
        ])
      })
    ].join('')
  },
  {
    group: 'About us', path: '/about/mission', label: 'Mission', icon: '&#128640;',
    desc: 'What we do',
    title: 'Our Mission', eyebrow: 'What we do',
    lead: 'Helping organizations transform the way they work.',
    body: () => [
      statement('To help organizations transform the way they work through strategic technology consulting, artificial intelligence, Microsoft Copilot solutions, intelligent automation, and end-to-end digital implementation.'),
      split({
        eyebrow: 'How we deliver', title: 'From business need to working solution', cls: 'section--alt',
        intro: 'DILT translates business needs into practical, secure and scalable technology solutions.',
        right: li([
          'Strategic technology consulting',
          'Artificial intelligence and Microsoft Copilot solutions',
          'Intelligent automation',
          'End-to-end digital implementation'
        ])
      }),
      sec({
        eyebrow: 'Results', title: 'What our work should achieve', cls: 'section--dark',
        inner: kpis([
          ['Improved efficiency', 'Less manual effort and shorter process cycle times.'],
          ['Better decisions', 'Faster access to trusted information and insight.'],
          ['Measurable results', 'Outcomes agreed up front and tracked with KPIs.']
        ])
      })
    ].join('')
  },
  {
    group: 'About us', path: '/about/vision', label: 'Vision', icon: '&#128301;',
    desc: 'What we aspire to become',
    title: 'Our Vision', eyebrow: 'What we aspire to become',
    lead: 'A trusted technology transformation partner for the intelligent era.',
    body: () => [
      statement('To become a trusted technology transformation partner recognized for helping organizations embrace intelligent technologies, innovate with confidence, and build more productive, agile, and future-ready businesses.'),
      sec({
        eyebrow: 'The destination', title: 'What success looks like', cls: 'section--alt',
        inner: minis([
          ['Trusted partner', 'Recognized for clear advice, integrity and delivery.'],
          ['Confident innovation', 'Clients adopt intelligent technologies with governance in place.'],
          ['Productive organizations', 'Teams spend their time on higher-value work.'],
          ['Future-ready businesses', 'Agile organizations able to adapt as technology evolves.']
        ])
      })
    ].join('')
  },
  {
    group: 'About us', path: '/about/core-values', label: 'Core values', icon: '&#128142;',
    desc: 'The principles behind our culture',
    title: 'Our Core Values', eyebrow: 'Culture',
    lead: 'Five values shape how we work with clients and with each other.',
    body: () => sec({
      eyebrow: 'What we stand for', title: 'Five core values',
      inner: `<div class="grid grid--3">${[
        ['&#128161;', 'Innovation', 'Continuously explore better ways to solve business problems through emerging and established technologies.'],
        ['&#129309;', 'Client Success', "Understand each client's objectives and measure success by the value delivered."],
        ['&#128274;', 'Trust and Integrity', 'Deliver transparent advice, protect client information, and promote responsible technology adoption.'],
        ['&#9881;', 'Practical Excellence', 'Turn ideas and strategies into reliable, scalable, and maintainable solutions.'],
        ['&#128260;', 'Continuous Improvement', 'Help clients and the company learn, adapt, and improve as technologies and business needs evolve.']
      ].map(([i, t, d]) => `<article class="card"><div class="card__icon">${i}</div><h3>${t}</h3><p class="muted">${d}</p></article>`).join('')}</div>`
    })
  },

  // Services
  {
    group: 'Services', path: '/services/ai-copilot', label: 'AI and Copilot Solutions', icon: '&#129302;',
    desc: 'Agents, Copilot adoption and governed AI',
    title: 'AI and Copilot Solutions', eyebrow: 'Service pillar 1',
    lead: 'Put AI to work across your organization, with governance and clear success criteria.',
    body: () => servicePage({
      focusIntro: 'Enterprise AI and Microsoft Copilot capabilities, designed for your processes and rolled out responsibly.',
      focus: [
        'Enterprise AI agents for internal operations and customer support workflows',
        'Microsoft Copilot adoption and enablement programs',
        'Knowledge assistants for documentation, policy, and operational guidance',
        'Generative AI use-case identification, rollout, and governance'
      ],
      cases: [
        ['Faster service desks', 'Reduce response times in service desks and support teams.'],
        ['Better knowledge retrieval', 'Improve retrieval across distributed documentation.'],
        ['AI-assisted analysis', 'Enable executive and operational teams with AI-assisted analysis.'],
        ['Responsible AI practices', 'Standardize prompt frameworks and responsible AI practices.']
      ],
      outcomesIntro: 'Governed AI adoption aligned with organizational policies.',
      outcomes: [
        ['Faster access to information', 'Less manual effort searching and compiling.'],
        ['Better decision support', 'Improved productivity and decision quality.'],
        ['Consistent execution', 'Stronger consistency in communication and process.']
      ]
    })
  },
  {
    group: 'Services', path: '/services/digital-transformation', label: 'Digital Transformation and Automation', icon: '&#9881;',
    desc: 'Workflows, Power Automate and Power Apps',
    title: 'Digital Transformation and Automation', eyebrow: 'Service pillar 2',
    lead: 'Replace manual work with intelligent workflows and modern low-code apps.',
    body: () => servicePage({
      focusIntro: 'Streamlined processes and low-code applications that give your people time back.',
      focus: [
        'Business workflow automation',
        'Process improvement and optimization',
        'Power Automate solution design and delivery',
        'Power Apps for low-code application modernization'
      ],
      cases: [
        ['Digitize approvals', 'Move paper-based or email-based approval processes into workflows.'],
        ['Streamline repetitive tasks', 'Automate repetitive back-office and operational tasks.'],
        ['Internal apps', 'Build apps for data capture, tracking, and reporting.'],
        ['Workflow dashboards', 'Give leaders visibility and performance management.']
      ],
      outcomesIntro: 'Standardized workflows that are easier to run, audit and improve.',
      outcomes: [
        ['Shorter cycle times', 'Reduced process cycle times and lower error rates.'],
        ['Stronger compliance', 'Better compliance through standardized workflows.'],
        ['Better experience', 'Transparent operations and simpler processes for employees.']
      ]
    })
  },
  {
    group: 'Services', path: '/services/technology-consulting', label: 'Technology Consulting, Licensing and Implementation', icon: '&#9729;',
    desc: 'Strategy, licensing, Azure and Microsoft 365',
    title: 'Technology Consulting, Licensing and Implementation', eyebrow: 'Service pillar 3',
    lead: 'Invest in technology with confidence, from roadmap to secure implementation.',
    body: () => servicePage({
      focusIntro: 'Advisory and delivery leadership that aligns technology spend with business goals.',
      focus: [
        'Technology strategy and roadmap development',
        'Licensing optimization and advisory',
        'Solution architecture and implementation leadership',
        'Azure cloud and Microsoft 365 enablement',
        'Governance model setup and user training'
      ],
      cases: [
        ['Transformation roadmap', 'Define a multi-phase digital transformation roadmap.'],
        ['Licensing review', 'Review and optimize licensing investments.'],
        ['Secure cloud adoption', 'Design secure cloud adoption architectures.'],
        ['Stronger governance', 'Strengthen governance, access controls, and usage standards.']
      ],
      outcomesIntro: 'Reduced risk in platform adoption and scale-up initiatives.',
      outcomes: [
        ['Aligned investment', 'Technology spend aligned with business goals.'],
        ['Resilient and secure', 'More resilient and secure operating environments.'],
        ['Higher adoption', 'Practical enablement and training that users adopt.']
      ]
    })
  },

  // Insights
  {
    group: 'Insights', path: '/insights/solution-accelerators', label: 'Solution accelerators', icon: '&#9889;',
    desc: 'Packaged offers and reusable assets',
    title: 'Solution Accelerators', eyebrow: 'Insights',
    lead: 'Packaged assessments, sprints and frameworks that get measurable results moving quickly.',
    body: () => sec({
      eyebrow: 'Offers and assets', title: 'Start fast with proven building blocks',
      intro: 'Each accelerator is scoped to match your readiness and budget, and can be combined into a larger roadmap.',
      inner: `<div class="grid grid--3">${[
        ['&#129504;', 'AI Readiness Assessment', 'Assess data, processes and governance to identify and prioritize generative AI use cases.'],
        ['&#128269;', 'Process Automation Opportunity Assessment', 'Find the workflows where automation will save the most time and reduce errors.'],
        ['&#127939;', 'Use-Case Implementation Sprint', 'Deliver a defined use case with measurable outcomes in a time-boxed sprint.'],
        ['&#128172;', 'Copilot Adoption and Prompt Framework', 'Enablement, training and standard prompt practices for Microsoft Copilot rollout.'],
        ['&#128737;', 'Governance and Responsible AI Toolkit', 'Role-based access, traceability, human oversight and quality checks built into delivery.'],
        ['&#128200;', 'KPI and Value Tracking Framework', 'Baseline-versus-improvement measures for productivity, quality, adoption and governance.'],
        ['&#128179;', 'Licensing Optimization Review', 'Review current licensing and align it with how your teams actually work.'],
        ['&#129517;', 'Discovery and Assessment Framework', 'Reusable templates that accelerate stakeholder alignment and solution design.'],
        ['&#128257;', 'Advisory and Optimization Retainer', 'Ongoing advisory and continuous improvement after go-live.']
      ].map(([i, t, d]) => `<article class="card"><div class="card__icon">${i}</div><h3>${t}</h3><p class="muted">${d}</p></article>`).join('')}</div>`
    }) + sec({
      eyebrow: 'Typical journey', title: 'How accelerators fit together', cls: 'section--alt', inner: steps()
    })
  },
  {
    group: 'Insights', path: '/insights/case-studies', label: 'Case studies', icon: '&#128218;',
    desc: 'Illustrative client scenarios',
    title: 'Case Studies', eyebrow: 'Insights',
    lead: 'Representative scenarios showing how DILT approaches common challenges.',
    body: () => `
    <section class="section">
      <div class="container">
        <p class="note"><strong>Illustrative scenarios.</strong> These are representative examples based on typical engagements, not named client results. Real client stories will be published as pilot engagements complete.</p>
        <div class="stack">${[
          ['AI and Copilot Solutions', 'Knowledge assistant for a distributed support team',
            'Policy and operational guidance was spread across many documents, so support staff spent time searching and answers varied.',
            'Identify priority use cases, build a governed knowledge assistant, roll out Microsoft Copilot with training and a prompt framework.',
            ['Knowledge retrieval speed', 'Response consistency', 'Active user adoption']],
          ['Digital Transformation and Automation', 'Digitizing an email-based approval process',
            'Approvals were handled by email and paper, causing delays, rework and limited visibility.',
            'Map the process, design Power Automate workflows and a Power Apps front end, and add a dashboard for status and performance.',
            ['Process cycle-time reduction', 'Error-rate reduction', 'Manual task-hours saved']],
          ['Technology Consulting, Licensing and Implementation', 'Cloud adoption roadmap with licensing review',
            'Licensing investments were not aligned to usage and there was no clear plan for secure cloud adoption.',
            'Review licensing, design a secure Azure and Microsoft 365 architecture, define governance and access controls, and set a phased roadmap.',
            ['Compliance adherence', 'Licensing alignment', 'Training completion']]
        ].map(([tag, title, challenge, approach, kpi]) => `
          <article class="case reveal">
            <span class="tag">${tag}</span>
            <h3>${title}</h3>
            <div class="case__cols">
              <div><h4>Challenge</h4><p>${challenge}</p></div>
              <div><h4>Approach</h4><p>${approach}</p></div>
              <div><h4>KPIs we track</h4><ul>${kpi.map(k => `<li>${k}</li>`).join('')}</ul></div>
            </div>
          </article>`).join('')}
        </div>
      </div>
    </section>`
  }
];

const GROUPS = ['About us', 'Services', 'Insights'];
const GROUP_ROOT = { 'About us': '/about/purpose', Services: '/services/ai-copilot', Insights: '/insights/solution-accelerators' };

module.exports = { PAGES, GROUPS, GROUP_ROOT };
