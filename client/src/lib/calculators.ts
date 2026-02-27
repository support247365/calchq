// CalcHQ Calculator Registry
// All calculator metadata, categories, FAQs, and routing slugs
import { CALCULATOR_CONTENT } from './calculatorContent';

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
  explanation?: string[]; // 2-3 paragraphs explaining what the calculator is
  howTo?: {
    intro: string;
    steps: { title: string; text: string }[];
  };
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
  // -- FINANCIAL --------------------------------------------------------------
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
        answer: 'PITI stands for Principal, Interest, Taxes, and Insurance -- the four components that make up a typical monthly mortgage payment.',
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
        answer: 'Multiply your hourly rate by the number of hours you work per week, then multiply by 52 (weeks per year). For example, $25/hour x 40 hours x 52 weeks = $52,000/year.',
      },
      {
        question: 'How many working hours are in a year?',
        answer: 'A standard full-time work year is 2,080 hours (40 hours/week x 52 weeks). This calculator uses your actual hours per week for accuracy.',
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
        answer: 'Multiply the pre-tax price by the tax rate (as a decimal). For example, a $50 item with 8% tax: $50 x 0.08 = $4 tax, so the total is $54.',
      },
      {
        question: 'How much should I tip?',
        answer: 'Standard tip amounts are 15% for adequate service, 18-20% for good service, and 20-25% for excellent service. This calculator lets you choose any tip percentage.',
      },
    ],
  },

  // -- HEALTH & FITNESS -------------------------------------------------------
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
        answer: 'For most active people, 0.7-1g of protein per pound of body weight is recommended. Athletes and those trying to build muscle may benefit from the higher end of this range.',
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
        answer: 'According to the CDC, a BMI below 18.5 is underweight, 18.5-24.9 is normal weight, 25-29.9 is overweight, and 30 or above is obese. BMI is a screening tool, not a diagnostic measure.',
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
        answer: 'For men, 10-20% is considered fit, and 20-25% is acceptable. For women, 18-28% is considered fit, and 25-31% is acceptable. Athletes often have lower percentages.',
      },
      {
        question: 'How accurate is the Navy body fat method?',
        answer: 'The U.S. Navy method is reasonably accurate for most people, with an error margin of about 3-4%. It uses neck, waist, and hip measurements to estimate body fat percentage.',
      },
    ],
  },
  {
    slug: 'bmr',
    title: 'BMR Calculator',
    description: 'Calculate your Basal Metabolic Rate -- the calories your body burns at complete rest.',
    category: 'health',
    icon: 'HeartPulse',
    color: 'bg-blue-50 text-blue-700',
    keywords: ['BMR calculator', 'basal metabolic rate', 'resting metabolism', 'calorie calculator'],
    faqs: [
      {
        question: 'What is BMR?',
        answer: 'BMR (Basal Metabolic Rate) is the number of calories your body needs to maintain basic physiological functions at complete rest -- breathing, circulation, cell production, and temperature regulation.',
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
        answer: 'The Epley and Brzycki formulas are the most widely used. This calculator uses the Epley formula (weight x (1 + reps/30)), which is accurate for sets of 1-10 reps.',
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
        answer: 'Calories burned are estimated using MET (Metabolic Equivalent of Task) values: Calories = MET x weight (kg) x duration (hours). Different activities have different MET values.',
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
        answer: 'The fat burning zone is typically 60-70% of your maximum heart rate. At this intensity, your body uses a higher proportion of fat as fuel, though total calorie burn is lower than at higher intensities.',
      },
      {
        question: 'How do I calculate my maximum heart rate?',
        answer: 'The most common formula is 220 minus your age. For example, a 30-year-old has an estimated max heart rate of 190 bpm. This is an estimate; individual max heart rates vary.',
      },
    ],
  },

  // -- FINANCIAL (EXPANSION) ---------------------------------------------------
  {
    slug: 'percentage',
    title: 'Percentage Calculator',
    description: 'Calculate percentages instantly -- find what percent of a number is, what percentage one number is of another, or the percentage change between two values.',
    category: 'math',
    icon: 'Percent',
    color: 'bg-violet-50 text-violet-700',
    keywords: ['percentage calculator', 'percent of a number', 'percentage change', 'percent increase decrease'],
    faqs: [
      {
        question: 'How do I calculate what percent one number is of another?',
        answer: 'Divide the part by the whole, then multiply by 100. For example, 30 is what percent of 150? (30 / 150) x 100 = 20%.',
      },
      {
        question: 'How do I calculate percentage increase or decrease?',
        answer: 'Subtract the old value from the new value, divide by the old value, then multiply by 100. Example: from 80 to 100 is a 25% increase: ((100 - 80) / 80) x 100 = 25%.',
      },
      {
        question: 'What is 15% of 200?',
        answer: 'Multiply 200 by 0.15 (which is 15 / 100). 200 x 0.15 = 30. So 15% of 200 is 30.',
      },
    ],
  },
  {
    slug: 'compound-interest',
    title: 'Compound Interest Calculator',
    description: 'See how your money grows over time with the power of compound interest. Includes monthly contributions and multiple compounding frequencies.',
    category: 'financial',
    icon: 'TrendingUp',
    color: 'bg-emerald-50 text-emerald-700',
    keywords: ['compound interest calculator', 'investment growth', 'savings calculator', 'interest calculator'],
    faqs: [
      {
        question: 'What is compound interest?',
        answer: 'Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. Unlike simple interest, it causes wealth to grow exponentially over time.',
      },
      {
        question: 'How often should interest compound for maximum growth?',
        answer: 'More frequent compounding means slightly more growth. Daily compounding yields marginally more than monthly, which yields more than annual. However, the difference between daily and monthly is usually small.',
      },
      {
        question: 'What is the Rule of 72?',
        answer: 'The Rule of 72 is a quick way to estimate how long it takes to double your money. Divide 72 by the annual interest rate. At 7% annual return, your money doubles in approximately 72 / 7 = 10.3 years.',
      },
    ],
  },
  {
    slug: 'retirement',
    title: 'Retirement Calculator',
    description: 'Find out how much you need to save for retirement and whether you are on track to meet your goals.',
    category: 'financial',
    icon: 'PiggyBank',
    color: 'bg-emerald-50 text-emerald-700',
    keywords: ['retirement calculator', 'retirement savings', '401k calculator', 'retirement planning'],
    faqs: [
      {
        question: 'How much do I need to retire?',
        answer: 'A common rule of thumb is the 25x rule: save 25 times your expected annual expenses. This is based on the 4% withdrawal rate, which historically sustains a 30-year retirement.',
      },
      {
        question: 'What is the 4% rule?',
        answer: 'The 4% rule suggests you can withdraw 4% of your retirement portfolio in year one, then adjust for inflation each year, with a high probability of not running out of money over a 30-year retirement.',
      },
      {
        question: 'How much should I contribute to my 401(k)?',
        answer: 'At minimum, contribute enough to get your full employer match -- that is free money. Beyond that, aim to save 15% of your gross income for retirement across all accounts.',
      },
    ],
  },
  {
    slug: 'paycheck',
    title: 'Paycheck & Tax Calculator',
    description: 'Calculate your take-home pay after federal income tax, Social Security, Medicare, state tax, and 401(k) contributions.',
    category: 'financial',
    icon: 'Wallet',
    color: 'bg-emerald-50 text-emerald-700',
    keywords: ['paycheck calculator', 'take home pay', 'salary after tax', 'net pay calculator', 'income tax calculator'],
    faqs: [
      {
        question: 'What taxes are taken out of my paycheck?',
        answer: 'Federal income tax, Social Security (6.2%), Medicare (1.45%), and state income tax (varies by state). Pre-tax deductions like 401(k) contributions reduce your taxable income.',
      },
      {
        question: 'What is the difference between gross and net pay?',
        answer: 'Gross pay is your total earnings before any deductions. Net pay (take-home pay) is what remains after all taxes and deductions are subtracted.',
      },
      {
        question: 'How can I increase my take-home pay?',
        answer: 'You can increase take-home pay by adjusting your W-4 withholding, maximizing pre-tax deductions (401k, HSA, FSA), or by reducing your taxable income through deductions and credits.',
      },
    ],
  },
  {
    slug: 'roi',
    title: 'Investment ROI Calculator',
    description: 'Calculate the return on investment (ROI) and annualized return for any investment, stock, or business venture.',
    category: 'financial',
    icon: 'BarChart2',
    color: 'bg-emerald-50 text-emerald-700',
    keywords: ['ROI calculator', 'return on investment', 'investment return calculator', 'annualized return'],
    faqs: [
      {
        question: 'How is ROI calculated?',
        answer: 'ROI = ((Final Value - Initial Investment) / Initial Investment) x 100. For example, investing $10,000 that grows to $15,000 gives an ROI of 50%.',
      },
      {
        question: 'What is a good ROI?',
        answer: 'A good ROI depends on the asset class and risk level. The S&P 500 has historically returned about 10% annually. Real estate typically returns 8-12%. A good rule of thumb is any return that beats inflation and your next best alternative.',
      },
      {
        question: 'What is annualized ROI?',
        answer: 'Annualized ROI (also called CAGR -- Compound Annual Growth Rate) normalizes returns over multiple years to show the equivalent annual growth rate. It allows fair comparison of investments held for different time periods.',
      },
    ],
  },
  {
    slug: 'refinance',
    title: 'Mortgage Refinance Calculator',
    description: 'Find out how much you could save by refinancing your mortgage and calculate your break-even point.',
    category: 'financial',
    icon: 'RefreshCw',
    color: 'bg-emerald-50 text-emerald-700',
    keywords: ['refinance calculator', 'mortgage refinance', 'refinancing savings', 'break even refinance'],
    faqs: [
      {
        question: 'When does it make sense to refinance?',
        answer: 'Refinancing typically makes sense when you can lower your interest rate by at least 0.5-1%, plan to stay in your home past the break-even point, and have good credit to qualify for a competitive rate.',
      },
      {
        question: 'What are typical refinancing closing costs?',
        answer: 'Closing costs for a refinance typically range from 2-5% of the loan amount, or $3,000-$6,000 on a $200,000 mortgage. Some lenders offer no-closing-cost refinances at a slightly higher rate.',
      },
      {
        question: 'What is the break-even point on a refinance?',
        answer: 'The break-even point is how long it takes for your monthly savings to recoup the closing costs. If closing costs are $4,000 and you save $200/month, your break-even is 20 months.',
      },
    ],
  },

  // -- HEALTH & FITNESS (EXPANSION) ------------------------------------------
  {
    slug: 'pregnancy',
    title: 'Pregnancy Due Date Calculator',
    description: 'Calculate your estimated due date and key pregnancy milestones based on your last menstrual period or conception date.',
    category: 'health',
    icon: 'Baby',
    color: 'bg-blue-50 text-blue-700',
    keywords: ['pregnancy calculator', 'due date calculator', 'pregnancy due date', 'when is my baby due'],
    faqs: [
      {
        question: 'How is a due date calculated?',
        answer: 'The most common method is Naegele\'s Rule: add 280 days (40 weeks) to the first day of your last menstrual period (LMP). This assumes a 28-day cycle with ovulation on day 14.',
      },
      {
        question: 'How accurate is an estimated due date?',
        answer: 'Only about 5% of babies are born on their exact due date. Most are born within 2 weeks before or after. An ultrasound in the first trimester provides the most accurate dating.',
      },
      {
        question: 'What are the three trimesters of pregnancy?',
        answer: 'The first trimester is weeks 1-12, the second trimester is weeks 13-26, and the third trimester is weeks 27-40. Each trimester brings distinct developmental milestones.',
      },
    ],
  },
  {
    slug: 'ovulation',
    title: 'Ovulation Calculator',
    description: 'Identify your most fertile days and predict your ovulation date based on your menstrual cycle.',
    category: 'health',
    icon: 'Calendar',
    color: 'bg-blue-50 text-blue-700',
    keywords: ['ovulation calculator', 'fertile days calculator', 'ovulation tracker', 'best days to conceive'],
    faqs: [
      {
        question: 'When do I ovulate?',
        answer: 'Ovulation typically occurs about 14 days before your next period. For a 28-day cycle, that is around day 14. For a 32-day cycle, it would be around day 18.',
      },
      {
        question: 'What is the fertile window?',
        answer: 'The fertile window is the 6-day period ending on the day of ovulation. Sperm can survive up to 5 days in the reproductive tract, so intercourse in the days before ovulation can result in pregnancy.',
      },
      {
        question: 'How can I confirm ovulation?',
        answer: 'Ovulation predictor kits (OPKs) detect the LH surge that occurs 24-36 hours before ovulation. Basal body temperature (BBT) tracking and cervical mucus monitoring are also reliable methods.',
      },
    ],
  },
  {
    slug: 'calorie-deficit',
    title: 'Calorie Deficit Calculator',
    description: 'Calculate your daily calorie target to lose weight at your desired pace using the Mifflin-St Jeor equation.',
    category: 'health',
    icon: 'Minus',
    color: 'bg-blue-50 text-blue-700',
    keywords: ['calorie deficit calculator', 'weight loss calculator', 'how many calories to lose weight', 'calorie calculator'],
    faqs: [
      {
        question: 'How many calories do I need to cut to lose 1 pound per week?',
        answer: 'One pound of fat equals approximately 3,500 calories. To lose 1 pound per week, you need a daily deficit of 500 calories (3,500 / 7 = 500).',
      },
      {
        question: 'What is the minimum safe calorie intake?',
        answer: 'Most health authorities recommend no fewer than 1,200 calories per day for women and 1,500 for men without medical supervision. Going below these levels can cause nutrient deficiencies and metabolic adaptation.',
      },
      {
        question: 'What is the Mifflin-St Jeor equation?',
        answer: 'The Mifflin-St Jeor equation is considered the most accurate formula for estimating BMR. For men: (10 x weight in kg) + (6.25 x height in cm) - (5 x age) + 5. For women: same formula but -161 instead of +5.',
      },
    ],
  },
  {
    slug: 'ideal-weight',
    title: 'Ideal Weight Calculator',
    description: 'Find your ideal body weight based on height and sex using four medically recognized formulas.',
    category: 'health',
    icon: 'Target',
    color: 'bg-blue-50 text-blue-700',
    keywords: ['ideal weight calculator', 'healthy weight calculator', 'ideal body weight', 'weight for height'],
    faqs: [
      {
        question: 'What is the ideal weight for my height?',
        answer: 'Ideal weight varies by formula and individual factors. This calculator uses four established formulas (Robinson, Miller, Devine, Hamwi) and shows the average. The healthy BMI range (18.5-24.9) provides another benchmark.',
      },
      {
        question: 'Is ideal weight the same as healthy weight?',
        answer: 'Not exactly. Ideal weight formulas provide a single target number, while healthy weight is a range. Factors like muscle mass, bone density, and body composition matter more than a single number.',
      },
      {
        question: 'Which ideal weight formula is most accurate?',
        answer: 'No single formula is universally best. The Devine formula is widely used in clinical settings. The average of multiple formulas, as shown in this calculator, provides a more balanced estimate.',
      },
    ],
  },
  {
    slug: 'sleep',
    title: 'Sleep Calculator',
    description: 'Find the best bedtime or wake-up time based on 90-minute sleep cycles to wake up feeling refreshed.',
    category: 'health',
    icon: 'Moon',
    color: 'bg-blue-50 text-blue-700',
    keywords: ['sleep calculator', 'best time to wake up', 'sleep cycle calculator', 'bedtime calculator'],
    faqs: [
      {
        question: 'How long is a sleep cycle?',
        answer: 'A complete sleep cycle lasts approximately 90 minutes and includes light sleep, deep sleep, and REM sleep stages. Most adults need 5-6 complete cycles (7.5-9 hours) per night.',
      },
      {
        question: 'Why do I feel groggy even after 8 hours of sleep?',
        answer: 'Waking up in the middle of a deep sleep stage causes sleep inertia -- that groggy, disoriented feeling. This calculator helps you time your alarm to coincide with the end of a sleep cycle, when sleep is lightest.',
      },
      {
        question: 'How much sleep do adults need?',
        answer: 'The CDC recommends 7-9 hours of sleep per night for adults aged 18-60. Older adults may need slightly less. Consistently sleeping fewer than 7 hours is associated with increased health risks.',
      },
    ],
  },

  // -- TOOLS --------------------------------------------------------------
  {
    slug: 'calculator',
    title: 'Calculator',
    description: 'A full-featured calculator with three modes: Standard for everyday math, Scientific for trigonometry and logarithms, and Engineering for advanced functions.',
    category: 'math',
    icon: 'Calculator',
    color: 'bg-violet-50 text-violet-700',
    keywords: ['calculator', 'scientific calculator', 'engineering calculator', 'online calculator', 'standard calculator'],
    faqs: [
      {
        question: 'What is the difference between Standard, Scientific, and Engineering modes?',
        answer: 'Standard mode handles everyday arithmetic: addition, subtraction, multiplication, and division. Scientific mode adds trigonometric functions (sin, cos, tan), logarithms, square roots, exponents, and constants like pi and e. Engineering mode extends Scientific with inverse trig functions, cube roots, absolute value, ceiling/floor functions, and outputs results in scientific notation for very large or very small numbers.',
      },
      {
        question: 'How do I use the history feature?',
        answer: 'Every calculation you perform is saved in the History panel below the calculator. Click any history entry to load that result back into the calculator as your starting value. Click Clear to erase the history.',
      },
      {
        question: 'How do I calculate trigonometric functions?',
        answer: 'Switch to Scientific or Engineering mode, press sin, cos, or tan, enter your angle value in radians, and close the parenthesis before pressing equals. For example, sin(1.5708) gives approximately 1, which is sin(90 degrees in radians).',
      },
    ],
  },
  {
    slug: 'age',
    title: 'Age Calculator',
    description: 'Calculate your exact age in years, months, days, weeks, and hours -- plus find out how many days until your next birthday.',
    category: 'tools',
    icon: 'Cake',
    color: 'bg-pink-50 text-pink-700',
    keywords: ['age calculator', 'how old am i', 'birthday calculator', 'age in days', 'next birthday'],
    faqs: [
      {
        question: 'How is my exact age calculated?',
        answer: 'Your exact age is calculated by finding the difference between your date of birth and today (or any target date), accounting for leap years and varying month lengths to give you the precise number of years, months, and days.',
      },
      {
        question: 'How many days old am I?',
        answer: 'Your total age in days is the number of calendar days elapsed from your birth date to today. This accounts for every leap year in between. The Age Calculator shows this automatically alongside your age in weeks, months, and hours.',
      },
      {
        question: 'How do I calculate how many days until my next birthday?',
        answer: 'Find the date of your next birthday (same month and day, next calendar year if it has already passed this year), then subtract today\'s date. The Age Calculator does this automatically and shows the exact number of days remaining.',
      },
    ],
  },
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
        answer: 'Use the formula: F = (C x 9/5) + 32. For example, 100C = (100 x 9/5) + 32 = 212F.',
      },
      {
        question: 'How many kilograms are in a pound?',
        answer: '1 pound = 0.453592 kilograms. Conversely, 1 kilogram = 2.20462 pounds.',
      },
    ],
  },
  // -- NEW PHASE 2 CALCULATORS -----------------------------------------------
  {
    slug: 'gpa',
    title: 'GPA Calculator',
    description: 'Calculate your GPA instantly. Enter your courses, grades, and credit hours to get your weighted GPA on a 4.0 scale.',
    category: 'math',
    icon: 'GraduationCap',
    color: 'bg-violet-50 text-violet-700',
    keywords: ['gpa calculator', 'grade point average', 'college gpa', 'cumulative gpa', 'semester gpa'],
    faqs: [
      {
        question: 'How is GPA calculated?',
        answer: 'GPA is calculated by multiplying each course grade point value by the number of credit hours, summing all quality points, then dividing by the total credit hours. For example, an A (4.0) in a 3-credit course contributes 12 quality points.',
      },
      {
        question: 'What is a good GPA?',
        answer: 'A GPA of 3.5 or higher is generally considered excellent and qualifies for honors designations like Magna Cum Laude. A 3.0 GPA is considered good and is often the minimum for graduate school applications. Below 2.0 may put you on academic probation.',
      },
      {
        question: 'What is the difference between semester GPA and cumulative GPA?',
        answer: 'Semester GPA reflects only the courses taken in a single term, while cumulative GPA is the weighted average of all courses taken throughout your academic career. Most graduate schools and employers look at cumulative GPA.',
      },
      {
        question: 'Does an A+ give a higher GPA than an A?',
        answer: 'At most US universities, both A+ and A are worth 4.0 grade points. Some schools award 4.3 for an A+, but this is not standard. Check your institution\'s grading policy for the exact scale used.',
      },
    ],
  },
  {
    slug: 'tip',
    title: 'Tip Calculator',
    description: 'Calculate the tip amount and total bill instantly. Split the bill evenly among any number of people.',
    category: 'financial',
    icon: 'Receipt',
    color: 'bg-emerald-50 text-emerald-700',
    keywords: ['tip calculator', 'gratuity calculator', 'restaurant tip', 'split bill', 'how much to tip'],
    faqs: [
      {
        question: 'How much should I tip at a restaurant?',
        answer: 'The standard tip at a US restaurant is 15-20% for good service. 10% is acceptable for poor service, 18% is the norm for average service, 20% for great service, and 25% or more for exceptional service. In some cities like New York, 20% is considered the baseline.',
      },
      {
        question: 'Do I tip on the pre-tax or post-tax amount?',
        answer: 'Tipping on the pre-tax amount is technically correct and slightly reduces the tip. However, most people tip on the total bill including tax for simplicity. The difference is small -- on a $100 bill with 8% tax, tipping 20% on pre-tax gives $20 vs $21.60 on post-tax.',
      },
      {
        question: 'How do I split a bill evenly?',
        answer: 'Enter the total bill amount, select your tip percentage, then enter the number of people. The calculator divides the total (bill + tip) equally among all diners and shows each person\'s share.',
      },
      {
        question: 'How much do you tip for delivery?',
        answer: 'For food delivery, tip 15-20% of the order total or a minimum of $3-5 for small orders. For grocery delivery, $5-10 is standard. Always tip in cash when possible as some apps do not pass 100% of digital tips to drivers.',
      },
    ],
  },
  {
    slug: 'fuel-cost',
    title: 'Fuel Cost Calculator',
    description: 'Calculate the gas cost for any trip. Enter distance, fuel economy, and gas price to find your total fuel expense.',
    category: 'financial',
    icon: 'Fuel',
    color: 'bg-orange-50 text-orange-700',
    keywords: ['fuel cost calculator', 'gas cost calculator', 'trip cost', 'mpg calculator', 'road trip cost'],
    faqs: [
      {
        question: 'How do I calculate fuel cost for a road trip?',
        answer: 'Divide the total distance by your vehicle\'s fuel economy (MPG) to get gallons needed, then multiply by the current gas price. For example, a 300-mile trip in a 30 MPG car at $3.50/gallon costs (300/30) x $3.50 = $35.',
      },
      {
        question: 'What is the average MPG for a car?',
        answer: 'The average new car in the US gets about 28-30 MPG combined. Compact cars average 32-38 MPG, SUVs average 22-28 MPG, trucks average 18-24 MPG, and hybrid vehicles average 40-55 MPG. Electric vehicles are measured in MPGe (miles per gallon equivalent).',
      },
      {
        question: 'How can I improve my fuel economy?',
        answer: 'Maintain steady speeds and avoid rapid acceleration, keep tires properly inflated (can improve MPG by up to 3%), remove excess weight from the vehicle, use cruise control on highways, and keep up with regular maintenance like air filter and spark plug replacements.',
      },
      {
        question: 'How do I convert MPG to L/100km?',
        answer: 'To convert MPG to L/100km, divide 235.21 by the MPG value. For example, 30 MPG = 235.21/30 = 7.84 L/100km. To convert L/100km to MPG, divide 235.21 by the L/100km value.',
      },
    ],
  },
  {
    slug: 'currency',
    title: 'Currency Converter',
    description: 'Convert between 20 major world currencies with up-to-date reference exchange rates. Fast, free, and no sign-up required.',
    category: 'financial',
    icon: 'DollarSign',
    color: 'bg-emerald-50 text-emerald-700',
    keywords: ['currency converter', 'exchange rate', 'usd to eur', 'foreign exchange', 'forex calculator'],
    faqs: [
      {
        question: 'How are exchange rates calculated?',
        answer: 'Exchange rates are determined by the foreign exchange (forex) market, which operates 24/7. Rates fluctuate based on supply and demand, interest rates, inflation, political stability, and economic performance. The rates shown here are reference rates for informational purposes.',
      },
      {
        question: 'What is the difference between buy and sell rates?',
        answer: 'Banks and currency exchange services quote two rates: the buy rate (what they pay you for foreign currency) and the sell rate (what they charge you). The difference is called the spread and is how they profit. Online converters typically show mid-market rates, which are between the two.',
      },
      {
        question: 'Which is the strongest currency in the world?',
        answer: 'The Kuwaiti Dinar (KWD) is consistently the highest-valued currency, with 1 KWD worth about $3.25 USD. The Bahraini Dinar and Omani Rial also rank highly. However, currency strength is different from economic strength -- the USD and EUR dominate global trade volume.',
      },
      {
        question: 'What is a good exchange rate for USD to EUR?',
        answer: 'Historically, 1 USD has ranged from 0.85 to 1.05 EUR. A rate above 0.95 EUR per USD is generally favorable for Americans traveling to Europe. Always compare rates from multiple sources and avoid airport currency exchange booths which typically have the worst rates.',
      },
    ],
  },
  {
    slug: 'inflation',
    title: 'Inflation Calculator',
    description: 'Calculate the real value of money over time using historical US CPI data. See how inflation has eroded purchasing power since 1960.',
    category: 'financial',
    icon: 'TrendingUp',
    color: 'bg-red-50 text-red-700',
    keywords: ['inflation calculator', 'purchasing power', 'cpi calculator', 'cost of living', 'real value of money'],
    faqs: [
      {
        question: 'What is inflation?',
        answer: 'Inflation is the rate at which the general level of prices for goods and services rises over time, reducing purchasing power. When inflation is 3%, a basket of goods that cost $100 today will cost $103 next year. The US Federal Reserve targets 2% annual inflation as healthy for the economy.',
      },
      {
        question: 'How is inflation measured?',
        answer: 'In the US, inflation is primarily measured by the Consumer Price Index (CPI), published monthly by the Bureau of Labor Statistics. The CPI tracks the price of a fixed basket of goods and services purchased by typical urban consumers, including food, housing, transportation, and medical care.',
      },
      {
        question: 'What was the highest inflation rate in US history?',
        answer: 'The highest peacetime inflation in modern US history occurred in 1980 when the annual rate reached 13.5%, driven by oil price shocks and loose monetary policy. More recently, inflation peaked at 9.1% in June 2022, the highest since 1981, driven by pandemic supply chain disruptions and stimulus spending.',
      },
      {
        question: 'How does inflation affect savings?',
        answer: 'If your savings account earns 1% interest but inflation is 3%, your money loses 2% of its purchasing power each year. To preserve wealth, investments need to earn returns that exceed the inflation rate. This is why financial advisors recommend investing in assets like stocks, real estate, or TIPS (Treasury Inflation-Protected Securities).',
      },
    ],
  },
  // -- PHASE 4: MATH SECTION EXPANSION ------------------------------------------
  {
    slug: 'fraction',
    title: 'Fraction Calculator',
    description: 'Add, subtract, multiply, and divide fractions instantly. Shows simplified results, mixed numbers, decimals, and step-by-step solutions.',
    category: 'math',
    icon: 'Divide',
    color: 'bg-violet-50 text-violet-700',
    keywords: ['fraction calculator', 'add fractions', 'subtract fractions', 'multiply fractions', 'divide fractions', 'simplify fractions'],
    faqs: [
      {
        question: 'How do you add fractions with different denominators?',
        answer: 'To add fractions with different denominators, find the Least Common Multiple (LCM) of the denominators, convert each fraction to an equivalent fraction with that LCM as the denominator, then add the numerators. For example, 1/2 + 1/3: LCM of 2 and 3 is 6, so 3/6 + 2/6 = 5/6.',
      },
      {
        question: 'How do you multiply fractions?',
        answer: 'To multiply fractions, multiply the numerators together and multiply the denominators together. For example, 2/3 x 3/4 = (2x3)/(3x4) = 6/12 = 1/2 after simplification. You can also simplify before multiplying by canceling common factors diagonally.',
      },
      {
        question: 'How do you divide fractions?',
        answer: 'To divide fractions, multiply the first fraction by the reciprocal (flip) of the second fraction. For example, 2/3 / 4/5 = 2/3 x 5/4 = 10/12 = 5/6. The phrase "keep, change, flip" is a common memory aid: keep the first fraction, change division to multiplication, flip the second fraction.',
      },
      {
        question: 'How do you simplify a fraction?',
        answer: 'To simplify a fraction, find the Greatest Common Divisor (GCD) of the numerator and denominator, then divide both by that number. For example, to simplify 12/18: GCD(12, 18) = 6, so 12/6 = 2 and 18/6 = 3, giving 2/3. A fraction is fully simplified when the GCD of numerator and denominator is 1.',
      },
      {
        question: 'What is a mixed number?',
        answer: 'A mixed number combines a whole number and a proper fraction, such as 2 1/2 (two and one half). To convert an improper fraction to a mixed number, divide the numerator by the denominator -- the quotient is the whole number and the remainder becomes the new numerator. For example, 7/3 = 2 remainder 1 = 2 1/3.',
      },
    ],
  },
  {
    slug: 'exponent',
    title: 'Square Root & Exponent Calculator',
    description: 'Calculate powers, square roots, nth roots, logarithms, and scientific notation. Includes step-by-step solutions for every calculation.',
    category: 'math',
    icon: 'Superscript',
    color: 'bg-violet-50 text-violet-700',
    keywords: ['square root calculator', 'exponent calculator', 'power calculator', 'nth root', 'logarithm calculator', 'scientific notation'],
    faqs: [
      {
        question: 'What is a square root?',
        answer: 'The square root of a number n is the value that, when multiplied by itself, gives n. For example, the square root of 25 is 5 because 5 x 5 = 25. The square root symbol is sqrt. Every positive number has two square roots: a positive and a negative one (e.g., both 5 and -5 are square roots of 25), but by convention the principal (positive) root is used.',
      },
      {
        question: 'What is the difference between a square root and a cube root?',
        answer: 'A square root finds the number that multiplied by itself equals the original (2nd root). A cube root finds the number that multiplied by itself three times equals the original (3rd root). For example, the cube root of 27 is 3 because 3 x 3 x 3 = 27. The nth root generalizes this to any index n.',
      },
      {
        question: 'What does a negative exponent mean?',
        answer: 'A negative exponent means the reciprocal of the positive exponent. For example, 2^(-3) = 1/(2^3) = 1/8 = 0.125. In general, x^(-n) = 1/x^n. Negative exponents are commonly used in scientific notation for very small numbers, such as 1 x 10^(-9) for one nanometer.',
      },
      {
        question: 'What is the difference between log and ln?',
        answer: 'log (common logarithm) uses base 10, so log(1000) = 3 because 10^3 = 1000. ln (natural logarithm) uses base e (approximately 2.71828), so ln(e) = 1. Natural logarithms appear frequently in calculus, physics, and finance (compound interest formulas). Common logarithms are used in pH, decibels, and the Richter scale.',
      },
    ],
  },
];

// Merge SEO content into calculators
function mergeContent(calcs: Calculator[]): Calculator[] {
  return calcs.map((c) => {
    const content = CALCULATOR_CONTENT[c.slug];
    if (!content) return c;
    return { ...c, explanation: content.explanation, howTo: content.howTo };
  });
}

const ENRICHED_CALCULATORS = mergeContent(CALCULATORS);

export function getCalculatorBySlug(slug: string): Calculator | undefined {
  return ENRICHED_CALCULATORS.find((c) => c.slug === slug);
}

export function getCalculatorsByCategory(category: Category): Calculator[] {
  return CALCULATORS.filter((c) => c.category === category);
}

export function getAllCategories(): Category[] {
  return ['financial', 'health', 'math', 'tools'];
}
