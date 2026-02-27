// CalcHQ Calculator Registry
// All calculator metadata, categories, FAQs, and routing slugs

export type Category = 'financial' | 'health' | 'math' | 'tools';

export interface Calculator {
  slug: string;
  title: string;
  description: string;
  category: Category;
  icon: string; // lucide icon name
  color: string; // tailwind color class for icon bg
  faqs: { question: string; answer: string }[];
  keywords: string[];
}

export const CATEGORIES: Record<Category, { label: string; color: string; bgColor: string; description: string }> = {
  financial: {
    label: 'Financial',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    description: 'Mortgage, loans, investments, salary, and more',
  },
  health: {
    label: 'Health & Fitness',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    description: 'BMI, calories, TDEE, body fat, and more',
  },
  math: {
    label: 'Math',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    description: 'Percentage, fractions, algebra, and more',
  },
  tools: {
    label: 'Tools',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    description: 'Unit converters, date calculators, and more',
  },
};

export const CALCULATORS: Calculator[] = [
  // ── FINANCIAL ──────────────────────────────────────────────────────────────
  {
    slug: 'loan',
    title: 'Loan Calculator',
    description: 'Calculate monthly payments, total interest, and full amortization schedule for any loan.',
    category: 'financial',
    icon: 'Banknote',
    color: 'bg-emerald-50 text-emerald-700',
    keywords: ['loan calculator', 'personal loan', 'monthly payment', 'amortization'],
    faqs: [
      {
        question: 'How is my monthly loan payment calculated?',
        answer: 'Your monthly payment is calculated using the standard amortization formula: M = P[r(1+r)^n]/[(1+r)^n-1], where P is the principal, r is the monthly interest rate, and n is the number of payments.',
      },
      {
        question: 'What is an amortization schedule?',
        answer: 'An amortization schedule shows the breakdown of each payment into principal and interest over the life of the loan. Early payments are mostly interest; later payments are mostly principal.',
      },
    ],
  },
  {
    slug: 'mortgage',
    title: 'Mortgage Calculator',
    description: 'Estimate your monthly mortgage payment including principal, interest, taxes, and insurance.',
    category: 'financial',
    icon: 'Home',
    color: 'bg-emerald-50 text-emerald-700',
    keywords: ['mortgage calculator', 'home loan', 'monthly mortgage payment', 'PITI'],
    faqs: [
      {
        question: 'What does PITI mean?',
        answer: 'PITI stands for Principal, Interest, Taxes, and Insurance — the four components that make up a typical monthly mortgage payment.',
      },
      {
        question: 'How much house can I afford?',
        answer: 'A common rule of thumb is that your monthly housing costs should not exceed 28% of your gross monthly income. Use this calculator to find a payment that fits your budget.',
      },
    ],
  },
  {
    slug: 'rent-vs-buy',
    title: 'Rent vs. Buy Calculator',
    description: 'Compare the true financial cost of renting versus buying a home over time.',
    category: 'financial',
    icon: 'ArrowLeftRight',
    color: 'bg-emerald-50 text-emerald-700',
    keywords: ['rent vs buy', 'should I rent or buy', 'renting vs buying calculator'],
    faqs: [
      {
        question: 'Is it always better to buy than rent?',
        answer: 'Not necessarily. Buying builds equity but comes with large upfront costs, maintenance, and less flexibility. Renting offers flexibility and lower upfront costs. This calculator helps you compare the true financial picture.',
      },
      {
        question: 'What is the break-even point?',
        answer: 'The break-even point is the number of years it takes for the total cost of buying to become less than the total cost of renting. This calculator estimates that point for your specific situation.',
      },
    ],
  },
  {
    slug: 'salary',
    title: 'Salary Calculator',
    description: 'Convert your salary between annual, monthly, weekly, and hourly rates instantly.',
    category: 'financial',
    icon: 'DollarSign',
    color: 'bg-emerald-50 text-emerald-700',
    keywords: ['salary calculator', 'hourly to salary', 'annual salary', 'pay calculator'],
    faqs: [
      {
        question: 'How do I convert an hourly wage to an annual salary?',
        answer: 'Multiply your hourly rate by the number of hours you work per week, then multiply by 52 (weeks per year). For example, $25/hour × 40 hours × 52 weeks = $52,000/year.',
      },
      {
        question: 'How many working hours are in a year?',
        answer: 'A standard full-time work year is 2,080 hours (40 hours/week × 52 weeks). This calculator uses your actual hours per week for accuracy.',
      },
    ],
  },
  {
    slug: 'sales-tax',
    title: 'Sales Tax & Tip Calculator',
    description: 'Calculate sales tax, add tips, and split bills easily for any purchase.',
    category: 'financial',
    icon: 'Receipt',
    color: 'bg-emerald-50 text-emerald-700',
    keywords: ['sales tax calculator', 'tip calculator', 'bill splitter', 'tax calculator'],
    faqs: [
      {
        question: 'How do I calculate sales tax?',
        answer: 'Multiply the pre-tax price by the tax rate (as a decimal). For example, a $50 item with 8% tax: $50 × 0.08 = $4 tax, so the total is $54.',
      },
      {
        question: 'How much should I tip?',
        answer: 'Standard tip amounts are 15% for adequate service, 18-20% for good service, and 20-25% for excellent service. This calculator lets you choose any tip percentage.',
      },
    ],
  },

  // ── HEALTH & FITNESS ───────────────────────────────────────────────────────
  {
    slug: 'tdee',
    title: 'TDEE Calculator',
    description: 'Calculate your Total Daily Energy Expenditure to know exactly how many calories you burn each day.',
    category: 'health',
    icon: 'Flame',
    color: 'bg-blue-50 text-blue-700',
    keywords: ['TDEE calculator', 'total daily energy expenditure', 'calorie burn', 'maintenance calories'],
    faqs: [
      {
        question: 'What is TDEE?',
        answer: 'TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns in a day, accounting for your basal metabolic rate (BMR) and your activity level.',
      },
      {
        question: 'How do I use my TDEE to lose weight?',
        answer: 'To lose weight, consume fewer calories than your TDEE. A deficit of 500 calories per day typically results in about 1 pound of fat loss per week.',
      },
    ],
  },
  {
    slug: 'macro',
    title: 'Macro Calculator',
    description: 'Get your personalized daily macronutrient targets for protein, carbs, and fat based on your goals.',
    category: 'health',
    icon: 'PieChart',
    color: 'bg-blue-50 text-blue-700',
    keywords: ['macro calculator', 'macronutrient calculator', 'protein carbs fat', 'diet calculator'],
    faqs: [
      {
        question: 'What are macronutrients?',
        answer: 'Macronutrients are the three main nutrients your body needs in large amounts: protein (4 cal/g), carbohydrates (4 cal/g), and fat (9 cal/g). Each plays a critical role in body function.',
      },
      {
        question: 'How much protein do I need per day?',
        answer: 'For most active people, 0.7–1g of protein per pound of body weight is recommended. Athletes and those trying to build muscle may benefit from the higher end of this range.',
      },
    ],
  },
  {
    slug: 'bmi',
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index and understand what it means for your health.',
    category: 'health',
    icon: 'Scale',
    color: 'bg-blue-50 text-blue-700',
    keywords: ['BMI calculator', 'body mass index', 'healthy weight', 'overweight calculator'],
    faqs: [
      {
        question: 'What is a healthy BMI?',
        answer: 'According to the CDC, a BMI below 18.5 is underweight, 18.5–24.9 is normal weight, 25–29.9 is overweight, and 30 or above is obese. BMI is a screening tool, not a diagnostic measure.',
      },
      {
        question: 'Is BMI an accurate measure of health?',
        answer: 'BMI is a useful screening tool but has limitations. It does not account for muscle mass, bone density, or fat distribution. Athletes may have a high BMI despite being very healthy.',
      },
    ],
  },
  {
    slug: 'body-fat',
    title: 'Body Fat Calculator',
    description: 'Estimate your body fat percentage using the U.S. Navy method based on body measurements.',
    category: 'health',
    icon: 'Activity',
    color: 'bg-blue-50 text-blue-700',
    keywords: ['body fat calculator', 'body fat percentage', 'navy method', 'body composition'],
    faqs: [
      {
        question: 'What is a healthy body fat percentage?',
        answer: 'For men, 10–20% is considered fit, and 20–25% is acceptable. For women, 18–28% is considered fit, and 25–31% is acceptable. Athletes often have lower percentages.',
      },
      {
        question: 'How accurate is the Navy body fat method?',
        answer: 'The U.S. Navy method is reasonably accurate for most people, with an error margin of about 3–4%. It uses neck, waist, and hip measurements to estimate body fat percentage.',
      },
    ],
  },
  {
    slug: 'bmr',
    title: 'BMR Calculator',
    description: 'Calculate your Basal Metabolic Rate — the calories your body burns at complete rest.',
    category: 'health',
    icon: 'HeartPulse',
    color: 'bg-blue-50 text-blue-700',
    keywords: ['BMR calculator', 'basal metabolic rate', 'resting metabolism', 'calorie calculator'],
    faqs: [
      {
        question: 'What is BMR?',
        answer: 'BMR (Basal Metabolic Rate) is the number of calories your body needs to maintain basic physiological functions at complete rest — breathing, circulation, cell production, and temperature regulation.',
      },
      {
        question: 'What is the difference between BMR and TDEE?',
        answer: 'BMR is your calorie burn at rest. TDEE (Total Daily Energy Expenditure) is your BMR multiplied by an activity factor to account for exercise and daily movement.',
      },
    ],
  },
  {
    slug: 'one-rep-max',
    title: 'One Rep Max Calculator',
    description: 'Estimate your maximum lifting strength from any rep count using proven formulas.',
    category: 'health',
    icon: 'Dumbbell',
    color: 'bg-blue-50 text-blue-700',
    keywords: ['one rep max calculator', '1RM calculator', 'max lift', 'strength calculator'],
    faqs: [
      {
        question: 'What is a one rep max (1RM)?',
        answer: 'Your one rep max (1RM) is the maximum amount of weight you can lift for a single repetition of a given exercise. It is used to gauge strength and set training weights.',
      },
      {
        question: 'Which 1RM formula is most accurate?',
        answer: 'The Epley and Brzycki formulas are the most widely used. This calculator uses the Epley formula (weight × (1 + reps/30)), which is accurate for sets of 1–10 reps.',
      },
    ],
  },
  {
    slug: 'calories-burned',
    title: 'Calories Burned Calculator',
    description: 'Estimate calories burned during exercise based on activity type, duration, and body weight.',
    category: 'health',
    icon: 'Zap',
    color: 'bg-blue-50 text-blue-700',
    keywords: ['calories burned calculator', 'exercise calories', 'workout calories', 'MET calculator'],
    faqs: [
      {
        question: 'How are calories burned during exercise calculated?',
        answer: 'Calories burned are estimated using MET (Metabolic Equivalent of Task) values: Calories = MET × weight (kg) × duration (hours). Different activities have different MET values.',
      },
      {
        question: 'How accurate are calorie burn estimates?',
        answer: 'These are estimates based on average values. Actual calorie burn varies by individual fitness level, body composition, and exercise intensity. Heart rate monitors provide more personalized estimates.',
      },
    ],
  },
  {
    slug: 'fat-burning-zone',
    title: 'Fat Burning Zone Calculator',
    description: 'Find your optimal heart rate zones for fat burning and cardio fitness.',
    category: 'health',
    icon: 'TrendingUp',
    color: 'bg-blue-50 text-blue-700',
    keywords: ['fat burning zone calculator', 'heart rate zone', 'target heart rate', 'cardio calculator'],
    faqs: [
      {
        question: 'What is the fat burning zone?',
        answer: 'The fat burning zone is typically 60–70% of your maximum heart rate. At this intensity, your body uses a higher proportion of fat as fuel, though total calorie burn is lower than at higher intensities.',
      },
      {
        question: 'How do I calculate my maximum heart rate?',
        answer: 'The most common formula is 220 minus your age. For example, a 30-year-old has an estimated max heart rate of 190 bpm. This is an estimate; individual max heart rates vary.',
      },
    ],
  },

  // ── TOOLS ──────────────────────────────────────────────────────────────────
  {
    slug: 'unit-converter',
    title: 'Unit Converter',
    description: 'Convert between units of length, weight, temperature, volume, area, and more.',
    category: 'tools',
    icon: 'RefreshCw',
    color: 'bg-amber-50 text-amber-700',
    keywords: ['unit converter', 'length converter', 'weight converter', 'temperature converter'],
    faqs: [
      {
        question: 'How do I convert Celsius to Fahrenheit?',
        answer: 'Use the formula: °F = (°C × 9/5) + 32. For example, 100°C = (100 × 9/5) + 32 = 212°F.',
      },
      {
        question: 'How many kilograms are in a pound?',
        answer: '1 pound = 0.453592 kilograms. Conversely, 1 kilogram = 2.20462 pounds.',
      },
    ],
  },
];

export function getCalculatorBySlug(slug: string): Calculator | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}

export function getCalculatorsByCategory(category: Category): Calculator[] {
  return CALCULATORS.filter((c) => c.category === category);
}

export function getAllCategories(): Category[] {
  return ['financial', 'health', 'math', 'tools'];
}
