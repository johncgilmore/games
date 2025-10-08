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

const choose = array => array[Math.floor(Math.random() * array.length)];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const ensureNotMultiple = (min, max, forbidden) => {
  let value = randomInt(min, max);
  while (forbidden.some(num => value % num === 0)) {
    value = randomInt(min, max);
  }
  return value;
};

const formatList = items => items.map(item => `<li>${item}</li>`).join('');

const generatorLibrary = [
  {
    id: 'pull-list-discount',
    title: 'Pull-Box Discount Check',
    context: 'comics',
    skill: 'percents',
    standards: ['CCSS.MATH.CONTENT.7.RP.A.3', 'CCSS.MATH.CONTENT.7.EE.B.3'],
    generate: () => {
      const subtotal = choose([48, 56, 64, 72, 84]);
      const discountRate = 0.2;
      const taxRate = 0.085;
      const discounted = roundTo(subtotal * (1 - discountRate));
      const taxAmount = roundTo(discounted * taxRate);
      const total = roundTo(discounted + taxAmount);

      return {
        title: 'Pull-Box Discount Check',
        contextLine: 'Comic shop math • Discount plus sales tax',
        prompt: `Read aloud: "Andrew's pull list at Brightstar Comics costs ${toCurrency(subtotal)} before discounts. The shop takes 20% off for his pull box and then adds 8.5% sales tax. What should the final receipt total be?"`,
        solutionSteps: [
          `Discount: ${toCurrency(subtotal)} × 0.20 = ${toCurrency(roundTo(subtotal * discountRate))}.`,
          `Sale price: ${toCurrency(subtotal)} - discount = ${toCurrency(discounted)}.`,
          `Tax: ${toCurrency(discounted)} × 0.085 = ${toCurrency(taxAmount)}.`,
          `Total: ${toCurrency(discounted)} + ${toCurrency(taxAmount)} = ${toCurrency(total)}.`
        ],
        finalAnswer: `${toCurrency(total)} due at checkout.`,
        whyItMatters: 'Teachers can connect percent decrease and increase in one tidy comic book scenario.',
        extension: 'Change the tax rate to your city or adjust the discount to 15% and compare totals.'
      };
    }
  },
  {
    id: 'variant-split',
    title: 'Variant Team-Up Split',
    context: 'comics',
    skill: 'percents',
    standards: ['CCSS.MATH.CONTENT.7.RP.A.3'],
    generate: () => {
      const spend = choose([28, 36, 44, 52, 60]);
      const paybackRate = 0.25;
      const payback = roundTo(spend * paybackRate);
      const netCost = roundTo(spend - payback);

      return {
        title: 'Variant Team-Up Split',
        contextLine: 'Collecting strategy • Sharing a limited cover haul',
        prompt: `Read aloud: "Andrew and his cousin split a stack of limited variant issues that cost ${toCurrency(spend)}. The cousin covers 25% of the bill later. How much money should Andrew get back, and what is his final cost?"`,
        solutionSteps: [
          `Cousin share: ${toCurrency(spend)} × 0.25 = ${toCurrency(payback)}.`,
          `Andrew pays after payback: ${toCurrency(spend)} - ${toCurrency(payback)} = ${toCurrency(netCost)}.`
        ],
        finalAnswer: `Andrew gets ${toCurrency(payback)} back and keeps ${toCurrency(netCost)} as his cost.`,
        whyItMatters: 'Shows percent of a total and reinforces how collectors plan shared buys.',
        extension: 'Have students model the net cost with an equation such as c = 0.75s and plug in a new stack price.'
      };
    }
  },
  {
    id: 'graphic-binders',
    title: 'Trade Binder Count',
    context: 'comics',
    skill: 'numbers',
    standards: ['CCSS.MATH.CONTENT.7.NS.A.3'],
    generate: () => {
      const issues = ensureNotMultiple(20, 38, [6]);
      const perVolume = 6;
      const fullVolumes = Math.floor(issues / perVolume);
      const leftovers = issues % perVolume;

      return {
        title: 'Trade Binder Count',
        contextLine: 'Collection planning • Turning single issues into trades',
        prompt: `Read aloud: "A trade binder holds 6 single issues. Andrew has ${issues} issues ready to archive. How many full trades can he build, and how many single issues will still be loose?"`,
        solutionSteps: [
          `${issues} ÷ 6 = ${fullVolumes} remainder ${leftovers}.`,
          `${fullVolumes} full trades with ${leftovers} single issues left over.`
        ],
        finalAnswer: `${fullVolumes} complete trades and ${leftovers} singles to store separately.`,
        whyItMatters: 'Interpreting the remainder helps Andrew plan the next binder purchase.',
        extension: 'Ask students to plan for one more binder and decide how many more issues are needed to fill it.'
      };
    }
  },
  {
    id: 'con-budget',
    title: 'Convention Budget Board',
    context: 'comics',
    skill: 'equations',
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

      return {
        title: 'Convention Budget Board',
        contextLine: 'Budget planning • Spending under a set cap',
        prompt: `Read aloud: "Andrew brings $${budget} to a convention. Prices already include tax. Which two-item bundle stays under budget with the most money left, and is any three-item bundle possible?"`,
        solutionSteps: [
          `Cheapest three-item bundle costs ${Number.isFinite(cheapestThreeTotal) ? toCurrency(cheapestThreeTotal) : 'N/A'} ⇒ ${
            canBuyThree ? 'within budget' : 'over budget'
          }.`,
          comboList.length ? 'Two-item bundles within budget:' : 'No two-item bundle fits the budget.',
          ...comboList
        ],
        finalAnswer: `${
          canBuyThree ? 'A three-item combo fits.' : 'No three-item combo fits the cap.'
        } Best two-item choice leaves ${toCurrency(sortedCombos[0]?.leftover ?? 0)} remaining.`,
        whyItMatters: 'Teachers can model inequalities and reasoning about combinations without heavy text.',
        extension: 'Invite students to suggest a new item and test how it changes the best bundle.'
      };
    }
  },
  {
    id: 'storyboard-progress',
    title: 'Storyboard Progress Check',
    context: 'film',
    skill: 'percents',
    standards: ['CCSS.MATH.CONTENT.7.RP.A.3'],
    generate: () => {
      const totalShots = choose([48, 52, 60]);
      const completed = choose([18, 20, 24]);
      const percentComplete = roundTo((completed / totalShots) * 100, 1);
      const shotsLeft = totalShots - completed;

      return {
        title: 'Storyboard Progress Check',
        contextLine: 'Film club planning • Tracking percent complete',
        prompt: `Read aloud: "The film club mapped ${completed} of ${totalShots} planned shots for their mini-movie. What percent is complete, and how many shots remain?"`,
        solutionSteps: [
          `Percent complete = (${completed} ÷ ${totalShots}) × 100 = ${percentComplete}%.`,
          `Shots left = ${totalShots} - ${completed} = ${shotsLeft}.`
        ],
        finalAnswer: `${percentComplete}% done with ${shotsLeft} shots still to storyboard.`,
        whyItMatters: 'Connects percent progress to a school film project Andrew knows from AV club.',
        extension: 'Ask how many days it will take if the team can finish 6 shots per work session.'
      };
    }
  },
  {
    id: 'lighting-share',
    title: 'Lighting Kit Cost Share',
    context: 'film',
    skill: 'percents',
    standards: ['CCSS.MATH.CONTENT.7.RP.A.3'],
    generate: () => {
      const weekendRate = 420;
      const ratio = [2, 1, 1];
      const totalParts = ratio.reduce((a, b) => a + b, 0);
      const partCost = roundTo(weekendRate / totalParts);
      const andrewShare = roundTo(partCost * ratio[0]);
      const othersShare = roundTo(weekendRate - andrewShare);

      return {
        title: 'Lighting Kit Cost Share',
        contextLine: 'Production budgeting • Splitting rental fees',
        prompt: `Read aloud: "Three film club leads split a $${weekendRate} lighting rental in a 2:1:1 ratio because Andrew booked extra shooting time. How much does Andrew pay, and how much do the others cover together?"`,
        solutionSteps: [
          `Total parts = 2 + 1 + 1 = ${totalParts}.`,
          `Each part costs ${toCurrency(partCost)}.`,
          `Andrew pays 2 parts = ${toCurrency(andrewShare)}; friends cover the remaining ${toCurrency(othersShare)}.`
        ],
        finalAnswer: `Andrew pays ${toCurrency(andrewShare)}; the team covers ${toCurrency(othersShare)} together.`,
        whyItMatters: 'Simple ratio split mirrors how clubs share gear rentals.',
        extension: 'Change the ratio to 3:1:1 if Andrew adds another night and compare the cost shift.'
      };
    }
  },
  {
    id: 'scene-equation',
    title: 'Scene Count Equation',
    context: 'film',
    skill: 'equations',
    standards: ['CCSS.MATH.CONTENT.7.EE.B.4'],
    generate: () => {
      const runtimeSeconds = choose([360, 390]);
      const specialSceneLength = choose([48, 54]);
      const baseSceneLength = choose([30, 36]);
      const regularScenes = Math.floor((runtimeSeconds - specialSceneLength) / baseSceneLength);

      return {
        title: 'Scene Count Equation',
        contextLine: 'Editing math • Building a clean runtime',
        prompt: `Read aloud: "A short film must run ${runtimeSeconds / 60} minutes (${runtimeSeconds} seconds). One hero team-up finale lasts ${specialSceneLength} seconds. All other scenes are ${baseSceneLength} seconds each. Set up and solve an equation to find how many regular scenes fit."`,
        solutionSteps: [
          `Let x = regular scenes.`,
          `Equation: ${baseSceneLength}x + ${specialSceneLength} = ${runtimeSeconds}.`,
          `${baseSceneLength}x = ${runtimeSeconds - specialSceneLength}.`,
          `x = ${runtimeSeconds - specialSceneLength} ÷ ${baseSceneLength} = ${regularScenes}.`
        ],
        finalAnswer: `${regularScenes} regular scenes plus the finale hit the runtime target.`,
        whyItMatters: 'Gives context for solving one-step equations with a known total.',
        extension: 'Ask what happens if one more 12-second transition is added to the plan.'
      };
    }
  },
  {
    id: 'retake-data',
    title: 'Reshoot Tracker Stats',
    context: 'film',
    skill: 'stats',
    standards: ['CCSS.MATH.CONTENT.7.SP.B.4'],
    generate: () => {
      const retakes = choose([
        [2, 4, 3, 5, 3],
        [1, 5, 4, 3, 2],
        [2, 3, 4, 6, 3]
      ]);
      const labels = ['Scene 1', 'Scene 2', 'Scene 3', 'Scene 4', 'Scene 5'];
      const sum = retakes.reduce((a, b) => a + b, 0);
      const mean = roundTo(sum / retakes.length, 2);
      const mostRetakes = Math.max(...retakes);
      const hardestSceneIndex = retakes.indexOf(mostRetakes);

      return {
        title: 'Reshoot Tracker Stats',
        contextLine: 'On-set data • Reading the average number of retakes',
        prompt: `Read aloud: "Retake counts for five scenes came out as ${retakes.join(', ')}. What is the average number of retakes per scene, and which scene needs the most review?"`,
        solutionSteps: [
          `Mean = (${retakes.join(' + ')}) ÷ 5 = ${mean}.`,
          `Most retakes: ${mostRetakes} on ${labels[hardestSceneIndex]}.`
        ],
        finalAnswer: `Average of ${mean} retakes; ${labels[hardestSceneIndex]} needs the most support.`,
        whyItMatters: 'Supports talk about mean and variability with a familiar film-club log.',
        extension: 'Have students graph the data and suggest how many practice runs to schedule next time.'
      };
    }
  },
  {
    id: 'variant-probability',
    title: 'Mystery Variant Odds',
    context: 'comics',
    skill: 'stats',
    standards: ['CCSS.MATH.CONTENT.7.SP.C.6'],
    generate: () => {
      const totalBags = 40;
      const glowVariants = choose([6, 8, 10]);
      const sketchVariants = choose([4, 5, 6]);
      const regular = totalBags - glowVariants - sketchVariants;
      const glowProbability = roundTo(glowVariants / totalBags, 2);
      const sketchProbability = roundTo(sketchVariants / totalBags, 2);

      return {
        title: 'Mystery Variant Odds',
        contextLine: 'Probability • Blind-bag cover reveal',
        prompt: `Read aloud: "A blind-bag comic box holds 40 issues: ${glowVariants} glow variants, ${sketchVariants} sketch variants, and the rest regular covers. What is the probability of pulling each special cover on one draw?"`,
        solutionSteps: [
          `P(glow) = ${glowVariants} ÷ 40 = ${glowProbability}.`,
          `P(sketch) = ${sketchVariants} ÷ 40 = ${sketchProbability}.`,
          `Regular covers = ${regular} bags.`
        ],
        finalAnswer: `Glow: ${glowProbability}; Sketch: ${sketchProbability}.`,
        whyItMatters: 'Highlights theoretical probability with terms Andrew hears at the comic shop.',
        extension: 'Invite students to simulate two draws with counters and compare to the predicted odds.'
      };
    }
  },
  {
    id: 'colorist-collab',
    title: 'Coloring Sprint Ratio',
    context: 'comics',
    skill: 'numbers',
    standards: ['CCSS.MATH.CONTENT.7.RP.A.3'],
    generate: () => {
      const totalPages = choose([48, 60, 72]);
      const days = choose([12, 15]);
      const pagesPerDayTogether = roundTo(totalPages / days, 2);
      const perArtist = roundTo(pagesPerDayTogether / 2, 2);

      return {
        title: 'Coloring Sprint Ratio',
        contextLine: 'Production schedule • Splitting daily work evenly',
        prompt: `Read aloud: "Andrew and a friend are coloring a ${totalPages}-page comic in ${days} days. They split the pages evenly each day. How many pages should they finish together per day, and how many pages is that for each artist?"`,
        solutionSteps: [
          `Pages per day together = ${totalPages} ÷ ${days} = ${pagesPerDayTogether}.`,
          `Per artist = ${pagesPerDayTogether} ÷ 2 = ${perArtist}.`
        ],
        finalAnswer: `Team goal ${pagesPerDayTogether} pages daily; each artist handles ${perArtist} pages.`,
        whyItMatters: 'Reinforces equal sharing and rate reasoning using comic art workflow.',
        extension: 'Ask what happens to the plan if one artist finishes 4 bonus pages on day one.'
      };
    }
  }
];

const elements = {
  context: document.getElementById('context'),
  skill: document.getElementById('skill'),
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

  const filtered = generatorLibrary.filter(generator => {
    const contextMatch = contextFilter === 'all' || generator.context === contextFilter;
    const skillMatch = skillFilter === 'all' || generator.skill === skillFilter;
    return contextMatch && skillMatch;
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

  elements.problemTitle.textContent = problem.title;
  elements.problemContext.textContent = problem.contextLine;
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

renderStandardsReference();
