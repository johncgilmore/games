const missionButton = document.getElementById("mission-button");
const missionTitle = document.getElementById("mission-title");
const missionStandard = document.getElementById("mission-standard");
const missionContext = document.getElementById("mission-context");
const missionQuestion = document.getElementById("mission-question");
const answerForm = document.getElementById("answer-form");
const answerInput = document.getElementById("answer-input");
const answerTip = document.getElementById("answer-tip");
const feedbackPanel = document.getElementById("feedback");
const feedbackResult = document.getElementById("feedback-result");
const feedbackExplanation = document.getElementById("feedback-explanation");
const intelList = document.getElementById("intel-list");
const missionLog = document.getElementById("mission-log");
const logTemplate = document.getElementById("log-entry-template");

const intelPoints = [
  "7.RP missions flex your percent, rate, and proportional thinking in booth budgets, light ratios, and stop-motion timing.",
  "7.NS missions keep fraction skills sharp while you track storyboard progress across horror and superhero scenes.",
  "7.EE missions make you solve real break-even equations for merch tables and production rentals.",
  "7.G and 7.SP missions connect set design scale drawings and fan survey data to the math classroom rubrics."
];

intelPoints.forEach((point) => {
  const li = document.createElement("li");
  li.textContent = point;
  intelList.appendChild(li);
});

const problemTemplates = [
  {
    id: "booth-budget",
    title: "Comic Con Booth Budget Blitz",
    standard: "CCSS.MATH.CONTENT.7.RP.A.3",
    skill: "Solve multistep percent problems with discounts and tax.",
    context:
      "You’re running a booth premiering your horror short film trailer and variant comic covers. Discounts help pull in fans, but tax still bites.",
    tip: "Round money to the nearest cent.",
    format: "currency",
    generate() {
      const basePrice = randomChoice([84, 92, 105, 110, 125]);
      const discountPercent = randomChoice([15, 20, 25, 30]);
      const taxPercent = randomChoice([7.5, 8.1, 8.5, 9.2]);
      const discountAmount = basePrice * (discountPercent / 100);
      const discountedPrice = basePrice - discountAmount;
      const total = roundToCents(discountedPrice * (1 + taxPercent / 100));
      const question = `The convention charges $${basePrice.toFixed(
        2
      )} for the booth. Because you’re featuring an indie horror film premiere, you score a ${discountPercent}% discount before taxes. After that, ${taxPercent}% sales tax is added. What is the final price you pay?`;
      const explanation = `Start with $${basePrice.toFixed(
        2
      )}. A ${discountPercent}% discount subtracts $${roundToCents(
        discountAmount
      ).toFixed(
        2
      )}, leaving $${roundToCents(discountedPrice).toFixed(
        2
      )}. Then apply ${taxPercent}% tax: $${roundToCents(discountedPrice).toFixed(
        2
      )} × ${1 + taxPercent / 100} = $${total.toFixed(
        2
      )}.`;
      return {
        question,
        answer: total,
        displayAnswer: `$${total.toFixed(2)}`,
        explanation,
      };
    },
  },
  {
    id: "frame-count",
    title: "Stop-Motion Scare Timing",
    standard: "CCSS.MATH.CONTENT.7.RP.A.1",
    skill: "Compute unit rates to scale time and frames.",
    context:
      "Your horror comic is becoming a stop-motion short. Timing each frame keeps the transformation sequence terrifyingly smooth.",
    tip: "Multiply frames per second by the number of seconds in the shot.",
    format: "integer",
    generate() {
      const fps = randomChoice([12, 18, 24]);
      const seconds = randomChoice([12, 15, 18, 20, 24]);
      const frames = fps * seconds;
      const question = `Your animator captures ${fps} frames each second to animate the monster reveal. If the transformation scene should last ${seconds} seconds, how many individual frames will they need to shoot?`;
      const explanation = `${fps} frames per second × ${seconds} seconds = ${frames} frames. This keeps the footage on pace with the storyboard.`;
      return {
        question,
        answer: frames,
        displayAnswer: `${frames} frames`,
        explanation,
      };
    },
  },
  {
    id: "storyboard-fractions",
    title: "Storyboard Sprint",
    standard: "CCSS.MATH.CONTENT.7.NS.A.1",
    skill: "Add and subtract rational numbers to track progress.",
    context:
      "You mapped out all the panels needed to storyboard a pivotal chase scene in your horror-comedy crossover.",
    tip: "You can answer as a fraction in simplest form or as a decimal.",
    format: "fraction",
    generate() {
      const setups = [
        {
          monday: { num: 3, den: 8 },
          tuesday: { num: 1, den: 4 },
        },
        {
          monday: { num: 2, den: 5 },
          tuesday: { num: 3, den: 10 },
        },
        {
          monday: { num: 5, den: 12 },
          tuesday: { num: 1, den: 3 },
        },
        {
          monday: { num: 4, den: 9 },
          tuesday: { num: 1, den: 6 },
        },
      ];
      const choice = randomChoice(setups);
      const commonDen = lcm(choice.monday.den, choice.tuesday.den);
      const mondayPortion =
        (choice.monday.num * commonDen) / choice.monday.den;
      const tuesdayPortion =
        (choice.tuesday.num * commonDen) / choice.tuesday.den;
      const totalPortion = mondayPortion + tuesdayPortion;
      const remainingNumerator = commonDen - totalPortion;
      const { num: simplifiedNum, den: simplifiedDen } = simplifyFraction(
        remainingNumerator,
        commonDen
      );
      const decimalAnswer = simplifiedNum / simplifiedDen;
      const mondayText = `${choice.monday.num}/${choice.monday.den}`;
      const tuesdayText = `${choice.tuesday.num}/${choice.tuesday.den}`;
      const question = `You planned one full set of storyboard panels for the chase. On Monday you completed ${mondayText} of the panels and on Tuesday you finished ${tuesdayText}. What fraction of the storyboard still needs to be drawn?`;
      const explanation = `Find a common denominator (${commonDen}) to add ${mondayText} and ${tuesdayText}. Together you finished ${totalPortion}/${commonDen}. That leaves ${(commonDen - totalPortion)}/${commonDen}, which simplifies to ${simplifiedNum}/${simplifiedDen}.`;
      return {
        question,
        answer: decimalAnswer,
        displayAnswer: `${simplifiedNum}/${simplifiedDen}`,
        explanation,
      };
    },
  },
  {
    id: "merch-break-even",
    title: "Merch Table Break-Even",
    standard: "CCSS.MATH.CONTENT.7.EE.B.4.A",
    skill: "Solve linear equations to find the break-even point.",
    context:
      "You’re selling behind-the-scenes print packs from your comic-to-film pitch to pay for festival fees.",
    tip: "Set income equal to costs and solve for the number of packs.",
    format: "integer",
    generate() {
      const price = randomChoice([18, 20, 22, 24, 25]);
      let cost = randomChoice([6, 7, 8, 9, 10]);
      while (price - cost <= 0) {
        cost = randomChoice([6, 7, 8, 9, 10]);
      }
      const target = randomChoice([4, 5, 6, 7]);
      const tableFee = (price - cost) * target;
      const question = `You sell each limited-run print pack for $${price}. Printing each pack costs $${cost}, and the Comic Con artist-alley table fee is $${tableFee}. How many packs must you sell just to break even?`;
      const explanation = `Let x be the number of packs. Income is $${price}x and costs are $${cost}x + $${tableFee}. Solve $${price}x = $${cost}x + $${tableFee}. That simplifies to $${
        price - cost
      }x = $${tableFee}, so x = $${tableFee} ÷ $${
        price - cost
      } = ${target}.`;
      return {
        question,
        answer: target,
        displayAnswer: `${target} packs`,
        explanation,
      };
    },
  },
  {
    id: "set-scale",
    title: "Soundstage Scale Sketch",
    standard: "CCSS.MATH.CONTENT.7.G.A.1",
    skill: "Use scale drawings to determine actual lengths.",
    context:
      "You’re sketching the haunted set for your live-action adaptation and need the blueprint to match real-life dimensions.",
    tip: "Multiply the drawing measurement by the scale factor.",
    format: "decimal",
    generate() {
      const scaleFeet = randomChoice([3, 4, 5, 6]);
      const drawingLength = randomChoice([1.5, 2, 2.5, 3, 3.5]);
      const actualLength = roundToTenth(drawingLength * scaleFeet);
      const question = `Your set blueprint uses a scale of 1 inch = ${scaleFeet} feet. If the haunted doorway measures ${drawingLength} inches on the drawing, what is the real doorway height in feet? Round to the nearest tenth if needed.`;
      const explanation = `${drawingLength} inches × ${scaleFeet} feet per inch = ${(
        drawingLength * scaleFeet
      ).toFixed(2)} feet. Rounded to the nearest tenth, that’s ${actualLength} feet.`;
      return {
        question,
        answer: actualLength,
        displayAnswer: `${actualLength} feet`,
        explanation,
      };
    },
  },
  {
    id: "light-ratio",
    title: "Lighting the Final Shot",
    standard: "CCSS.MATH.CONTENT.7.RP.A.2",
    skill: "Represent proportional relationships with ratios.",
    context:
      "Your cinematographer wants the key-to-fill light ratio perfect for the climactic rooftop scene.",
    tip: "Set up a proportion using the given ratio.",
    format: "integer",
    generate() {
      const keyPart = randomChoice([4, 5, 6]);
      const fillPart = randomChoice([3, 4]);
      const keyIntensity = randomChoice([1200, 1500, 1800, 2100]);
      const fillIntensity = Math.round((keyIntensity * fillPart) / keyPart);
      const question = `To keep the comic-book noir look, the key light and fill light must stay in a ${keyPart}:${fillPart} ratio. If the key light is set to ${keyIntensity} lumens, what should the fill light’s intensity be?`;
      const explanation = `The ratio ${keyPart}:${fillPart} means key ÷ fill = ${keyPart} ÷ ${fillPart}. Solve fill = (${fillPart}/${keyPart}) × ${keyIntensity} = ${fillIntensity} lumens.`;
      return {
        question,
        answer: fillIntensity,
        displayAnswer: `${fillIntensity} lumens`,
        explanation,
      };
    },
  },
  {
    id: "fan-poll",
    title: "Fan Screening Data Dive",
    standard: "CCSS.MATH.CONTENT.7.SP.B.4",
    skill: "Use measures of center to summarize data.",
    context:
      "You collected feedback on the rough cut of your horror anthology to decide which segment to expand.",
    tip: "Add the total minutes and divide by the number of viewers.",
    format: "decimal",
    generate() {
      const viewingMinutes = randomChoice([
        [32, 28, 35, 30, 33],
        [26, 31, 29, 34, 30],
        [38, 36, 40, 34, 37],
      ]);
      const mean = roundToTenth(
        viewingMinutes.reduce((sum, val) => sum + val, 0) /
          viewingMinutes.length
      );
      const question = `Five fans watched your new horror short and reported how many minutes of extra behind-the-scenes footage they would love to see: ${viewingMinutes.join(
        " min, "
      )} min. On average, how many minutes of bonus footage should you plan for the release? Round to the nearest tenth.`;
      const explanation = `Add the minutes (${viewingMinutes.join(
        " + "
      )} = ${viewingMinutes.reduce((a, b) => a + b, 0)}). Divide by 5 viewers to get ${mean} minutes on average.`;
      return {
        question,
        answer: mean,
        displayAnswer: `${mean} minutes`,
        explanation,
      };
    },
  },
];

let currentMission = null;
let missionCounter = 0;
const maxLogEntries = 6;

missionButton.addEventListener("click", () => {
  currentMission = launchMission();
});

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!currentMission) {
    showFeedback(
      "🚀 Launch a mission first!",
      "Tap the button above to get a new scenario to solve."
    );
    return;
  }

  const rawAnswer = answerInput.value.trim();
  if (!rawAnswer) {
    showFeedback(
      "🤔 Enter an answer first",
      "Type your calculation so we can see how close you are."
    );
    return;
  }

  const numericAnswer = parseAnswer(rawAnswer);
  if (Number.isNaN(numericAnswer)) {
    showFeedback(
      "📝 Try that again",
      "Use numbers, decimals, or simplified fractions so we can check your work."
    );
    return;
  }

  const isCorrect = compareAnswers(
    numericAnswer,
    currentMission.answer,
    currentMission.format
  );

  if (isCorrect) {
    showFeedback(
      "✅ Nailed it!",
      `${currentMission.explanation}`
    );
    logMissionResult(true);
  } else {
    showFeedback(
      "🔍 Not yet—review the steps",
      `${currentMission.explanation} Your target was ${currentMission.displayAnswer}.`
    );
    logMissionResult(false, numericAnswer);
  }
});

function launchMission() {
  missionCounter += 1;
  const template = randomChoice(problemTemplates);
  const generated = template.generate();
  const mission = {
    id: template.id,
    title: template.title,
    standard: template.standard,
    skill: template.skill,
    context: template.context,
    tip: template.tip,
    format: template.format,
    answer: generated.answer,
    displayAnswer: generated.displayAnswer,
    explanation: generated.explanation,
    question: generated.question,
  };

  missionTitle.textContent = `Mission ${missionCounter}: ${mission.title}`;
  missionStandard.textContent = `${mission.standard} • ${mission.skill}`;
  missionContext.textContent = mission.context;
  missionQuestion.textContent = mission.question;
  answerTip.textContent = mission.tip;
  feedbackPanel.hidden = true;
  feedbackResult.textContent = "";
  feedbackExplanation.textContent = "";
  answerInput.value = "";
  answerInput.focus();
  return mission;
}

function showFeedback(resultText, explanationText) {
  feedbackPanel.hidden = false;
  feedbackResult.textContent = resultText;
  feedbackExplanation.textContent = explanationText;
}

function logMissionResult(correct, attemptValue = null) {
  if (!currentMission) return;
  const entry = logTemplate.content.cloneNode(true);
  const titleEl = entry.querySelector(".mission-log__title");
  const summaryEl = entry.querySelector(".mission-log__summary");
  const status = correct ? "Completed" : "Retry";
  titleEl.textContent = `${status}: ${currentMission.title}`;
  summaryEl.textContent = correct
    ? `${currentMission.standard} mastered.`
    : `You entered ${formatDisplay(attemptValue, currentMission.format)}, but the target was ${currentMission.displayAnswer}.`;

  missionLog.prepend(entry);
  while (missionLog.children.length > maxLogEntries) {
    missionLog.removeChild(missionLog.lastElementChild);
  }
}

function randomChoice(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

function parseAnswer(value) {
  const cleaned = value
    .replace(/\$/g, "")
    .replace(/,/g, "")
    .trim();
  if (cleaned.includes("/")) {
    const [numeratorStr, denominatorStr] = cleaned.split("/");
    const numerator = parseFloat(numeratorStr);
    const denominator = parseFloat(denominatorStr);
    if (Number.isNaN(numerator) || Number.isNaN(denominator) || denominator === 0) {
      return NaN;
    }
    return numerator / denominator;
  }
  return Number.parseFloat(cleaned);
}

function compareAnswers(given, expected, format) {
  const tolerance = format === "currency" ? 0.01 : 0.02;
  return Math.abs(given - expected) <= tolerance;
}

function roundToCents(value) {
  return Math.round(value * 100) / 100;
}

function roundToTenth(value) {
  return Math.round(value * 10) / 10;
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function gcd(a, b) {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function simplifyFraction(num, den) {
  if (num === 0) return { num: 0, den: 1 };
  const divisor = gcd(num, den);
  return { num: num / divisor, den: den / divisor };
}

function formatDisplay(value, format) {
  if (value == null || Number.isNaN(value)) return "—";
  if (format === "currency") {
    return `$${roundToCents(value).toFixed(2)}`;
  }
  if (format === "integer") {
    return `${Math.round(value)}`;
  }
  return `${roundToTenth(value)}`;
}
