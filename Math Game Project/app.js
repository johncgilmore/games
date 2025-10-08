const teacherModeBtn = document.getElementById('teacherMode');
const studentModeBtn = document.getElementById('studentMode');
const teacherPanel = document.getElementById('teacherPanel');
const studentPanel = document.getElementById('studentPanel');
const generateTeacherBtn = document.getElementById('generateTeacher');
const generateStudentBtn = document.getElementById('generateStudent');
const teacherOutput = document.getElementById('teacherOutput');
const studentOutput = document.getElementById('studentOutput');
const domainSelect = document.getElementById('teacherDomain');
const teacherRevealToggle = document.getElementById('teacherReveal');

const randomChoice = (array) => array[Math.floor(Math.random() * array.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const roundTo = (value, decimals = 2) => Number.parseFloat(value).toFixed(decimals);

const teacherPrompts = [
  {
    domain: '7.RP',
    standard: 'CCSS.MATH.CONTENT.7.RP.A.3',
    skill: 'Solve percent increase/decrease problems',
    title: 'Subscription Discount Remix',
    tags: ['Comics', 'Discounts'],
    generator: () => {
      const baseCost = randomInt(50, 90);
      const discount = 20;
      const taxRate = 8.5;
      const reimbPercent = 25;
      const discounted = baseCost * (1 - discount / 100);
      const totalWithTax = discounted * (1 + taxRate / 100);
      const reimbursement = totalWithTax * (reimbPercent / 100);
      return {
        scenario:
          `Andrew bundles horror comics in his monthly pull list priced at $${baseCost}. The shop knocks off ${discount}% before adding ${taxRate}% Washington sales tax. John still insists on paying him back ${reimbPercent}% of the final bill.`,
        question:
          'What does Andrew pay after tax, and how much does John pay him back?',
        solution: {
          steps: [
            `Discounted price: $${roundTo(discounted, 2)}`,
            `After tax: $${roundTo(totalWithTax, 2)}`,
            `John reimburses 25%: $${roundTo(reimbursement, 2)}`,
            `Andrew pays net: $${roundTo(totalWithTax - reimbursement, 2)}`,
          ],
        },
        extension:
          'Have students compare savings if the reimbursement happened before tax. What is the percent difference?',
      };
    },
  },
  {
    domain: '7.RP',
    standard: 'CCSS.MATH.CONTENT.7.RP.A.1',
    skill: 'Compute unit rates from proportional relationships',
    title: 'Frame Rate Frenzy',
    tags: ['Filmmaking', 'Ratios'],
    generator: () => {
      const frames = randomInt(5400, 7200);
      const seconds = randomInt(180, 240);
      const rate = roundTo(frames / seconds, 2);
      return {
        scenario:
          `Andrew edits a suspense trailer shot with ${frames} frames over ${seconds} seconds of horror footage.`,
        question:
          'What is the frame rate in frames per second? How would that compare to the cinematic standard of 24 fps?',
        solution: {
          steps: [
            `Unit rate: ${frames} ÷ ${seconds} = ${rate} frames per second`,
            `${rate > 24 ? 'It is faster than' : 'It is slower than'} 24 fps by ${roundTo(Math.abs(rate - 24), 2)} fps`,
          ],
        },
        extension:
          'Ask students to convert the frame rate to frames per minute or plan how many frames are needed for a 2-minute scene at the same rate.',
      };
    },
  },
  {
    domain: '7.EE',
    standard: 'CCSS.MATH.CONTENT.7.EE.B.3',
    skill: 'Solve multi-step real-world problems with rational numbers',
    title: 'Comic-Con Budget Constraints',
    tags: ['Budgeting', 'Inequalities'],
    generator: () => {
      const budget = 75;
      const items = [
        { name: 'Signed slasher poster', price: 27 },
        { name: 'Variant comic cover', price: 18 },
        { name: 'Director Q&A ticket', price: 22 },
        { name: 'Prop replica badge', price: 16 },
      ];
      const combos = items.flatMap((item, idx) =>
        items.slice(idx + 1).map((other) => ({
          combo: `${item.name} + ${other.name}`,
          total: item.price + other.price,
        }))
      );
      const viableCombos = combos.filter((combo) => combo.total <= budget);
      return {
        scenario:
          `Andrew caps his Comic Con spending at $${budget}. Prices already include tax: ${items
            .map((item) => `${item.name} $${item.price}`)
            .join(', ')}.`,
        question:
          'Write and solve an inequality to show which pairs of items stay within budget. Which combo leaves the most money for snacks?',
        solution: {
          steps: [
            `Inequality: x + y \u2264 75`,
            `Affordable combos: ${viableCombos
              .map((combo) => `${combo.combo} ($${combo.total})`)
              .join('; ')}`,
            `Best leftover: ${(() => {
              if (!viableCombos.length) return 'None';
              const best = viableCombos.reduce((prev, current) =>
                current.total < prev.total ? current : prev
              );
              return `${best.combo} leaves $${roundTo(budget - best.total, 2)}.`;
            })()}`,
          ],
        },
        extension:
          'Have students add a third item and model it with a system of inequalities on a coordinate plane.',
      };
    },
  },
  {
    domain: '7.EE',
    standard: 'CCSS.MATH.CONTENT.7.EE.B.4',
    skill: 'Construct and solve equations',
    title: 'Storyboard Equation',
    tags: ['Filmmaking', 'Equations'],
    generator: () => {
      const panelsPerPage = randomInt(4, 7);
      const pages = randomInt(10, 15);
      const extraShots = randomInt(8, 16);
      const totalPanels = panelsPerPage * pages + extraShots;
      return {
        scenario:
          `The director prints ${pages} storyboard pages with ${panelsPerPage} panels each, then sketches ${extraShots} extra shots for a chase sequence. Andrew writes the equation ${panelsPerPage}p + ${extraShots} = ${totalPanels} to track panels.`,
        question:
          'Solve for p to confirm the number of storyboard pages. How could you adjust the equation if the director adds four more pages?',
        solution: {
          steps: [`Subtract ${extraShots}: ${totalPanels} - ${extraShots} = ${panelsPerPage}p`, `Divide: p = ${totalPanels - extraShots} / ${panelsPerPage} = ${pages}`, 'With four more pages: equation becomes ' + `${panelsPerPage}(p + 4) + ${extraShots}`],
        },
        extension:
          'Challenge students to create their own equation if each new action scene needs 12 extra frames split evenly across the existing pages.',
      };
    },
  },
  {
    domain: '7.NS',
    standard: 'CCSS.MATH.CONTENT.7.NS.A.3',
    skill: 'Apply operations with rational numbers',
    title: 'Horror Marathon Ledger',
    tags: ['Statistics', 'Integers'],
    generator: () => {
      const rentals = randomInt(3, 6);
      const rentalCost = randomInt(4, 7);
      const snacks = randomInt(12, 20);
      const reimbursement = rentalCost * rentals * 0.25;
      const net = rentals * rentalCost + snacks - reimbursement;
      return {
        scenario:
          `During a horror film marathon, Andrew rents ${rentals} movies at $${rentalCost} each, buys snacks for $${snacks}, and John refunds 25% of the rental costs.`,
        question:
          'Represent the total spending as a sum of signed rational numbers. What is Andrew\'s net cost?',
        solution: {
          steps: [
            `Total rentals: ${rentals} \u00d7 $${rentalCost} = $${rentals * rentalCost}`,
            `Refund: -$${roundTo(reimbursement, 2)}`,
            `Snacks: +$${snacks}`,
            `Net: $${roundTo(net, 2)}`,
          ],
        },
        extension:
          'Model the spending on a number line or ask students to compare the net cost if the refund was for snacks instead.',
      };
    },
  },
  {
    domain: '7.G',
    standard: 'CCSS.MATH.CONTENT.7.G.A.1',
    skill: 'Solve problems involving scale drawings',
    title: 'Set Designer Scale-Up',
    tags: ['Filmmaking', 'Geometry'],
    generator: () => {
      const scale = 0.5; // 0.5 inch represents 1 foot
      const width = randomInt(18, 26);
      const height = randomInt(12, 18);
      const actualWidth = width / scale;
      const actualHeight = height / scale;
      return {
        scenario:
          `Andrew sketches a haunted house set where ${scale} inch on paper equals 1 foot in real life. His drawing shows a facade ${width} inches wide and ${height} inches tall.`,
        question:
          'What are the actual width and height of the set? If the director doubles the scale to 1 inch = 1 foot, what happens to the drawing dimensions?',
        solution: {
          steps: [
            `Actual width: ${width} / ${scale} = ${actualWidth} ft`,
            `Actual height: ${height} / ${scale} = ${actualHeight} ft`,
            'New scale doubles the drawing measurements, so divide each actual measure by 1 instead of 2.',
          ],
        },
        extension:
          'Ask students to calculate the area of the facade in both the drawing and the real set to compare scale factors.',
      };
    },
  },
  {
    domain: '7.SP',
    standard: 'CCSS.MATH.CONTENT.7.SP.B.4',
    skill: 'Use measures of center to draw conclusions',
    title: 'Audience Reaction Data Dive',
    tags: ['Statistics', 'Film Screening'],
    generator: () => {
      const reactions = Array.from({ length: 5 }, () => randomInt(1, 5));
      const total = reactions.reduce((sum, val) => sum + val, 0);
      const mean = roundTo(total / reactions.length, 2);
      const maxWeek = reactions.indexOf(Math.max(...reactions)) + 1;
      return {
        scenario:
          `After test-screening his horror short, Andrew logs weekly audience rating averages on a 5-star scale: Week scores ${reactions.join(', ')}.`,
        question:
          'What is the mean rating, and during which week did the feedback peak? Suggest a conclusion Andrew can draw about momentum.',
        solution: {
          steps: [
            `Mean = (${reactions.join(' + ')}) / 5 = ${mean}`,
            `Highest rating: Week ${maxWeek}`,
            'Conclusion: Engagement is climbing if later weeks score higher; otherwise investigate dips.',
          ],
        },
        extension:
          'Invite students to display the data in a dot plot and discuss the effect of adding a new high score.',
      };
    },
  },
  {
    domain: '7.RP',
    standard: 'CCSS.MATH.CONTENT.7.RP.A.2',
    skill: 'Recognize and represent proportional relationships',
    title: 'Variant Cover Ratios',
    tags: ['Comics', 'Proportions'],
    generator: () => {
      const ratioA = randomInt(3, 6);
      const ratioB = randomInt(1, 3);
      const goal = randomInt(30, 54);
      const scaleFactor = goal / ratioA;
      return {
        scenario:
          `A publisher prints variant covers of a horror comic in a ${ratioA}:${ratioB} ratio (regular to holofoil). Andrew wants ${goal} regular issues for his shop.`,
        question:
          'How many holofoil issues must ship with that order? Represent the relationship with an equation.',
        solution: {
          steps: [
            `Scale factor: ${goal} ÷ ${ratioA} = ${roundTo(scaleFactor, 2)}`,
            `Holofoil count: ${ratioB} × ${roundTo(scaleFactor, 2)} = ${roundTo(
              ratioB * scaleFactor,
              2
            )}`,
            `Equation: y = (${ratioB}/${ratioA})x`,
          ],
        },
        extension:
          'Compare the proportional graph to a table of values and discuss what happens if the shop only receives full sets of 5 bundles.',
      };
    },
  },
  {
    domain: '7.NS',
    standard: 'CCSS.MATH.CONTENT.7.NS.A.1',
    skill: 'Add and subtract rational numbers',
    title: 'Editing Suite Energy',
    tags: ['Filmmaking', 'Integers'],
    generator: () => {
      const caffeine = [-1.5, -2, -2.5][randomInt(0, 2)];
      const breaks = [0.5, 0.75, 1][randomInt(0, 2)];
      const sessions = randomInt(3, 5);
      const netChange = sessions * caffeine + breaks;
      return {
        scenario:
          `During late-night editing, Andrew loses ${Math.abs(caffeine)} energy points per hour (negative change) but gains ${breaks} energy points from a break. After ${sessions} hours,`,
        question:
          'What is the net change in his energy level? How could he balance the expression to end at zero?',
        solution: {
          steps: [
            `Net energy = ${sessions}(${caffeine}) + ${breaks} = ${roundTo(
              sessions * caffeine,
              2
            )} + ${breaks} = ${roundTo(netChange, 2)}`,
            `To reach zero, add ${roundTo(-netChange, 2)} energy points (another break or snack).`,
          ],
        },
        extension:
          'Represent the integer changes on a vertical number line or ask students to design a schedule with alternating positive and negative moves that sum to zero.',
      };
    },
  },
  {
    domain: '7.G',
    standard: 'CCSS.MATH.CONTENT.7.G.B.6',
    skill: 'Solve real-world problems involving area and volume',
    title: 'Props Department Volume',
    tags: ['Filmmaking', '3D Geometry'],
    generator: () => {
      const length = randomInt(6, 10);
      const width = randomInt(4, 7);
      const height = randomInt(3, 6);
      const volume = length * width * height;
      return {
        scenario:
          `Andrew stores animatronic props in rectangular crates measuring ${length} ft by ${width} ft by ${height} ft.`,
        question:
          'What is the volume of one crate? If he needs to stack three crates in a storage van that holds 900 cubic feet, how much volume remains?',
        solution: {
          steps: [
            `Volume: ${length} × ${width} × ${height} = ${volume} cubic ft`,
            `Three crates: ${volume} × 3 = ${volume * 3} cubic ft`,
            `Remaining: 900 - ${volume * 3} = ${900 - volume * 3} cubic ft`,
          ],
        },
        extension:
          'Invite students to redesign the crates keeping the same volume but altering dimensions to fit narrow doorways.',
      };
    },
  },
  {
    domain: '7.SP',
    standard: 'CCSS.MATH.CONTENT.7.SP.C.7',
    skill: 'Develop probability models',
    title: 'Box Office Probability',
    tags: ['Film Release', 'Probability'],
    generator: () => {
      const totalCards = 20;
      const blockbuster = randomInt(6, 9);
      const cult = randomInt(4, 7);
      const flop = totalCards - blockbuster - cult;
      return {
        scenario:
          `Andrew designs a card game predicting film premieres. In a deck of ${totalCards} cards, ${blockbuster} predict "blockbuster", ${cult} predict "cult classic", and the rest predict "flop".`,
        question:
          'What is the probability of drawing each outcome? If two cards are drawn without replacement, what is the probability they are both blockbusters?',
        solution: {
          steps: [
            `Flop cards: ${flop}`,
            `P(blockbuster) = ${blockbuster}/${totalCards}`,
            `P(cult classic) = ${cult}/${totalCards}`,
            `P(flop) = ${flop}/${totalCards}`,
            `Two blockbusters: (${blockbuster}/${totalCards}) × (${blockbuster - 1}/$${totalCards - 1}) = ${roundTo(
              (blockbuster / totalCards) * ((blockbuster - 1) / (totalCards - 1)),
              3
            )}`,
          ],
        },
        extension:
          'Have students simulate draws with spinners or a digital tool and compare experimental probability to the theoretical model.',
      };
    },
  },
];

const studentMissions = [
  {
    title: 'Midnight Issue Mix-Up',
    vibe: 'Comic Vault Heist',
    domainTag: '7.RP.A.3',
    generator: () => {
      const fullPrice = randomInt(32, 48);
      const discount = 20;
      const tax = 8.5;
      const discounted = fullPrice * (1 - discount / 100);
      const total = discounted * (1 + tax / 100);
      return {
        hook:
          'Your horror subscription box arrived late! To calm the fans, the shop gives you 20% off before adding 8.5% tax.',
        challenge: `The stack\'s sticker price is $${fullPrice}.`,
        task: 'Calculate what you actually pay and show how much your dad owes you back (25% of your final bill).',
        answer: `Final cost $${roundTo(total, 2)}; reimbursement $${roundTo(
          total * 0.25,
          2
        )}.`,
        strategy:
          'Slice the price by 20%, then multiply by 1.085. Multiply the result by 0.25 to find Dad\'s share.',
      };
    },
  },
  {
    title: 'Storyboard Speedrun',
    vibe: 'On-Set Sprint',
    domainTag: '7.EE.B.4',
    generator: () => {
      const panels = randomInt(60, 84);
      const perPage = randomInt(5, 7);
      const equation = `${perPage}p + 12 = ${panels}`;
      const pages = Math.floor((panels - 12) / perPage);
      return {
        hook:
          'Director Luna needs your storyboard counts now so the effects team can start rigging the monster reveal.',
        challenge: `You already have 12 action shots drawn and a total of ${panels} panels planned.`,
        task: `Solve ${equation} to find the number of finished storyboard pages, then decide how many new pages to draw if the producer adds two more chase scenes (same panels per page).`,
        answer: `${pages} pages done; add 2 more scenes → ${pages + 2} total pages.`,
        strategy:
          'Work backwards: subtract the 12 extra shots, then divide by panels per page.',
      };
    },
  },
  {
    title: 'Lighting Crew Ratios',
    vibe: 'Film Lab Puzzle',
    domainTag: '7.RP.A.2',
    generator: () => {
      const leds = randomInt(12, 16);
      const gels = randomInt(18, 24);
      const scale = randomInt(2, 4);
      return {
        hook:
          'To make the horror set glow just right, every LED panel needs matching color gels in a set ratio.',
        challenge: `In rehearsal you used ${leds} LED panels for ${gels} gels. The director wants the setup scaled by ${scale}.`,
        task: 'How many LED panels and gels do you order now? Write an equation that matches the proportional relationship.',
        answer: `${leds * scale} LED panels and ${gels * scale} gels; equation y = ${(gels / leds).toFixed(2)}x.`,
        strategy:
          'Multiply both sides of the ratio by the same scale factor to keep the proportions balanced.',
      };
    },
  },
  {
    title: 'Box Office Predictions',
    vibe: 'Analytics Mission',
    domainTag: '7.SP.C.7',
    generator: () => {
      const sample = [randomInt(12, 20), randomInt(8, 14), randomInt(6, 12)];
      const total = sample.reduce((sum, x) => sum + x, 0);
      const probability = roundTo(sample[0] / total, 2);
      return {
        hook:
          'Your promo team tested a card game where fans predict horror film success.',
        challenge: `Out of ${total} guesses, ${sample[0]} shouted "blockbuster", ${sample[1]} yelled "cult classic", and ${sample[2]} warned "flop."`,
        task: 'What is the probability the next fan predicts blockbuster? If two fans guess back-to-back without repeating cards, what is the chance both shout blockbuster?',
        answer: `Single draw probability ${probability}; double draw ${(sample[0] / total * (sample[0] - 1) / (total - 1)).toFixed(3)}.`,
        strategy:
          'Probability = favorable outcomes over total. For two draws without replacement, multiply two fractions with one less in both numerator and denominator the second time.',
      };
    },
  },
];

function renderTeacherCard(problem, reveal) {
  const { scenario, question, solution, extension } = problem;
  teacherOutput.innerHTML = `
    <div class="card__header">
      <div>
        <h3>${problem.title}</h3>
        <div class="tag">${problem.domain} • ${problem.standard}</div>
      </div>
      <span class="badge">${problem.skill}</span>
    </div>
    <div class="card__section">
      <h3>Scenario</h3>
      <p>${scenario}</p>
    </div>
    <div class="card__section">
      <h3>Prompt</h3>
      <p>${question}</p>
    </div>
    ${
      reveal
        ? `<div class="card__section">
            <h3>Solution Sketch</h3>
            <ul class="inline-list">${solution.steps
              .map((step) => `<li>${step}</li>`)
              .join('')}</ul>
          </div>`
        : ''
    }
    <div class="card__section">
      <h3>Teacher Move</h3>
      <p>${extension}</p>
    </div>
    <div class="card__section">
      <h3>Context Tags</h3>
      <ul class="inline-list">${problem.tags
        .map((tag) => `<li class="tag">${tag}</li>`)
        .join('')}</ul>
    </div>
  `;
}

function renderStudentCard(mission) {
  studentOutput.innerHTML = `
    <div class="card__header">
      <div>
        <h3>${mission.title}</h3>
        <div class="tag">${mission.vibe} • ${mission.domainTag}</div>
      </div>
      <button class="generate" id="revealStudent">Reveal Solution</button>
    </div>
    <div class="card__section">
      <h3>Plot Hook</h3>
      <p>${mission.hook}</p>
    </div>
    <div class="card__section">
      <h3>Your Challenge</h3>
      <p>${mission.challenge}</p>
    </div>
    <div class="card__section">
      <h3>Mission Objective</h3>
      <p>${mission.task}</p>
    </div>
    <div class="card__section" id="studentReveal" hidden>
      <h3>Answer &amp; Strategy</h3>
      <p><strong>Solution:</strong> ${mission.answer}</p>
      <p><strong>Strategy:</strong> ${mission.strategy}</p>
    </div>
  `;

  const revealBtn = document.getElementById('revealStudent');
  const revealSection = document.getElementById('studentReveal');
  revealBtn.addEventListener('click', () => {
    revealSection.hidden = !revealSection.hidden;
    revealBtn.textContent = revealSection.hidden ? 'Reveal Solution' : 'Hide Solution';
  });
}

function getTeacherProblem(domain) {
  const pool =
    domain === 'all'
      ? teacherPrompts
      : teacherPrompts.filter((problem) => problem.domain === domain);
  const selection = randomChoice(pool);
  return selection.generator();
}

function getTeacherMeta(domain) {
  const pool =
    domain === 'all'
      ? teacherPrompts
      : teacherPrompts.filter((problem) => problem.domain === domain);
  return randomChoice(pool);
}

function handleTeacherGeneration() {
  const domainValue = domainSelect.value;
  const reveal = teacherRevealToggle.checked;
  const meta = getTeacherMeta(domainValue);
  const problem = meta.generator();
  renderTeacherCard({ ...meta, ...problem }, reveal);
}

function handleStudentGeneration() {
  const template = randomChoice(studentMissions);
  const mission = template.generator();
  renderStudentCard({ ...template, ...mission });
}

teacherModeBtn.addEventListener('click', () => {
  teacherModeBtn.classList.add('active');
  studentModeBtn.classList.remove('active');
  teacherPanel.hidden = false;
  studentPanel.hidden = true;
});

studentModeBtn.addEventListener('click', () => {
  studentModeBtn.classList.add('active');
  teacherModeBtn.classList.remove('active');
  studentPanel.hidden = false;
  teacherPanel.hidden = true;
});

generateTeacherBtn.addEventListener('click', handleTeacherGeneration);
generateStudentBtn.addEventListener('click', handleStudentGeneration);

// Seed initial card for teachers
handleTeacherGeneration();
