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
    id: 'subscription-stack',
    title: 'Subscription Stack Budget',
    context: 'comics',
    skill: 'percents',
    standards: ['CCSS.MATH.CONTENT.7.RP.A.3', 'CCSS.MATH.CONTENT.7.EE.B.3'],
    description: 'Percent decrease (subscription discount) and percent increase (sales tax) in a single purchase.',
    generate: ({ audience }) => {
      const subtotal = choose([48, 56, 64, 72, 84]);
      const discountRate = 0.2;
      const taxRate = 0.085;
      const discounted = subtotal * (1 - discountRate);
      const total = roundTo(discounted * (1 + taxRate));
      const savings = roundTo(subtotal - discounted);
      const taxAmount = roundTo(discounted * taxRate);

      const prompt =
        audience === 'student'
          ? `Your long box pull-list at I Like Comics rings up to ${toCurrency(subtotal)}. Your subscription knocks off 20%, then Washington's 8.5% sales tax hits the new total. What do you actually pay at the register?`
          : `Andrew's curated subscription stack has a shelf price of ${toCurrency(subtotal)}. After the automatic 20% pull-box discount and Washington's 8.5% sales tax, what total should the receipt show?`;

      const solutionSteps = [
        `Discounted subtotal = ${toCurrency(subtotal)} × (1 - 0.20) = ${toCurrency(discounted)}.`,
        `Sales tax = ${toCurrency(discounted)} × 0.085 = ${toCurrency(taxAmount)}.`,
        `Total due = ${toCurrency(discounted)} + ${toCurrency(taxAmount)} = ${toCurrency(total)}.`
      ];

      const extension =
        audience === 'student'
          ? 'If the shop offered a holiday 25% discount instead, how much more would you save?'
          : 'Ask students to compare with a hypothetical 25% discount or a different state tax rate to highlight proportional reasoning.';

      return {
        title: 'Stack Savings vs. Tax',
        contextLine: 'Comic shop finance • Pull-box discount and register math',
        prompt,
        solution: `${formatList(solutionSteps)}`,
        finalAnswer: `Andrew pays ${toCurrency(total)} after discount and tax.`,
        whyItMatters:
          'Comic retailers rely on accurate point-of-sale math to keep subscription customers happy and inventory profitable.',
        extension
      };
    }
  },
  {
    id: 'reimbursement-runs',
    title: 'Variant Reimbursement Deal',
    context: 'comics',
    skill: 'percents',
    standards: ['CCSS.MATH.CONTENT.7.RP.A.3'],
    description: 'Percent of a purchase reimbursed after buying limited variants.',
    generate: ({ audience }) => {
      const spend = choose([24, 28, 36, 44, 52, 60]);
      const paybackRate = 0.25;
      const payback = roundTo(spend * paybackRate);
      const netCost = roundTo(spend - payback);
      const prompt =
        audience === 'student'
          ? `You and your dad split horror variant issues. You spend ${toCurrency(spend)} this week, and he pays you back 25%. How much do you get back, and what is your final cost?`
          : `Andrew is collecting horror variant covers. If he spends ${toCurrency(spend)} and his dad reimburses 25%, determine the reimbursement amount and Andrew's remaining cost.`;

      const solutionSteps = [
        `Reimbursement = ${toCurrency(spend)} × 0.25 = ${toCurrency(payback)}.`,
        `Andrew's share = ${toCurrency(spend)} - ${toCurrency(payback)} = ${toCurrency(netCost)}.`
      ];

      const extension =
        audience === 'student'
          ? 'If the next limited cover costs ${toCurrency(spend + 8)} and he still pays back 25%, how much will you owe?'
          : 'Invite students to create an equation representing Andrew’s net cost: \(c = 0.75s\).';

      return {
        title: 'Reimbursed Variant Haul',
        contextLine: 'Comic collecting • Shared spending agreement',
        prompt,
        solution: `${formatList(solutionSteps)}`,
        finalAnswer: `Dad reimburses ${toCurrency(payback)}, so Andrew’s cost is ${toCurrency(netCost)}.`,
        whyItMatters:
          'Negotiating collector partnerships requires fluency with percentages to keep every issue and friendship balanced.',
        extension
      };
    }
  },
  {
    id: 'graphic-binders',
    title: 'Graphic Novel Binders',
    context: 'comics',
    skill: 'numbers',
    standards: ['CCSS.MATH.CONTENT.7.NS.A.3'],
    description: 'Division with remainder to convert single issues into collected editions.',
    generate: ({ audience }) => {
      const issues = ensureNotMultiple(20, 38, [6]);
      const perVolume = 6;
      const fullVolumes = Math.floor(issues / perVolume);
      const leftovers = issues % perVolume;
      const prompt =
        audience === 'student'
          ? `Every 6 single issues of your horror run get bound into one deluxe graphic novel. You just finished reading ${issues} issues. How many complete graphic novels can you bind, and how many single issues are left loose?`
          : `Andrew wants to archive ${issues} single issues into collected editions, with 6 issues per bind-up. Determine the number of complete volumes and the remaining singles.`;

      const solutionSteps = [
        `${issues} ÷ 6 = ${fullVolumes} remainder ${leftovers}.`,
        `He can bind ${fullVolumes} complete graphic novels and will have ${leftovers} single issues left.`
      ];

      const extension =
        audience === 'student'
          ? 'If a custom binder holds 4 graphic novels, will one binder handle the whole run? Explain.'
          : 'Discuss interpreting remainders in context: the remainder becomes a planning decision for future purchases.';

      return {
        title: 'Binding the Horror Run',
        contextLine: 'Collection management • Turning issues into deluxe editions',
        prompt,
        solution: `${formatList(solutionSteps)}`,
        finalAnswer: `${fullVolumes} graphic novels with ${leftovers} single issues leftover.`,
        whyItMatters:
          'Publishers schedule bind-ups by tracking issue counts; collectors do the same to plan shelves and budgets.',
        extension
      };
    }
  },
  {
    id: 'con-budget',
    title: 'Comic-Con Merch Matrix',
    context: 'comics',
    skill: 'equations',
    standards: ['CCSS.MATH.CONTENT.7.EE.B.3'],
    description: 'Budget inequality using set merchandise prices at a convention.',
    generate: ({ audience }) => {
      const budget = 75;
      const items = [
        { name: 'Signed slasher poster', price: 25.5 },
        { name: 'Indie horror trade paperback', price: 18.75 },
        { name: 'Foil variant comic', price: 22.4 },
        { name: 'FX makeup demo kit', price: 28.6 }
      ];

      const prompt =
        audience === 'student'
          ? `You have $${budget} to spend at Comic Con. Prices (tax included):
- Signed slasher poster: ${toCurrency(items[0].price)}
- Indie horror trade paperback: ${toCurrency(items[1].price)}
- Foil variant comic: ${toCurrency(items[2].price)}
- FX makeup demo kit: ${toCurrency(items[3].price)}

Can you buy three items without going over budget? Which two-item combos fit best, and how much money would you have left?`
          : `Andrew's Comic Con budget is $${budget}. With the listed tax-included prices, determine whether any three-item combinations meet the budget. Identify all two-item combinations that stay within the budget and compute the remaining balance for the best choice.`;

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

      const threeItemSummary = Number.isFinite(cheapestThreeTotal)
        ? `Most affordable three-item bundle costs ${toCurrency(cheapestThreeTotal)} ⇒ ${
            canBuyThree ? 'within budget' : 'over budget (cannot buy three).'
          }`
        : 'No three-item combinations available to evaluate.';

      const solutionSteps = [
        threeItemSummary,
        `Two-item combos within budget:${comboList.length ? '' : ' none.'}`,
        ...comboList.map(text => text)
      ];

      const extension =
        audience === 'student'
          ? 'Design your own three-item wishlist with at least one filmmaking supply. Keep it under $75 and show the math.'
          : 'Model the situation with an inequality such as \(22.4 + 18.75 + x \leq 75\) and have students solve for the remaining spending power.';

      return {
        title: 'Comic-Con Merch Matrix',
        contextLine: 'Convention strategy • Budgeting collectibles and gear',
        prompt,
        solution: `${formatList(solutionSteps)}`,
        finalAnswer: `${
          canBuyThree ? 'Andrew can stretch to three items.' : 'No three-item combo fits the budget.'
        } Best two-item choice leaves ${toCurrency(sortedCombos[0]?.leftover ?? 0)} remaining.`,
        whyItMatters:
          'Conventions mix impulse buys with production tools—budget planning keeps indie creators funded.',
        extension
      };
    }
  },
  {
    id: 'storyboard-progress',
    title: 'Storyboard Sprint',
    context: 'film',
    skill: 'percents',
    standards: ['CCSS.MATH.CONTENT.7.RP.A.3'],
    description: 'Percent completion and remaining work for a production timeline.',
    generate: ({ audience }) => {
      const totalShots = choose([48, 52, 60]);
      const completed = choose([18, 20, 24]);
      const percentComplete = roundTo((completed / totalShots) * 100, 1);
      const shotsLeft = totalShots - completed;
      const prompt =
        audience === 'student'
          ? `Your horror short has ${totalShots} planned camera setups. You've storyboarded ${completed} of them this week. What percent of the storyboard is complete, and how many setups still need drawings before you can start filming?`
          : `Andrew mapped ${completed} of ${totalShots} planned shots for his horror short. Calculate the percent of storyboard completion and the remaining number of shots.`;

      const solutionSteps = [
        `Percent complete = (${completed} ÷ ${totalShots}) × 100 = ${percentComplete}%.`,
        `Shots remaining = ${totalShots} - ${completed} = ${shotsLeft}.`
      ];

      const extension =
        audience === 'student'
          ? 'If you can finish 6 storyboards per night, how many nights until you wrap the planning phase?'
          : 'Have students create a double number line comparing shots completed to total shots to visualize progress.';

      return {
        title: 'Storyboard Sprint',
        contextLine: 'Film pre-production • Tracking storyboard progress',
        prompt,
        solution: `${formatList(solutionSteps)}`,
        finalAnswer: `${percentComplete}% complete with ${shotsLeft} shots left to draw.`,
        whyItMatters:
          'Directors use percent-complete metrics to keep pre-production on schedule before renting gear or hiring crew.',
        extension
      };
    }
  },
  {
    id: 'lighting-share',
    title: 'Lighting Kit Cost Share',
    context: 'film',
    skill: 'percents',
    standards: ['CCSS.MATH.CONTENT.7.RP.A.3'],
    description: 'Ratios determine cost sharing for rental equipment.',
    generate: ({ audience }) => {
      const weekendRate = 420;
      const ratio = [2, 1, 1];
      const totalParts = ratio.reduce((a, b) => a + b, 0);
      const andrewShare = roundTo((ratio[0] / totalParts) * weekendRate);
      const othersShare = weekendRate - andrewShare;

      const prompt =
        audience === 'student'
          ? `You split a $${weekendRate} weekend rental for a lighting kit with two other teen directors. Because you booked extra night shoots, you cover a double share compared to each friend. How much do you pay?`
          : `Three student directors split a $${weekendRate} lighting rental in a 2:1:1 ratio (Andrew takes the 2 share). Determine Andrew's cost and how much the others cover together.`;

      const solutionSteps = [
        `Total ratio parts = 2 + 1 + 1 = ${totalParts}.`,
        `Each part costs ${toCurrency(weekendRate / totalParts)}.`,
        `Andrew pays 2 parts ⇒ ${toCurrency(andrewShare)}. The others split the remaining ${toCurrency(othersShare)}.`
      ];

      const extension =
        audience === 'student'
          ? 'What if four friends split the same kit equally? Compare your cost.'
          : 'Connect to double number lines showing ratio of cost to usage hours to reinforce proportional reasoning.';

      return {
        title: 'Lighting Kit Cost Share',
        contextLine: 'Production budgeting • Splitting rental equipment',
        prompt,
        solution: `${formatList(solutionSteps)}`,
        finalAnswer: `Andrew covers ${toCurrency(andrewShare)} while friends share ${toCurrency(othersShare)}.`,
        whyItMatters:
          'Indie crews divide rental costs by usage; ratios keep budgets fair when screen time varies.',
        extension
      };
    }
  },
  {
    id: 'scene-equation',
    title: 'Editing Equation',
    context: 'film',
    skill: 'equations',
    standards: ['CCSS.MATH.CONTENT.7.EE.B.4'],
    description: 'Linear equation representing shot counts and total runtime.',
    generate: ({ audience }) => {
      const runtimeSeconds = choose([360, 390]);
      const specialSceneLength = choose([48, 54]);
      const baseSceneLength = choose([30, 36]);
      const prompt =
        audience === 'student'
          ? `Your horror short must be ${runtimeSeconds / 60} minutes long (${runtimeSeconds} seconds total). Most scenes run about ${baseSceneLength} seconds, but your finale chase takes ${specialSceneLength} seconds. How many standard scenes can you include along with the finale to hit the exact runtime?`
          : `Andrew is editing a ${runtimeSeconds / 60}-minute short (${runtimeSeconds} seconds). He plans one ${specialSceneLength}-second climax scene and the rest at ${baseSceneLength} seconds each. Set up and solve an equation for the number of regular scenes.`;

      const regularScenes = Math.floor((runtimeSeconds - specialSceneLength) / baseSceneLength);
      const solutionSteps = [
        `Let \(x\) = number of regular scenes.`,
        `Equation: ${baseSceneLength}x + ${specialSceneLength} = ${runtimeSeconds}.`,
        `${baseSceneLength}x = ${runtimeSeconds - specialSceneLength}.`,
        `x = ${runtimeSeconds - specialSceneLength} ÷ ${baseSceneLength} = ${regularScenes}.`
      ];

      const extension =
        audience === 'student'
          ? 'If you add a 12-second jump-scare insert, adjust your equation. Does a new solution still use whole scenes?'
          : 'Discuss what to do with remainders—does the pacing allow for a shorter transition scene?';

      return {
        title: 'Editing to Exact Runtime',
        contextLine: 'Post-production math • Balancing runtime with scene lengths',
        prompt,
        solution: `${formatList(solutionSteps)}`,
        finalAnswer: `Andrew can include ${regularScenes} regular scenes plus the finale to hit the exact runtime.`,
        whyItMatters:
          'Editors juggle scene lengths to meet festival runtime limits without cutting story beats.',
        extension
      };
    }
  },
  {
    id: 'retake-data',
    title: 'FX Retake Analyzer',
    context: 'film',
    skill: 'stats',
    standards: ['CCSS.MATH.CONTENT.7.SP.B.4'],
    description: 'Compute mean retakes per scene and interpret the data.',
    generate: ({ audience }) => {
      const retakes = choose([
        [3, 4, 2, 5, 3],
        [2, 6, 4, 3, 5],
        [1, 3, 4, 6, 2]
      ]);
      const weekLabels = ['Scene 1', 'Scene 2', 'Scene 3', 'Scene 4', 'Scene 5'];
      const sum = retakes.reduce((a, b) => a + b, 0);
      const mean = roundTo(sum / retakes.length, 2);
      const mostRetakes = Math.max(...retakes);
      const hardestSceneIndex = retakes.indexOf(mostRetakes);

      const prompt =
        audience === 'student'
          ? `During FX filming you tracked retakes for five scenes: ${retakes.join(', ')}. What is the average number of retakes per scene, and which scene chewed up the most time?`
          : `Andrew logged retake counts for five practical FX scenes (${retakes.join(', ')}). Compute the mean retakes and identify the scene needing the most coaching.`;

      const solutionSteps = [
        `Mean = (${retakes.join(' + ')}) ÷ 5 = ${mean} retakes.`,
        `Maximum retakes = ${mostRetakes} on ${weekLabels[hardestSceneIndex]}.`
      ];

      const extension =
        audience === 'student'
          ? 'Plan how many extra takes to budget if you expect the next night to run 1 retake above the mean per scene.'
          : 'Invite students to graph the data and discuss variability—should Andrew schedule an extra rehearsal for the toughest scene?';

      return {
        title: 'FX Retake Analyzer',
        contextLine: 'On-set data • Using averages to schedule reshoots',
        prompt,
        solution: `${formatList(solutionSteps)}`,
        finalAnswer: `Average of ${mean} retakes; ${weekLabels[hardestSceneIndex]} needs the most attention with ${mostRetakes} retakes.`,
        whyItMatters:
          'Keeping track of retakes helps crews predict overtime costs and coach actors through complex practical effects.',
        extension
      };
    }
  },
  {
    id: 'variant-probability',
    title: 'Mystery Variant Probability',
    context: 'comics',
    skill: 'stats',
    standards: ['CCSS.MATH.CONTENT.7.SP.C.6'],
    description: 'Probability of pulling special variant covers from blind bags.',
    generate: ({ audience }) => {
      const totalBags = 40;
      const glowVariants = choose([6, 8, 10]);
      const sketchVariants = choose([4, 5, 6]);
      const regular = totalBags - glowVariants - sketchVariants;
      const glowProbability = roundTo(glowVariants / totalBags, 2);
      const sketchProbability = roundTo(sketchVariants / totalBags, 2);

      const prompt =
        audience === 'student'
          ? `A booth sells 40 sealed mystery horror-comic variants: ${glowVariants} glow-in-the-dark, ${sketchVariants} artist sketch, and the rest regular covers. If you buy one bag, what is the probability of landing a glow variant? What about a sketch cover?`
          : `From a 40-bag blind pull (with ${glowVariants} glow variants and ${sketchVariants} sketch variants), determine the probability of each special cover to help Andrew decide if the bundle is worth it.`;

      const solutionSteps = [
        `Glow probability = ${glowVariants} ÷ 40 = ${glowProbability}.`,
        `Sketch probability = ${sketchVariants} ÷ 40 = ${sketchProbability}.`,
        `Regular covers = ${regular} bags.`
      ];

      const extension =
        audience === 'student'
          ? 'If you grab two bags without replacement, estimate the chance you snag both special covers.'
          : 'Have students simulate pulls with counters to compare experimental probability to the theoretical values.';

      return {
        title: 'Mystery Variant Probability',
        contextLine: 'Collectible strategy • Predicting blind-bag pulls',
        prompt,
        solution: `${formatList(solutionSteps)}`,
        finalAnswer: `P(glow) = ${glowProbability}, P(sketch) = ${sketchProbability}.`,
        whyItMatters:
          'Knowing the odds keeps collectors from overspending on mystery bundles and informs secondary market pricing.',
        extension
      };
    }
  },
  {
    id: 'sound-mix-inequality',
    title: 'Sound Mix Time Crunch',
    context: 'film',
    skill: 'equations',
    standards: ['CCSS.MATH.CONTENT.7.EE.B.4'],
    description: 'Inequality to budget time for post-production tasks.',
    generate: ({ audience }) => {
      const totalHours = 12;
      const perSceneTime = 1.5;
      const setupTime = 2;
      const prompt =
        audience === 'student'
          ? `You booked ${totalHours} hours in the studio to mix sound for your horror short. Setup takes ${setupTime} hours total, and each scene needs about ${perSceneTime} hours of mixing. Write and solve an inequality to find the maximum number of scenes you can polish.`
          : `Andrew has ${totalHours} studio hours, with ${setupTime} hours reserved for calibration. Each scene’s mix takes ${perSceneTime} hours. Model with an inequality and determine how many scenes fit.`;

      const hoursRemaining = totalHours - setupTime;
      const maxScenes = Math.floor(hoursRemaining / perSceneTime);
      const solutionSteps = [
        `Let \(s\) = number of scenes. Inequality: ${perSceneTime}s + ${setupTime} \leq ${totalHours}.`,
        `${perSceneTime}s \leq ${totalHours - setupTime}.`,
        `s \leq ${(hoursRemaining / perSceneTime).toFixed(2)} ⇒ maximum whole scenes = ${maxScenes}.`
      ];

      const extension =
        audience === 'student'
          ? 'If one scene needs an extra 0.5 hours for a creature sound pass, how does that change your plan?'
          : 'Discuss why only whole scenes make sense and how to schedule B-roll or ADR if time remains.';

      return {
        title: 'Sound Mix Time Crunch',
        contextLine: 'Post-production scheduling • Studio time inequality',
        prompt,
        solution: `${formatList(solutionSteps)}`,
        finalAnswer: `Andrew can fully mix ${maxScenes} scenes during the booking.`,
        whyItMatters:
          'Time budgeting keeps indie productions from paying overtime at studios.',
        extension
      };
    }
  },
  {
    id: 'colorist-ratio',
    title: 'Colorist Collaboration Ratio',
    context: 'comics',
    skill: 'numbers',
    standards: ['CCSS.MATH.CONTENT.7.NS.A.2', 'CCSS.MATH.CONTENT.7.RP.A.3'],
    description: 'Ratio table converting page quotas into daily goals.',
    generate: ({ audience }) => {
      const totalPages = choose([96, 108, 120]);
      const days = choose([12, 15]);
      const dailyGoal = totalPages / days;
      const prompt =
        audience === 'student'
          ? `You and a colorist friend are finishing a ${totalPages}-page horror anthology in ${days} days for a convention launch. If you split the work evenly each day, how many pages should each of you color daily?`
          : `Andrew and his collaborator must finish ${totalPages} pages of coloring in ${days} days. Determine the shared daily page target per artist.`;

      const solutionSteps = [
        `Pages per day together = ${totalPages} ÷ ${days} = ${roundTo(dailyGoal, 2)} pages.`,
        `Per artist (split evenly) = ${roundTo(dailyGoal / 2, 2)} pages per day.`
      ];

      const extension =
        audience === 'student'
          ? 'If you sprinted and finished 4 extra pages early, how would you adjust the remaining daily goal?'
          : 'Have students build a ratio table showing days vs. pages completed to visualize steady rates.';

      return {
        title: 'Colorist Collaboration Ratio',
        contextLine: 'Production schedule • Meeting anthology deadlines',
        prompt,
        solution: `${formatList(solutionSteps)}`,
        finalAnswer: `Team goal ${roundTo(dailyGoal, 2)} pages per day; each artist handles ${roundTo(dailyGoal / 2, 2)} pages.`,
        whyItMatters:
          'Publishing deadlines depend on predictable daily output for art teams.',
        extension
      };
    }
  }
];

const elements = {
  audience: document.getElementById('audience'),
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
  const mode = elements.audience.value;
  const contextFilter = elements.context.value;
  const skillFilter = elements.skill.value;

  const filtered = generatorLibrary.filter(generator => {
    const contextMatch = contextFilter === 'all' || generator.context === contextFilter;
    const skillMatch = skillFilter === 'all' || generator.skill === skillFilter;
    return contextMatch && skillMatch;
  });

  if (!filtered.length) {
    elements.problemTitle.textContent = 'No generator found';
    elements.problemContext.textContent = 'Try widening your filters to see more math/story combos.';
    elements.problemText.textContent = '';
    elements.standards.innerHTML = '';
    elements.solutionBox.innerHTML = '';
    elements.extensionBox.innerHTML = '';
    return;
  }

  const selection = choose(filtered);
  const problem = selection.generate({ audience: mode });

  elements.problemTitle.textContent = problem.title;
  elements.problemContext.textContent = problem.contextLine;
  elements.problemText.textContent = problem.prompt;
  elements.standards.innerHTML = selection.standards
    .map(code => `<span class="standard-tag">${code.replace('CCSS.MATH.CONTENT.', '')}</span>`)
    .join('');

  const modeHeading = mode === 'teacher' ? 'Solution Path & Answer Key' : 'How to Solve';
  const whyHeading = mode === 'teacher' ? 'Industry Connection' : 'Why this matters IRL';

  elements.solutionBox.innerHTML = `
    <h3>${modeHeading}</h3>
    <ol>${problem.solution}</ol>
    <p class="final-answer"><strong>Final answer:</strong> ${problem.finalAnswer}</p>
    <p class="why">${whyHeading}: ${problem.whyItMatters}</p>
  `;

  elements.extensionBox.innerHTML = `
    <h3>Extend the Story</h3>
    <p>${problem.extension}</p>
  `;

  elements.researchCard.querySelector('h3').textContent =
    mode === 'teacher' ? 'Teacher Toolkit' : 'Player Boosts';
  elements.researchCard.querySelector('p').textContent =
    mode === 'teacher'
      ? 'Each challenge comes with authentic production context, CCSS tags, and ready-to-use solution moves.'
      : 'Unlock behind-the-scenes facts, bonus missions, and tips to level up your own comic or film project while you solve.';
};

elements.generate.addEventListener('click', renderProblem);

elements.audience.addEventListener('change', renderProblem);
elements.context.addEventListener('change', renderProblem);
elements.skill.addEventListener('change', renderProblem);

renderStandardsReference();
