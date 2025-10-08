const standardsCatalog = [
  {
    code: 'CCSS.MATH.CONTENT.7.RP.A.3',
    strand: 'Ratios & Proportional Relationships',
    summary:
      'Solve multi-step ratio and percent problems involving discounts, markups, interest, tax, and percent increase or decrease in authentic contexts.'
  },
  {
    code: 'CCSS.MATH.CONTENT.7.EE.B.3',
    strand: 'Expressions & Equations',
    summary:
      'Solve multi-step real-life problems using positive and negative rational numbers, including the strategic use of properties of operations.'
  },
  {
    code: 'CCSS.MATH.CONTENT.7.EE.B.4',
    strand: 'Expressions & Equations',
    summary:
      'Use variables to represent real-world quantities and construct simple equations and inequalities to solve problems.'
  },
  {
    code: 'CCSS.MATH.CONTENT.7.NS.A.2',
    strand: 'The Number System',
    summary:
      'Apply and extend previous understandings of multiplication and division to multiply and divide rational numbers.'
  },
  {
    code: 'CCSS.MATH.CONTENT.7.NS.A.3',
    strand: 'The Number System',
    summary:
      'Solve real-world problems involving the four operations with rational numbers, including interpreting remainders.'
  },
  {
    code: 'CCSS.MATH.CONTENT.7.SP.C.6',
    strand: 'Statistics & Probability',
    summary:
      'Approximate probabilities by collecting data on the chance process and observing its long-run relative frequency.'
  },
  {
    code: 'CCSS.MATH.CONTENT.7.SP.B.4',
    strand: 'Statistics & Probability',
    summary:
      'Use measures of center and variability to draw informal comparative inferences about two populations.'
  }
];

const roundTo = (value, decimals = 2) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const toCurrency = value => `$${roundTo(value, 2).toFixed(2)}`;
const toPercent = (value, decimals = 0) => `${roundTo(value * 100, decimals)}%`;
const choose = array => array[Math.floor(Math.random() * array.length)];
const formatList = items => items.map(item => `<li>${item}</li>`).join('');

const generatorLibrary = [
  {
    id: 'crew-shift-warmup',
    title: 'Crew Text: Quick Cover',
    context: 'film',
    skill: 'percents',
    difficulty: 'easy',
    standards: ['CCSS.MATH.CONTENT.7.RP.A.3'],
    generate: () => {
      const weekendHours = choose([10, 12, 15]);
      const coverageRate = choose([0.1, 0.2]);
      const coveragePercent = Math.round(coverageRate * 100);
      const coverageDecimal = roundTo(coverageRate, 2);
      const coverageHours = roundTo(weekendHours * coverageRate, 1);

      return {
        title: 'Crew Text: Quick Cover',
        contextLine: 'Film crew favor • Percent of a weekend shift',
        prompt: `Read aloud: "A director friend texts Andrew: 'Can you cover ${coveragePercent}% of our ${weekendHours}-hour weekend shoot so our key grip can rest?' How many hours should Andrew block so his yes means something?"`,
        solutionSteps: [
          `${coveragePercent}% as a decimal is ${coverageDecimal}.`,
          `${coveragePercent}% of ${weekendHours} hours = ${weekendHours} × ${coverageDecimal} = ${coverageHours} hours.`
        ],
        finalAnswer: `Andrew should reserve ${coverageHours} hours to cover ${coveragePercent}% of the shoot.`,
        whyItMatters: 'Andrew interprets a percent request from film text threads before committing his time.',
        extension: 'Ask what happens if the text had said 15% instead and compare the new coverage hours.'
      };
    }
  },
  {
    id: 'crew-shift-practice',
    title: 'Crew Call: Percent Plus Editing Time',
    context: 'film',
    skill: 'percents',
    difficulty: 'medium',
    standards: ['CCSS.MATH.CONTENT.7.RP.A.3'],
    generate: () => {
      const weekendHours = choose([18, 20, 22]);
      const coverageRate = choose([0.25, 0.3]);
      const coveragePercent = roundTo(coverageRate * 100, 0);
      const coverageDecimal = roundTo(coverageRate, 2);
      const coverageHours = roundTo(weekendHours * coverageRate, 1);
      const editingHours = choose([4, 5]);
      const leftover = roundTo(weekendHours - coverageHours - editingHours, 1);

      return {
        title: 'Crew Call: Percent Plus Editing Time',
        contextLine: 'Weekend scheduling • Combining percents with subtraction',
        prompt: `Read aloud: "Andrew's friend says, 'Could you cover ${coveragePercent}% of our ${weekendHours}-hour weekend shoot? I can swap you out after that.' Andrew already blocked ${editingHours} hours to edit a behind-the-scenes reel. After he helps, how many weekend hours remain unscheduled?"`,
        solutionSteps: [
          `${coveragePercent}% as a decimal is ${coverageDecimal}.`,
          `Coverage time = ${weekendHours} × ${coverageDecimal} = ${coverageHours} hours.`,
          `Remaining hours = ${weekendHours} - ${coverageHours} - ${editingHours} = ${leftover} hours.`
        ],
        finalAnswer: `Andrew covers ${coverageHours} hours and still has ${leftover} hours open for the rest of the weekend.`,
        whyItMatters: 'He has to translate percent requests into a real schedule before he replies to crew texts.',
        extension: 'Have students change the editing block to 6 hours and see if Andrew still has free time.'
      };
    }
  },
  {
    id: 'crew-shift-challenge',
    title: 'Crew Swap: Percent with Rest Check',
    context: 'film',
    skill: 'percents',
    difficulty: 'hard',
    standards: ['CCSS.MATH.CONTENT.7.RP.A.3'],
    generate: () => {
      const scenarios = [
        { weekendHours: 24, coverageRate: 0.35, editingHours: 5, commuteHours: 3 },
        { weekendHours: 26, coverageRate: 0.35, editingHours: 5, commuteHours: 4 },
        { weekendHours: 24, coverageRate: 0.35, editingHours: 4, commuteHours: 4 },
        { weekendHours: 26, coverageRate: 0.4, editingHours: 4, commuteHours: 4 }
      ];
      const restGoal = 6;
      const scenario = choose(scenarios);
      const { weekendHours, coverageRate, editingHours, commuteHours } = scenario;
      const coveragePercent = roundTo(coverageRate * 100, 0);
      const coverageDecimal = roundTo(coverageRate, 2);
      const coverageHours = roundTo(weekendHours * coverageRate, 1);
      const scheduled = roundTo(coverageHours + editingHours + commuteHours, 1);
      const leftover = roundTo(weekendHours - scheduled, 1);
      const meetsRest = leftover >= restGoal;

      return {
        title: 'Crew Swap: Percent with Rest Check',
        contextLine: 'Weekend logistics • Percent work time plus constraints',
        prompt: `Read aloud: "Andrew is told, 'Cover ${coveragePercent}% of our ${weekendHours}-hour weekend shoot and we'll pay for rides.' He also promised ${editingHours} hours for script polish and expects commuting to eat ${commuteHours} hours total. He wants at least ${restGoal} hours left for rest. After scheduling everything, does he meet that goal?"`,
        solutionSteps: [
          `Crew coverage = ${weekendHours} × ${coverageDecimal} = ${coverageHours} hours.`,
          `Total scheduled = ${coverageHours} + ${editingHours} + ${commuteHours} = ${scheduled} hours.`,
          `Remaining = ${weekendHours} - ${scheduled} = ${leftover} hours, compared with the ${restGoal}-hour rest goal.`
        ],
        finalAnswer: `Andrew blocks ${coverageHours} crew hours and has ${leftover} hours free, so he ${meetsRest ? 'meets' : 'misses'} the ${restGoal}-hour rest goal.`,
        whyItMatters: "Percent work promises only matter if they fit with Andrew's commute and rest plan.",
        extension: 'Adjust the commute time by an hour either way and discuss how it changes the decision.'
      };
    }
  },
  {
    id: 'binder-warmup',
    title: 'Binder Prep Count',
    context: 'comics',
    skill: 'numbers',
    difficulty: 'easy',
    standards: ['CCSS.MATH.CONTENT.7.NS.A.3'],
    generate: () => {
      const issues = choose([18, 22, 27, 31, 34]);
      const perBinder = 6;
      const fullBinders = Math.floor(issues / perBinder);
      const looseIssues = issues % perBinder;

      return {
        title: 'Binder Prep Count',
        contextLine: 'Collection care • Grouping comics for storage',
        prompt: `Read aloud: "Andrew is packing story arcs into binders that hold ${perBinder} issues each. If he has ${issues} single issues ready, how many full binders can he set up, and how many issues still need a backing board?"`,
        solutionSteps: [
          `${issues} ÷ ${perBinder} = ${fullBinders} remainder ${looseIssues}.`,
          `${fullBinders} full binders with ${looseIssues} loose issues left to protect.`
        ],
        finalAnswer: `Andrew can prep ${fullBinders} full binders and will still have ${looseIssues} single issues to bag separately.`,
        whyItMatters: 'He has to interpret the remainder to keep his favorite arcs safe for Artist Alley.',
        extension: 'Ask how many more issues Andrew needs to fill one more binder completely.'
      };
    }
  },
  {
    id: 'color-sprint-practice',
    title: 'Coloring Sprint Daily Goal',
    context: 'comics',
    skill: 'numbers',
    difficulty: 'medium',
    standards: ['CCSS.MATH.CONTENT.7.RP.A.3'],
    generate: () => {
      const totalPages = choose([48, 60, 72]);
      const days = choose([12, 15]);
      const pagesPerDayTogether = roundTo(totalPages / days, 2);
      const perArtist = roundTo(pagesPerDayTogether / 2, 2);

      return {
        title: 'Coloring Sprint Daily Goal',
        contextLine: 'Production schedule • Splitting a page quota',
        prompt: `Read aloud: "Andrew and a collaborator promised to color a ${totalPages}-page indie comic in ${days} days, dividing the work evenly each day. How many pages should they finish together per day, and how many pages is that for Andrew himself?"`,
        solutionSteps: [
          `Daily team quota = ${totalPages} ÷ ${days} = ${pagesPerDayTogether} pages.`,
          `Andrew's share = ${pagesPerDayTogether} ÷ 2 = ${perArtist} pages per day.`
        ],
        finalAnswer: `The team must color ${pagesPerDayTogether} pages per day, so Andrew handles ${perArtist} pages daily.`,
        whyItMatters: 'Andrew needs the per-day breakdown before promising a delivery date to the creator.',
        extension: 'Change the deadline by two days and find the new per-person pace.'
      };
    }
  },
  {
    id: 'mystery-pack-challenge',
    title: 'Mystery Pack Assembly Plan',
    context: 'comics',
    skill: 'numbers',
    difficulty: 'hard',
    standards: ['CCSS.MATH.CONTENT.7.NS.A.3'],
    generate: () => {
      const packPlans = [
        { heroPrints: 36, villainPrints: 26 },
        { heroPrints: 42, villainPrints: 30 },
        { heroPrints: 48, villainPrints: 28 }
      ];
      const plan = choose(packPlans);
      const heroPerPack = 3;
      const villainPerPack = 2;
      const packsFromHero = Math.floor(plan.heroPrints / heroPerPack);
      const packsFromVillain = Math.floor(plan.villainPrints / villainPerPack);
      const fullPacks = Math.min(packsFromHero, packsFromVillain);
      const heroLeft = plan.heroPrints - fullPacks * heroPerPack;
      const villainLeft = plan.villainPrints - fullPacks * villainPerPack;

      return {
        title: 'Mystery Pack Assembly Plan',
        contextLine: 'Convention prep • Using ratios to build bundles',
        prompt: `Read aloud: "Andrew is stuffing mystery packs with 3 hero prints and 2 villain prints each. One printer delivery gives him ${plan.heroPrints} hero prints and ${plan.villainPrints} villain prints. How many full packs can he promise the table, and what prints stay loose?"`,
        solutionSteps: [
          `Hero prints allow ${plan.heroPrints} ÷ ${heroPerPack} = ${packsFromHero} packs.`,
          `Villain prints allow ${plan.villainPrints} ÷ ${villainPerPack} = ${packsFromVillain} packs.`,
          `Full packs = min(${packsFromHero}, ${packsFromVillain}) = ${fullPacks}.`,
          `Leftovers: ${plan.heroPrints} - (${fullPacks} × ${heroPerPack}) = ${heroLeft} hero prints; ${plan.villainPrints} - (${fullPacks} × ${villainPerPack}) = ${villainLeft} villain prints.`
        ],
        finalAnswer: `Andrew can seal ${fullPacks} full mystery packs, leaving ${heroLeft} hero prints and ${villainLeft} villain prints loose for display.`,
        whyItMatters: 'He has to use ratio reasoning to keep the packs balanced before the doors open.',
        extension: 'Ask how many more villain prints he should order to use every hero print.'
      };
    }
  },
  {
    id: 'long-box-warmup',
    title: 'Long Box Price Check',
    context: 'comics',
    skill: 'equations',
    difficulty: 'easy',
    standards: ['CCSS.MATH.CONTENT.7.EE.B.3', 'CCSS.MATH.CONTENT.7.EE.B.4'],
    generate: () => {
      const sleeveCost = choose([7.5, 8.5, 9]);
      const totalSpend = choose([46, 52, 58]);
      const subtotal = roundTo(totalSpend - sleeveCost, 2);
      const boxPrice = roundTo(subtotal / 2, 2);

      return {
        title: 'Long Box Price Check',
        contextLine: 'Budgeting • Solving a one-step equation',
        prompt: `Read aloud: "Andrew is double-checking a quote: two identical long boxes plus ${toCurrency(sleeveCost)} of archival sleeves total ${toCurrency(totalSpend)}. What price per long box should he text back before he agrees?"`,
        solutionSteps: [
          `Let x be the price of one long box.`,
          `Equation: 2x + ${toCurrency(sleeveCost)} = ${toCurrency(totalSpend)}.`,
          `Subtract sleeves: 2x = ${toCurrency(subtotal)}.`,
          `x = ${toCurrency(subtotal)} ÷ 2 = ${toCurrency(boxPrice)}.`
        ],
        finalAnswer: `Each long box should cost ${toCurrency(boxPrice)} for the quote to make sense.`,
        whyItMatters: 'Andrew solves a simple equation to be sure the storage deal is fair.',
        extension: 'Swap in three boxes instead and solve the new equation together.'
      };
    }
  },
  {
    id: 'runtime-practice',
    title: 'Runtime Equation Pitch',
    context: 'film',
    skill: 'equations',
    difficulty: 'medium',
    standards: ['CCSS.MATH.CONTENT.7.EE.B.4'],
    generate: () => {
      const runtimeSeconds = choose([360, 390]);
      const specialSceneLength = choose([48, 54]);
      const baseSceneLength = choose([30, 36]);
      const regularScenes = Math.floor((runtimeSeconds - specialSceneLength) / baseSceneLength);

      return {
        title: 'Runtime Equation Pitch',
        contextLine: 'Episode planning • Using an equation to hit a target length',
        prompt: `Read aloud: "Andrew must prove to his faculty advisor that his short episode will land at ${runtimeSeconds / 60} minutes (${runtimeSeconds} seconds). One finale sequence lasts ${specialSceneLength} seconds, and every other scene template is ${baseSceneLength} seconds. Set up and solve an equation to find how many regular scenes he can script."`,
        solutionSteps: [
          `Let x = number of regular scenes.`,
          `Equation: ${baseSceneLength}x + ${specialSceneLength} = ${runtimeSeconds}.`,
          `${baseSceneLength}x = ${runtimeSeconds - specialSceneLength}.`,
          `x = ${runtimeSeconds - specialSceneLength} ÷ ${baseSceneLength} = ${regularScenes}.`
        ],
        finalAnswer: `Andrew can script ${regularScenes} regular scenes plus the finale to hit the runtime target.`,
        whyItMatters: 'He needs to defend his scene count before the advisor locks the schedule.',
        extension: 'Add a 12-second teaser and resolve the new equation with the class.'
      };
    }
  },
  {
    id: 'budget-challenge',
    title: 'Signing Line Budget Decisions',
    context: 'comics',
    skill: 'equations',
    difficulty: 'hard',
    standards: ['CCSS.MATH.CONTENT.7.EE.B.3'],
    generate: () => {
      const budget = 75;
      const items = [
        { name: 'Signed hero poster', price: 24.5 },
        { name: 'Foil variant comic', price: 22.4 },
        { name: 'Artist sketchbook', price: 18.75 },
        { name: 'DIY costume toolkit', price: 28.6 }
      ];

      const combos = [];
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const total = roundTo(items[i].price + items[j].price);
          if (total <= budget) {
            combos.push({
              pair: `${items[i].name} + ${items[j].name}`,
              total,
              leftover: roundTo(budget - total)
            });
          }
        }
      }

      let cheapestThreeTotal = Infinity;
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          for (let k = j + 1; k < items.length; k++) {
            const total = roundTo(items[i].price + items[j].price + items[k].price);
            if (total < cheapestThreeTotal) {
              cheapestThreeTotal = total;
            }
          }
        }
      }

      const canBuyThree = cheapestThreeTotal <= budget;
      const sortedCombos = [...combos].sort((a, b) => b.leftover - a.leftover);
      const comboList = sortedCombos.map(
        combo => `${combo.pair}: ${toCurrency(combo.total)} (leftover ${toCurrency(combo.leftover)})`
      );
      const bestCombo = sortedCombos[0];
      const bestTwoItemMessage = bestCombo
        ? `Best two-item pick: ${bestCombo.pair} leaves ${toCurrency(bestCombo.leftover)}.`
        : 'No two-item combo fits the budget.';
      const threeItemMessage = canBuyThree
        ? `At least one three-item bundle fits because the cheapest costs ${toCurrency(cheapestThreeTotal)}.`
        : `No three-item bundle fits because the cheapest costs ${
            Number.isFinite(cheapestThreeTotal) ? toCurrency(cheapestThreeTotal) : 'N/A'
          }.`;

      return {
        title: 'Signing Line Budget Decisions',
        contextLine: 'Convention budgeting • Comparing combinations under a cap',
        prompt: `Read aloud: "Andrew is texting from the signing line: 'I can only spend $${budget} today. Which two-item combo keeps me under budget with the most cash left, and is there any three-item combo that still works?' Help him respond with confidence."`,
        solutionSteps: [
          threeItemMessage,
          comboList.length ? 'Two-item bundles within budget:' : 'No two-item bundle fits the budget.',
          ...comboList
        ],
        finalAnswer: `${threeItemMessage} ${bestTwoItemMessage}`,
        whyItMatters: 'Andrew weighs combinations against his cash before promising a purchase.',
        extension: 'Add a new merch item or change the budget and recompute the best bundle.'
      };
    }
  },
  {
    id: 'retake-warmup',
    title: 'Reshoot Log Average',
    context: 'film',
    skill: 'stats',
    difficulty: 'easy',
    standards: ['CCSS.MATH.CONTENT.7.SP.B.4'],
    generate: () => {
      const retakesSets = [
        [1, 2, 2, 3],
        [2, 3, 2, 4],
        [1, 3, 3, 4]
      ];
      const retakes = choose(retakesSets);
      const labels = ['Scene 1', 'Scene 2', 'Scene 3', 'Scene 4'];
      const sum = retakes.reduce((a, b) => a + b, 0);
      const mean = roundTo(sum / retakes.length, 2);
      const mostRetakes = Math.max(...retakes);
      const hardestSceneIndex = retakes.indexOf(mostRetakes);

      return {
        title: 'Reshoot Log Average',
        contextLine: 'Set report • Mean retakes in four scenes',
        prompt: `Read aloud: "Andrew logged retake counts for four scenes: ${retakes.join(', ')}. What average should he email to the advisor, and which scene needs the most rehearsal time tomorrow?"`,
        solutionSteps: [
          `Mean = (${retakes.join(' + ')}) ÷ 4 = ${mean}.`,
          `Most retakes: ${mostRetakes} on ${labels[hardestSceneIndex]}.`
        ],
        finalAnswer: `Average of ${mean} retakes; ${labels[hardestSceneIndex]} needs the most help with ${mostRetakes} retakes.`,
        whyItMatters: 'Andrew summarizes set data so his advisor knows where to focus coaching.',
        extension: 'Have students graph the retake counts and suggest a rehearsal plan.'
      };
    }
  },
  {
    id: 'variant-probability-practice',
    title: 'Blind-Bag Odds Check',
    context: 'comics',
    skill: 'stats',
    difficulty: 'medium',
    standards: ['CCSS.MATH.CONTENT.7.SP.C.6'],
    generate: () => {
      const totalBags = 40;
      const glowVariants = choose([6, 8, 10]);
      const sketchVariants = choose([5, 6, 7]);
      const regular = totalBags - glowVariants - sketchVariants;
      const glowProbability = roundTo(glowVariants / totalBags, 2);
      const sketchProbability = roundTo(sketchVariants / totalBags, 2);

      return {
        title: 'Blind-Bag Odds Check',
        contextLine: "Probability • Interpreting a shop keeper's ratios",
        prompt: `Read aloud: "Andrew promised his cousin they would open ${totalBags} blind-bag comics tonight. The shop owner says there are ${glowVariants} glow variants, ${sketchVariants} sketch variants, and the rest regular covers. What is the probability of pulling each special cover on a single draw so Andrew can set expectations?"`,
        solutionSteps: [
          `P(glow) = ${glowVariants} ÷ ${totalBags} = ${glowProbability} (${toPercent(glowVariants / totalBags)}).`,
          `P(sketch) = ${sketchVariants} ÷ ${totalBags} = ${sketchProbability} (${toPercent(sketchVariants / totalBags)}).`,
          `Regular covers = ${regular} of ${totalBags} bags.`
        ],
        finalAnswer: `Glow odds: ${glowProbability} (${toPercent(glowVariants / totalBags)}); Sketch odds: ${sketchProbability} (${toPercent(sketchVariants / totalBags)}).`,
        whyItMatters: 'Andrew explains the probabilities before his cousin trades away a favorite pull.',
        extension: 'Ask what the probability would be after one glow variant is removed from the box.'
      };
    }
  },
  {
    id: 'variant-probability-challenge',
    title: 'Two-Draw Glow Guarantee',
    context: 'comics',
    skill: 'stats',
    difficulty: 'hard',
    standards: ['CCSS.MATH.CONTENT.7.SP.C.6'],
    generate: () => {
      const totalBags = 40;
      const glowVariants = choose([6, 8, 10]);
      const sketchVariants = choose([5, 6, 7]);
      const nonGlow = totalBags - glowVariants;
      const noGlowProbability = roundTo((nonGlow / totalBags) * ((nonGlow - 1) / (totalBags - 1)), 4);
      const atLeastOneGlow = roundTo(1 - noGlowProbability, 4);

      return {
        title: 'Two-Draw Glow Guarantee',
        contextLine: 'Probability • Complement strategy with blind bags',
        prompt: `Read aloud: "Andrew told his cousin, 'If we grab two blind bags without replacement, we should almost guarantee at least one glow cover.' The box holds ${glowVariants} glow variants and ${sketchVariants} sketch variants among ${totalBags} books. What is the probability they end up with at least one glow cover in two pulls?"`,
        solutionSteps: [
          `Non-glow covers = ${nonGlow}.`,
          `P(no glow in two pulls) = (${nonGlow} ÷ ${totalBags}) × (${nonGlow - 1} ÷ ${totalBags - 1}) = ${noGlowProbability}.`,
          `P(at least one glow) = 1 - ${noGlowProbability} = ${atLeastOneGlow} (${toPercent(atLeastOneGlow, 1)}).`
        ],
        finalAnswer: `Andrew can quote a ${toPercent(atLeastOneGlow, 1)} chance of seeing at least one glow cover in two pulls.`,
        whyItMatters: "He interprets probability so he doesn't overpromise rare covers to family.",
        extension: 'Have students compare the probability if they could choose three bags instead of two.'
      };
    }
  }
];

const elements = {
  context: document.getElementById('context'),
  skill: document.getElementById('skill'),
  difficulty: document.getElementById('difficulty'),
  generate: document.getElementById('generate'),
  problemTitle: document.getElementById('problem-title'),
  problemContext: document.getElementById('problem-context'),
  problemText: document.getElementById('problem-text'),
  standards: document.getElementById('standard-tags'),
  solutionBox: document.getElementById('solution-box'),
  extensionBox: document.getElementById('extension-box'),
  researchCard: document.getElementById('research-card'),
  standardsList: document.getElementById('standards-list')
};

const renderStandardsReference = () => {
  elements.standardsList.innerHTML = standardsCatalog
    .map(
      entry => `
        <article class="standard-pill">
          <h4>${entry.code.replace('CCSS.MATH.CONTENT.', '')}</h4>
          <span class="standard-strand">${entry.strand}</span>
          <p>${entry.summary}</p>
        </article>
      `
    )
    .join('');
};

const renderProblem = () => {
  const contextFilter = elements.context.value;
  const skillFilter = elements.skill.value;
  const difficultyFilter = elements.difficulty.value;

  const filtered = generatorLibrary.filter(generator => {
    const contextMatch = contextFilter === 'all' || generator.context === contextFilter;
    const skillMatch = skillFilter === 'all' || generator.skill === skillFilter;
    const difficultyMatch = difficultyFilter === 'all' || generator.difficulty === difficultyFilter;
    return contextMatch && skillMatch && difficultyMatch;
  });

  if (!filtered.length) {
    elements.problemTitle.textContent = 'No generator found';
    elements.problemContext.textContent = 'Try widening your filters to see more math-story combos.';
    elements.problemText.textContent = '';
    elements.standards.innerHTML = '';
    elements.solutionBox.innerHTML = '';
    elements.extensionBox.innerHTML = '';
    return;
  }

  const selection = choose(filtered);
  const problem = selection.generate();
  const difficultyLabelMap = {
    easy: 'Level 1 – Warm-Up',
    medium: 'Level 2 – Practice',
    hard: 'Level 3 – Challenge'
  };
  const difficultyText = difficultyLabelMap[selection.difficulty] || 'Custom Level';

  elements.problemTitle.textContent = problem.title;
  elements.problemContext.textContent = `${problem.contextLine} • ${difficultyText}`;
  elements.problemText.textContent = problem.prompt;
  elements.standards.innerHTML = selection.standards
    .map(code => `<span class="standard-tag">${code.replace('CCSS.MATH.CONTENT.', '')}</span>`)
    .join('');

  elements.solutionBox.innerHTML = `
    <h3>Solution Path</h3>
    <ol>${formatList(problem.solutionSteps)}</ol>
    <p class="final-answer"><strong>Answer:</strong> ${problem.finalAnswer}</p>
    <p class="why"><strong>Teacher note:</strong> ${problem.whyItMatters}</p>
  `;

  elements.extensionBox.innerHTML = `
    <h3>Extension Idea</h3>
    <p>${problem.extension}</p>
  `;

  elements.researchCard.querySelector('h3').textContent = 'Quick Teacher Notes';
  elements.researchCard.querySelector('p').textContent = 'Each card gives a prompt, answer path, and a short extension.';
};

elements.generate.addEventListener('click', renderProblem);

elements.context.addEventListener('change', renderProblem);
elements.skill.addEventListener('change', renderProblem);
elements.difficulty.addEventListener('change', renderProblem);

renderStandardsReference();
