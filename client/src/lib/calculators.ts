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
    slug: 'sba-7a-loan',
    title: 'SBA 7(a) Loan Calculator',
    description: 'Calculate SBA 7(a) loan payments with current prevailing interest rates, guarantee fees, and full amortization schedule.',
    category: 'financial',
    icon: 'Landmark',
    color: 'bg-emerald-50 text-emerald-700',
    keywords: ['SBA 7a loan calculator', 'SBA loan payment', 'small business loan calculator', 'SBA guarantee fee', 'SBA interest rate'],
    faqs: [
      {
        question: 'What is the current SBA 7(a) interest rate?',
        answer: 'SBA 7(a) loan interest rates are based on the prime rate (currently 6.75% as of March 2026) plus a spread. For loans over $350,000, the maximum variable rate is prime + 3% (9.75%). For loans under $50,000, the maximum is prime + 6.5% (13.25%). Fixed rate maximums range from 11.75% to 14.75% depending on loan size.',
      },
      {
        question: 'What is the SBA guarantee fee?',
        answer: 'The SBA guarantee fee (also called the upfront fee) is charged on the guaranteed portion of the loan. For FY2026, loans over 12 months are charged 2% (loans ≤$150K), 3% ($150K–$700K), or 3.5%–3.75% (over $700K) of the guaranteed portion. Short-term loans (≤12 months) are charged just 0.25%.',
      },
      {
        question: 'What are the maximum loan terms for SBA 7(a) loans?',
        answer: 'SBA 7(a) loan terms depend on use: working capital loans are typically 5–7 years, equipment loans up to 10 years, and real estate loans up to 25 years. The maximum loan amount is $5 million.',
      },
      {
        question: 'What other fees are associated with SBA 7(a) loans?',
        answer: 'In addition to the SBA guarantee fee, borrowers typically pay packaging and closing costs of $2,000–$5,000 (legal fees, appraisals, lender processing). Lenders also pay an annual service fee of 0.55% of the outstanding guaranteed balance, but this is a lender cost and cannot be passed to the borrower.',
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
  // -- PHASE 14: HIGH-VALUE CALCULATORS (VA Loan, Credit Card Payoff, Savings Goal) ---
  {
    slug: 'va-loan',
    title: 'VA Loan Calculator',
    description: 'Calculate VA home loan payments, funding fees, and affordability. Designed for veterans, active-duty service members, and surviving spouses.',
    category: 'financial',
    icon: 'Shield',
    color: 'bg-blue-50 text-blue-700',
    keywords: ['VA loan calculator', 'VA home loan', 'veteran mortgage calculator', 'VA funding fee', 'military home loan', 'VA loan payment'],
    faqs: [
      { question: 'What is a VA loan?', answer: 'A VA loan is a mortgage loan guaranteed by the U.S. Department of Veterans Affairs. It is available to eligible veterans, active-duty service members, National Guard members, reservists, and surviving spouses. VA loans typically offer no down payment, no private mortgage insurance (PMI), and competitive interest rates.' },
      { question: 'What is the VA funding fee?', answer: 'The VA funding fee is a one-time fee paid to the VA to help sustain the loan program. For first-time use with no down payment, the fee is 2.15% of the loan amount for regular military and 2.4% for Reserves/National Guard. The fee is lower with a down payment and for subsequent use. Veterans with a service-connected disability rating of 10% or more are exempt from the funding fee.' },
      { question: 'Do VA loans require a down payment?', answer: 'No down payment is required for VA loans up to the conforming loan limit ($766,550 in most areas for 2024). For loans above this limit, a down payment may be required. While not required, making a down payment reduces your monthly payment and can lower or eliminate the funding fee.' },
      { question: 'What is the maximum VA loan amount?', answer: 'There is no maximum VA loan amount for eligible borrowers with full entitlement. However, lenders will still evaluate your ability to repay based on income, credit, and debt-to-income ratio. The conforming loan limit ($766,550 in most counties) determines when a down payment may be needed.' },
      { question: 'How do VA loan rates compare to conventional loans?', answer: 'VA loan interest rates are typically 0.25% to 0.5% lower than conventional loan rates because the VA guarantee reduces lender risk. Combined with no PMI requirement, VA loans often have significantly lower total monthly costs than conventional loans with less than 20% down.' },
    ],
  },
  {
    slug: 'credit-card-payoff',
    title: 'Credit Card Payoff Calculator',
    description: 'Calculate how long it will take to pay off your credit card debt and how much interest you will pay. Compare fixed payment vs. payoff date strategies.',
    category: 'financial',
    icon: 'CreditCard',
    color: 'bg-red-50 text-red-700',
    keywords: ['credit card payoff calculator', 'credit card debt calculator', 'pay off credit card', 'credit card interest calculator', 'minimum payment calculator', 'debt payoff'],
    faqs: [
      { question: 'How long does it take to pay off a credit card with minimum payments?', answer: 'Paying only the minimum payment (typically 1-3% of the balance) can take decades to pay off a credit card. For example, a $5,000 balance at 20% APR with a 2% minimum payment would take over 30 years and cost more than $8,000 in interest. Paying even a fixed amount above the minimum dramatically reduces payoff time.' },
      { question: 'What is the avalanche vs. snowball method for credit card debt?', answer: 'The avalanche method pays off the highest-interest card first, minimizing total interest paid. The snowball method pays off the smallest balance first, providing psychological wins. Mathematically, the avalanche method saves more money, but the snowball method can be more motivating for some people. Either method beats paying minimums only.' },
      { question: 'How is credit card interest calculated?', answer: 'Credit card interest is calculated daily using your Annual Percentage Rate (APR) divided by 365. Each day, your balance is multiplied by the daily rate. Interest is then added to your balance at the end of each billing cycle. This is why carrying a balance from month to month is so costly -- you pay interest on interest.' },
      { question: 'What is a good credit card APR?', answer: 'As of 2024, the average credit card APR is around 20-21%. Cards for excellent credit (750+) may offer 15-18% APR. Rewards cards typically have higher rates (20-25%). Store cards often have the highest rates (25-30%). If you carry a balance, APR is critical -- a 0% intro APR balance transfer card can save significant money while paying down debt.' },
    ],
  },
  {
    slug: 'savings-goal',
    title: 'Savings Goal Calculator',
    description: 'Calculate how long it will take to reach your savings goal, or how much you need to save each month to hit a target by a specific date.',
    category: 'financial',
    icon: 'PiggyBank',
    color: 'bg-green-50 text-green-700',
    keywords: ['savings goal calculator', 'savings calculator', 'how long to save', 'monthly savings calculator', 'savings target calculator', 'emergency fund calculator'],
    faqs: [
      { question: 'How much should I have in an emergency fund?', answer: 'Financial experts recommend saving 3-6 months of essential living expenses in an emergency fund. If you have variable income, are self-employed, or have dependents, aim for 6-12 months. Keep your emergency fund in a high-yield savings account (HYSA) where it earns interest but remains accessible.' },
      { question: 'What is compound interest and how does it help savings?', answer: 'Compound interest means you earn interest on your interest, not just your principal. For example, $10,000 at 5% annual interest earns $500 in year 1, but in year 2 you earn 5% on $10,500 = $525. Over time, this compounding effect dramatically accelerates growth. The earlier you start saving, the more powerful compounding becomes.' },
      { question: 'What is a high-yield savings account (HYSA)?', answer: 'A high-yield savings account offers significantly higher interest rates than traditional savings accounts. As of 2024, top HYSAs offer 4-5% APY versus the national average of 0.46% for traditional savings. Online banks typically offer the best rates because they have lower overhead costs. HYSAs are FDIC-insured up to $250,000.' },
      { question: 'How much should I save each month?', answer: 'The 50/30/20 rule suggests allocating 20% of after-tax income to savings and debt repayment. For a $5,000/month take-home, that is $1,000 toward savings. However, the right amount depends on your goals, debt, and timeline. Start with whatever you can consistently save, then increase it over time as income grows or expenses decrease.' },
    ],
  },
  // -- PHASE 6: TOOLS SECTION EXPANSION ---------------------------------------
  {
    slug: 'random-number',
    title: 'Random Number Generator',
    description: 'Generate random numbers, roll dice, flip coins, and pick random items from a list. Supports ranges, multiple numbers, and no-duplicate mode.',
    category: 'tools',
    icon: 'Shuffle',
    color: 'bg-orange-50 text-orange-700',
    keywords: ['random number generator', 'random number', 'dice roller', 'coin flip', 'random picker', 'lottery number generator'],
    faqs: [
      {
        question: 'How does a random number generator work?',
        answer: 'A computer random number generator (RNG) uses a mathematical algorithm called a pseudorandom number generator (PRNG) to produce sequences of numbers that appear random. Most use the current time as a "seed" value. While not truly random (like radioactive decay), PRNGs are statistically random enough for games, simulations, and everyday use.',
      },
      {
        question: 'Can I use this to pick lottery numbers?',
        answer: 'Yes. Set your minimum to 1, maximum to the highest number in your lottery (e.g., 69 for Powerball), generate 5 or 6 unique numbers, and you have a random lottery selection. Remember that all combinations have exactly equal odds -- there is no strategy that improves your chances.',
      },
      {
        question: 'What is the difference between random and unique random numbers?',
        answer: 'Standard random numbers can repeat (like rolling a die twice and getting 4 both times). Unique random numbers (no duplicates) are like drawing cards from a shuffled deck -- once a number is picked, it cannot appear again. Use unique mode when you need a random ordering or selection without repetition.',
      },
      {
        question: 'What are the odds of rolling a specific number on a die?',
        answer: 'For a fair d6 (six-sided die), each face has a 1/6 (about 16.7%) chance. For a d20, each face has a 1/20 (5%) chance. For two d6 dice, the most likely total is 7 (probability 6/36 = 16.7%), and the least likely totals are 2 and 12 (probability 1/36 = 2.8% each).',
      },
    ],
  },
  {
    slug: 'password-generator',
    title: 'Password Generator',
    description: 'Generate strong, secure passwords with customizable length, character types, and strength meter. Includes entropy calculation and one-click copy.',
    category: 'tools',
    icon: 'Lock',
    color: 'bg-orange-50 text-orange-700',
    keywords: ['password generator', 'strong password', 'random password', 'secure password generator', 'password strength', 'password creator'],
    faqs: [
      {
        question: 'How long should a password be?',
        answer: 'Security experts recommend at least 12 characters for most accounts and 16+ for sensitive accounts like banking or email. A 12-character password with mixed case, numbers, and symbols has roughly 72 bits of entropy, which would take billions of years to brute-force with current technology.',
      },
      {
        question: 'What is password entropy?',
        answer: 'Entropy measures how unpredictable a password is, expressed in bits. It is calculated as: length x log2(pool size). A pool of 94 printable ASCII characters gives log2(94) = 6.55 bits per character. A 16-character password from this pool has about 105 bits of entropy -- considered very strong. Each additional bit doubles the difficulty of cracking.',
      },
      {
        question: 'Should I use special characters in passwords?',
        answer: 'Yes, when the site allows it. Adding symbols expands the character pool from 62 (letters + digits) to 94+ characters, significantly increasing entropy. However, some sites restrict special characters. If symbols are not allowed, compensate by using a longer password (20+ characters).',
      },
      {
        question: 'Is it safe to use an online password generator?',
        answer: 'This generator runs entirely in your browser using JavaScript -- no passwords are ever sent to a server or stored anywhere. You can verify this by disconnecting from the internet and the generator will still work. For maximum security, use a reputable password manager that generates and stores passwords locally.',
      },
      {
        question: 'What makes a password weak?',
        answer: 'Weak passwords include dictionary words, names, dates, keyboard patterns (qwerty, 123456), and anything under 8 characters. The most commonly used passwords in data breaches are "123456", "password", "123456789", and "qwerty". Using any of these is equivalent to having no password at all.',
      },
    ],
  },
  // -- PHASE 7: TOOLS SECTION EXPANSION II ------------------------------------
  {
    slug: 'timezone',
    title: 'Time Zone Converter',
    description: 'Convert time between 45+ world time zones instantly. Select multiple target zones to compare times side by side for meetings, travel, and remote work.',
    category: 'tools',
    icon: 'Globe',
    color: 'bg-orange-50 text-orange-700',
    keywords: ['time zone converter', 'time zone calculator', 'world clock', 'convert time zones', 'meeting time planner', 'international time converter'],
    faqs: [
      {
        question: 'What is a time zone?',
        answer: 'A time zone is a region of the globe that observes a uniform standard time for legal, commercial, and social purposes. Time zones tend to follow the boundaries of countries and their subdivisions. UTC (Coordinated Universal Time) is the primary time standard by which the world regulates clocks and time, and all other zones are expressed as offsets from UTC.',
      },
      {
        question: 'What is the difference between UTC and GMT?',
        answer: 'UTC and GMT are often used interchangeably, but they are technically different. GMT (Greenwich Mean Time) is a time zone, while UTC is a time standard. For everyday purposes, UTC+0 and GMT are the same offset. The key difference is that UTC is based on atomic clocks and never has leap seconds added, while GMT is based on Earth rotation.',
      },
      {
        question: 'What is Daylight Saving Time (DST)?',
        answer: 'Daylight Saving Time is the practice of advancing clocks by one hour during summer months so that darkness falls later each day. Not all countries observe DST. The US and most of Europe do, but countries near the equator typically do not. This is why EST (UTC-5) becomes EDT (UTC-4) in summer, and CET (UTC+1) becomes CEST (UTC+2).',
      },
      {
        question: 'How do I schedule a meeting across time zones?',
        answer: 'Enter your local date and time, select your time zone as the source, then add all participant time zones as targets. The converter will show the equivalent time for each zone simultaneously. Aim for overlap during standard business hours (9am-5pm) in all locations. Tools like this are essential for teams spanning the Americas, Europe, and Asia.',
      },
    ],
  },
  {
    slug: 'word-counter',
    title: 'Word Counter',
    description: 'Count words, characters, sentences, paragraphs, and lines. Estimates reading time, speaking time, readability score, and shows top keywords.',
    category: 'tools',
    icon: 'FileText',
    color: 'bg-orange-50 text-orange-700',
    keywords: ['word counter', 'character counter', 'word count', 'character count', 'reading time calculator', 'word frequency counter'],
    faqs: [
      {
        question: 'How is reading time calculated?',
        answer: 'Reading time is estimated using the average adult silent reading speed of 238 words per minute (wpm), based on research by Brysbaert et al. (2019). Speaking time uses 130 wpm, the average conversational speaking pace. These are averages -- actual reading speed varies by text complexity, familiarity with the subject, and individual ability.',
      },
      {
        question: 'What is the Flesch Reading Ease score?',
        answer: 'The Flesch Reading Ease score (0-100) measures how easy a text is to read. Higher scores mean easier reading. Scores above 70 are considered easy (suitable for general audiences), 60-70 is standard (8th-9th grade), 30-60 is difficult (college level), and below 30 is very difficult (professional/academic). It is calculated using average sentence length and average syllables per word.',
      },
      {
        question: 'How many words is a typical essay or article?',
        answer: 'Common word count benchmarks: tweet (280 characters), text message (7-15 words), paragraph (100-200 words), blog post (1,000-2,000 words), short story (1,000-7,500 words), novella (17,500-40,000 words), novel (80,000-100,000 words). Academic papers typically range from 3,000 words (conference paper) to 10,000+ words (journal article).',
      },
      {
        question: 'What counts as a word?',
        answer: 'In most word counters, a word is any sequence of characters separated by whitespace (spaces, tabs, line breaks). Hyphenated words like "well-known" are typically counted as one word. Numbers, abbreviations, and contractions each count as one word. This calculator splits on whitespace, which is the standard approach used by Microsoft Word and Google Docs.',
      },
    ],
  },
  // -- PHASE 8: MATH CONVERTERS -----------------------------------------------
  {
    slug: 'scientific-notation',
    title: 'Scientific Notation Converter',
    description: 'Convert numbers to and from scientific notation and engineering notation. Supports very large and very small numbers with step-by-step explanations and SI prefix reference.',
    category: 'math',
    icon: 'Atom',
    color: 'bg-violet-50 text-violet-700',
    keywords: ['scientific notation converter', 'scientific notation calculator', 'engineering notation', 'convert to scientific notation', 'standard form calculator', 'powers of 10'],
    faqs: [
      {
        question: 'What is scientific notation?',
        answer: 'Scientific notation is a way of expressing very large or very small numbers in the form a x 10^n, where 1 <= |a| < 10 and n is an integer. For example, 299,792,458 (speed of light in m/s) is written as 2.998 x 10^8. It is used in science, engineering, and mathematics to make calculations with extreme values more manageable.',
      },
      {
        question: 'What is the difference between scientific and engineering notation?',
        answer: 'In scientific notation, the exponent can be any integer and the coefficient is between 1 and 10. In engineering notation, the exponent is always a multiple of 3 (0, 3, 6, 9, -3, -6, etc.), which aligns with SI prefixes like kilo (10^3), mega (10^6), milli (10^-3), and micro (10^-6). Engineering notation is preferred in electronics and practical engineering.',
      },
      {
        question: 'How do I convert a number to scientific notation?',
        answer: 'Move the decimal point until there is exactly one non-zero digit to the left of the decimal. Count the number of places you moved the decimal -- this is the exponent. If you moved left, the exponent is positive; if you moved right, it is negative. Example: 0.0000045 = 4.5 x 10^-6 (moved 6 places right).',
      },
      {
        question: 'What are SI prefixes and how do they relate to powers of 10?',
        answer: 'SI prefixes are standardized multipliers used in the metric system. Key prefixes: nano (10^-9), micro (10^-6), milli (10^-3), kilo (10^3), mega (10^6), giga (10^9), tera (10^12). These align with engineering notation exponents, making it easy to express measurements like 1.5 GHz (1.5 x 10^9 Hz) or 47 nF (47 x 10^-9 F).',
      },
    ],
  },
  {
    slug: 'roman-numerals',
    title: 'Roman Numeral Converter',
    description: 'Convert between Roman numerals and standard numbers instantly. Supports 1 to 3,999 with a full step-by-step breakdown and clickable reference table.',
    category: 'math',
    icon: 'BookOpen',
    color: 'bg-violet-50 text-violet-700',
    keywords: ['roman numeral converter', 'roman numeral calculator', 'convert roman numerals', 'roman numerals to numbers', 'numbers to roman numerals', 'what is MCMXCIX'],
    faqs: [
      {
        question: 'What are Roman numerals?',
        answer: 'Roman numerals are a numeral system originating in ancient Rome that uses letters from the Latin alphabet (I, V, X, L, C, D, M) to represent numbers. They were the standard writing system for numbers in Europe throughout the Middle Ages and are still used today for clock faces, book chapters, movie sequels, Super Bowl numbering, and year designations.',
      },
      {
        question: 'What are the basic Roman numeral values?',
        answer: 'The seven basic symbols are: I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. Numbers are formed by combining these symbols: larger values are added (VIII = 8), but when a smaller value precedes a larger one, it is subtracted (IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900).',
      },
      {
        question: 'What is the largest number in Roman numerals?',
        answer: 'The standard Roman numeral system goes up to 3,999 (MMMCMXCIX). Numbers above 3,999 traditionally used a bar over a numeral to multiply it by 1,000, but this is rarely used in modern contexts. Most practical uses of Roman numerals stay well within the 1-3,999 range.',
      },
      {
        question: 'Why are Roman numerals still used today?',
        answer: 'Roman numerals persist in modern life for several reasons: they look formal and timeless (used on clock faces, monuments, and official documents), they distinguish sequels and editions from their predecessors (Super Bowl LVIII, Rocky II), they are used in outlines and lists to avoid confusion with Arabic numerals, and they appear in copyright years on films and TV shows.',
      },
    ],
  },
  // -- PHASE 5: DATE CALCULATOR --------------------------------------------------
  {
    slug: 'date',
    title: 'Date Calculator',
    description: 'Calculate the number of days between two dates, add or subtract days from any date, and find out what day of the week any date falls on.',
    category: 'math',
    icon: 'Calendar',
    color: 'bg-violet-50 text-violet-700',
    keywords: ['date calculator', 'days between dates', 'add days to date', 'day of the week', 'how many days until', 'date difference calculator'],
    faqs: [
      {
        question: 'How do I calculate the number of days between two dates?',
        answer: 'To find the number of days between two dates, subtract the earlier date from the later date. Each day is 86,400 seconds (24 hours x 60 minutes x 60 seconds). Our calculator also breaks the difference into years, months, and days, and counts weekdays versus weekend days separately.',
      },
      {
        question: 'How do I add or subtract days from a date?',
        answer: 'To add days to a date, simply count forward on the calendar. For large numbers, convert to weeks first (divide by 7), then add the remaining days. For example, 100 days from January 1 = 14 weeks and 2 days = April 11 (in a non-leap year). Our calculator handles all the month-length and leap-year complexity automatically.',
      },
      {
        question: 'What day of the week was I born?',
        answer: 'Enter your birth date in the Day of the Week tab to instantly see what day you were born on. This uses the Zeller formula or similar algorithm to compute the day of the week for any Gregorian calendar date.',
      },
      {
        question: 'What is a leap year and how does it affect date calculations?',
        answer: 'A leap year has 366 days instead of 365, with February 29 added. A year is a leap year if it is divisible by 4, except for century years (divisible by 100), which must also be divisible by 400. For example, 2000 was a leap year but 1900 was not. Leap years affect date calculations when the span crosses February 29.',
      },
      {
        question: 'How many days are in each month?',
        answer: 'January (31), February (28 or 29 in a leap year), March (31), April (30), May (31), June (30), July (31), August (31), September (30), October (31), November (30), December (31). A common memory aid: knuckles are 31-day months, valleys are 30-day months (or February).',
      },
    ],
  },
  // -- PHASE 9: DESIGN & DEVELOPER TOOLS -----------------------------------------
  {
    slug: 'color',
    title: 'Color Converter',
    description: 'Convert colors between HEX, RGB, HSL, and CMYK formats instantly. Includes a live color preview, WCAG accessibility contrast checker, and one-click copy for each format.',
    category: 'tools',
    icon: 'Palette',
    color: 'bg-orange-50 text-orange-700',
    keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'hsl to rgb', 'cmyk converter', 'color code converter', 'hex color picker', 'web color converter'],
    faqs: [
      {
        question: 'What is the difference between HEX, RGB, HSL, and CMYK?',
        answer: 'HEX is a 6-digit hexadecimal code used in web development (e.g., #FF5733). RGB defines colors by Red, Green, Blue light values (0-255 each), used in screens. HSL uses Hue (0-360 degrees), Saturation (0-100%), and Lightness (0-100%), which is more intuitive for designers. CMYK (Cyan, Magenta, Yellow, Black) is used in print design and represents ink percentages.',
      },
      {
        question: 'When should I use HEX vs RGB in web development?',
        answer: 'HEX is the most common format in CSS for static colors (e.g., color: #FF5733). RGB and RGBA are preferred when you need transparency (e.g., rgba(255, 87, 51, 0.5)) or when calculating colors dynamically in JavaScript. HSL is increasingly popular in modern CSS because it is easier to adjust brightness and saturation programmatically.',
      },
      {
        question: 'What is WCAG color contrast and why does it matter?',
        answer: 'WCAG (Web Content Accessibility Guidelines) defines minimum contrast ratios between text and background colors to ensure readability for people with visual impairments. A ratio of 4.5:1 is required for normal text (AA standard), and 7:1 for enhanced accessibility (AAA). Failing contrast requirements can make your website inaccessible and may violate accessibility laws in many countries.',
      },
      {
        question: 'Why does my CMYK color look different when printed?',
        answer: 'RGB colors are created by combining light (additive color model), while CMYK colors are created by mixing inks (subtractive color model). Not all RGB colors can be reproduced in CMYK -- highly saturated or neon colors often appear duller in print. This is called being outside the CMYK gamut. Professional printers use color profiles (ICC profiles) to manage this conversion.',
      },
    ],
  },
  {
    slug: 'number-base',
    title: 'Number Base Converter',
    description: 'Convert numbers between binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16). Includes a bit-length compatibility checker and clickable reference table.',
    category: 'math',
    icon: 'Binary',
    color: 'bg-violet-50 text-violet-700',
    keywords: ['number base converter', 'binary to decimal', 'decimal to binary', 'hex to binary', 'binary converter', 'hexadecimal converter', 'octal converter', 'base conversion calculator'],
    faqs: [
      {
        question: 'Why do computers use binary?',
        answer: 'Computers use binary (base 2) because transistors -- the fundamental building blocks of processors -- have two states: on (1) and off (0). This makes binary the natural language of digital electronics. All data in a computer, including text, images, and programs, is ultimately stored and processed as sequences of 1s and 0s.',
      },
      {
        question: 'What is hexadecimal used for in computing?',
        answer: 'Hexadecimal (base 16) is used as a human-readable shorthand for binary. Since each hex digit represents exactly 4 binary bits (a nibble), it is much more compact. Common uses include: memory addresses (0x7FFF0000), color codes in web design (#FF5733), error codes, and machine code representation. Two hex digits represent one byte (8 bits).',
      },
      {
        question: 'How do I convert binary to decimal?',
        answer: 'Multiply each binary digit by 2 raised to its position power (starting from 0 on the right), then add all results. Example: 1011 in binary = (1x2^3) + (0x2^2) + (1x2^1) + (1x2^0) = 8 + 0 + 2 + 1 = 11 in decimal. This calculator does this automatically, but understanding the method helps with programming and computer science courses.',
      },
      {
        question: 'What is the difference between 8-bit, 16-bit, 32-bit, and 64-bit numbers?',
        answer: 'These refer to the maximum number of bits used to store an integer. An 8-bit number can store values from 0 to 255 (2^8 - 1). A 16-bit number stores 0 to 65,535. A 32-bit number stores 0 to 4,294,967,295. A 64-bit number stores up to 18.4 quintillion. In programming, choosing the right bit size matters for memory efficiency and preventing integer overflow errors.',
      },
    ],
  },
  {
    slug: 'temperature',
    title: 'Temperature Converter',
    description: 'Convert between Celsius, Fahrenheit, Kelvin, Rankine, and more. Includes common reference points and quick presets.',
    icon: 'Thermometer',
    category: 'tools',
    keywords: ['temperature converter', 'celsius to fahrenheit', 'fahrenheit to celsius', 'kelvin converter', 'c to f', 'f to c'],
    color: 'bg-orange-100 text-orange-600',
    explanation: [
      'Temperature is a measure of thermal energy. Different scales are used around the world and in science. Celsius (C) is used in most countries for everyday temperature. Fahrenheit (F) is used primarily in the United States. Kelvin (K) is the SI base unit used in science and engineering.',
      'The Celsius scale is based on water: 0 C is the freezing point and 100 C is the boiling point at sea level. Fahrenheit sets these at 32 F and 212 F respectively. Kelvin starts at absolute zero (-273.15 C), the theoretical lowest possible temperature.',
    ],
    howTo: {
      intro: 'Enter a temperature value, select your starting unit, and instantly see conversions to all other scales.',
      steps: [
        { title: 'Enter a value', text: 'Type the temperature number in the input field.' },
        { title: 'Select the source unit', text: 'Choose Celsius, Fahrenheit, or Kelvin from the dropdown.' },
        { title: 'Read the results', text: 'All conversions update instantly. Click a reference row to load that temperature.' },
      ],
    },
    faqs: [
      { question: 'What is the formula to convert Celsius to Fahrenheit?', answer: 'Multiply by 9/5 then add 32. Example: 100 C x (9/5) + 32 = 212 F. To go the other direction, subtract 32 then multiply by 5/9.' },
      { question: 'What is absolute zero?', answer: 'Absolute zero is 0 Kelvin, -273.15 Celsius, or -459.67 Fahrenheit. It is the theoretical lowest possible temperature where all molecular motion stops. It has never been achieved in practice, only approached.' },
      { question: 'What temperature is the same in Celsius and Fahrenheit?', answer: '-40 degrees is the same in both Celsius and Fahrenheit. This is the only point where the two scales intersect.' },
    ],
  },
  {
    slug: 'speed',
    title: 'Speed Converter',
    description: 'Convert between mph, km/h, m/s, knots, Mach, and the speed of light. Includes common speed reference points.',
    icon: 'Gauge',
    category: 'tools',
    keywords: ['speed converter', 'mph to kph', 'kph to mph', 'knots to mph', 'mach to mph', 'meters per second'],
    color: 'bg-blue-100 text-blue-600',
    explanation: [
      'Speed is the rate at which an object covers distance over time. Different fields use different units: miles per hour (mph) is standard in the US for road travel, kilometers per hour (km/h) is used in most other countries, knots are used in aviation and maritime navigation, and meters per second (m/s) is the SI unit used in science.',
      'Mach number represents speed relative to the speed of sound (approximately 340 m/s at sea level). Mach 1 is the speed of sound, Mach 2 is twice the speed of sound, and so on. The speed of light (c) is approximately 299,792,458 m/s in a vacuum.',
    ],
    howTo: {
      intro: 'Enter a speed value, select your unit, and see instant conversions across all speed units.',
      steps: [
        { title: 'Enter a speed', text: 'Type the speed value in the input field.' },
        { title: 'Select the unit', text: 'Choose from mph, km/h, m/s, knots, Mach, or speed of light.' },
        { title: 'Read conversions', text: 'All units update instantly. Use quick presets for common reference speeds.' },
      ],
    },
    faqs: [
      { question: 'How do I convert mph to km/h?', answer: 'Multiply mph by 1.60934. For example, 60 mph x 1.60934 = 96.56 km/h. To convert km/h to mph, divide by 1.60934 (or multiply by 0.621371).' },
      { question: 'What is a knot?', answer: "A knot is one nautical mile per hour. One nautical mile equals 1.852 km or 1.15078 miles. Knots are the standard unit for speed in aviation and maritime navigation because nautical miles are based on the Earth's circumference, making navigation calculations simpler." },
      { question: 'What is Mach 1?', answer: 'Mach 1 is the speed of sound, approximately 343 m/s (767 mph or 1,235 km/h) at sea level at 20 C. The exact speed varies with air temperature, pressure, and altitude. At 30,000 feet where commercial jets cruise, the speed of sound is closer to 295 m/s due to colder temperatures.' },
    ],
  },
  {
    slug: 'pace',
    title: 'Pace Calculator',
    description: 'Calculate running pace, finish time, or distance. Includes race projections for 5K, 10K, half marathon, and marathon.',
    icon: 'Timer',
    category: 'health',
    keywords: ['pace calculator', 'running pace', 'min per mile', 'marathon pace', '5k pace', 'half marathon pace', 'running time calculator'],
    color: 'bg-green-100 text-green-600',
    explanation: [
      'Running pace is typically expressed as minutes per mile (min/mi) or minutes per kilometer (min/km). It describes how long it takes to cover one unit of distance. Pace is the inverse of speed -- a faster runner has a lower pace number (e.g., 7:00/mi is faster than 10:00/mi).',
      'This calculator can find any one of three values when you know the other two: pace, total time, or distance. It also projects finish times for common race distances based on your current pace, assuming you maintain the same effort throughout.',
    ],
    howTo: {
      intro: 'Select what you want to calculate, enter the two known values, and the third is calculated automatically.',
      steps: [
        { title: 'Choose your goal', text: 'Select Find Pace, Find Time, or Find Distance from the tabs.' },
        { title: 'Enter the known values', text: 'Fill in the two fields that are not grayed out.' },
        { title: 'Read the results', text: 'Your result appears instantly along with race finish time projections.' },
      ],
    },
    faqs: [
      { question: 'What is a good running pace?', answer: 'Average recreational runners finish a 5K in 30-40 minutes (about 9:40-12:52 per mile). A good pace for a beginner is anything under 15 min/mile. Competitive amateur runners typically run 7-9 min/mile. Elite marathon runners maintain under 5 min/mile for 26.2 miles.' },
      { question: 'How do I calculate my pace?', answer: 'Divide your total time (in seconds) by your distance (in miles or km). For example, if you ran 3 miles in 30 minutes (1800 seconds): 1800 / 3 = 600 seconds per mile = 10:00 min/mile.' },
      { question: 'What is negative splitting?', answer: 'Negative splitting means running the second half of a race faster than the first half. It is considered the optimal race strategy because it prevents early fatigue and allows you to finish strong. Most world records are set with negative or even splits.' },
    ],
  },
  {
    slug: 'net-worth',
    title: 'Net Worth Calculator',
    description: 'Calculate your total net worth by entering your assets and liabilities. Includes debt-to-asset ratio and financial health indicators.',
    icon: 'TrendingUp',
    category: 'financial',
    keywords: ['net worth calculator', 'calculate net worth', 'assets liabilities', 'personal net worth', 'financial net worth'],
    color: 'bg-emerald-100 text-emerald-600',
    explanation: [
      'Net worth is the total value of everything you own (assets) minus everything you owe (liabilities). It is the most comprehensive single measure of your financial health. A positive net worth means your assets exceed your debts; a negative net worth means you owe more than you own.',
      'Assets include cash, investments, retirement accounts, real estate, vehicles, and other valuables. Liabilities include mortgages, car loans, student loans, credit card balances, and any other debts. Tracking your net worth over time is one of the best ways to measure financial progress.',
    ],
    howTo: {
      intro: 'Enter the current values of your assets and liabilities. Your net worth updates automatically as you type.',
      steps: [
        { title: 'Enter your assets', text: 'Add the current value of each asset: bank accounts, investments, home equity, vehicles, etc.' },
        { title: 'Enter your liabilities', text: 'Add the outstanding balance of each debt: mortgage, car loans, credit cards, student loans.' },
        { title: 'Review your net worth', text: 'Your total net worth and debt-to-asset ratio are calculated automatically.' },
      ],
    },
    faqs: [
      { question: 'What is a good net worth by age?', answer: 'According to the Federal Reserve, median net worth by age group in the US: under 35: $39,000; 35-44: $135,000; 45-54: $247,000; 55-64: $365,000; 65-74: $410,000. These are medians -- half of people in each group have more, half have less. The average (mean) is much higher due to wealthy outliers.' },
      { question: 'Should I include my home in net worth?', answer: "Yes, but use your home's current market value minus your outstanding mortgage balance (home equity). For example, if your home is worth $400,000 and you owe $280,000, your home equity is $120,000. This is the net contribution to your net worth." },
      { question: 'How often should I calculate my net worth?', answer: 'Most financial advisors recommend calculating net worth quarterly or annually. Monthly tracking can be useful when actively paying down debt or building savings, but daily fluctuations in investment values can be misleading. The trend over 1-3 years is more meaningful than any single snapshot.' },
    ],
  },

  // -- PHASE 11: HIGH-REVENUE EXPANSION ------------------------------------------
  {
    slug: 'sba-504-loan',
    title: 'SBA 504 Loan Calculator',
    description: 'Calculate SBA 504 loan payments with the standard 50/40/10 structure for commercial real estate and major equipment purchases.',
    category: 'financial',
    icon: 'Building2',
    color: 'bg-blue-50 text-blue-700',
    keywords: ['SBA 504 loan calculator', 'SBA 504 payment', 'commercial real estate loan', 'CDC loan', 'small business real estate loan', 'SBA 504 rates'],
    faqs: [
      { question: 'What is an SBA 504 loan?', answer: 'An SBA 504 loan is a long-term, fixed-rate financing program for owner-occupied commercial real estate and major equipment. It uses a 50/40/10 structure: 50% from a conventional bank, 40% from a Certified Development Company (CDC) backed by the SBA, and 10% equity from the borrower.' },
      { question: 'What are current SBA 504 rates?', answer: 'SBA 504 debenture rates are set monthly and are typically below conventional commercial loan rates. As of early 2026, 20-year rates are approximately 6.2% and 25-year rates are approximately 6.3%. The bank portion rate is negotiated separately and varies by lender.' },
      { question: 'What can SBA 504 loans be used for?', answer: 'SBA 504 loans can be used for purchasing owner-occupied commercial real estate, constructing or renovating facilities, purchasing long-term machinery and equipment with a useful life of 10+ years, and refinancing existing commercial real estate debt in some cases.' },
      { question: 'What are the SBA 504 loan limits?', answer: 'The maximum SBA CDC debenture is $5 million for most businesses, or $5.5 million for manufacturers and energy-efficient projects. There is no cap on the total project cost -- the bank portion can be any amount. The minimum project size is typically $125,000.' },
    ],
  },
  {
    slug: 'auto-loan',
    title: 'Auto Loan Calculator',
    description: 'Calculate your monthly car payment, total interest, and full amortization schedule. Includes sales tax, trade-in, and down payment.',
    category: 'financial',
    icon: 'Car',
    color: 'bg-emerald-50 text-emerald-700',
    keywords: ['auto loan calculator', 'car payment calculator', 'car loan calculator', 'monthly car payment', 'vehicle financing', 'car loan interest'],
    faqs: [
      { question: 'What is a good interest rate for a car loan?', answer: 'As of 2026, average auto loan rates are approximately 5-7% for new cars and 7-11% for used cars for borrowers with good credit (700+). Rates above 15% are considered high and typically apply to borrowers with poor credit. Credit unions often offer rates 1-2% lower than banks.' },
      { question: 'How much should I put down on a car?', answer: 'Financial advisors typically recommend a down payment of at least 20% for new cars and 10% for used cars. This reduces your monthly payment, lowers total interest paid, and helps avoid being "underwater" on the loan (owing more than the car is worth).' },
      { question: 'Should I choose a longer or shorter loan term?', answer: 'Shorter terms (36-48 months) mean higher monthly payments but significantly less total interest. Longer terms (72-84 months) lower monthly payments but cost more overall and increase the risk of negative equity as the car depreciates faster than you pay it off. Most financial experts recommend 48-60 months maximum.' },
      { question: 'What is a trade-in and how does it affect my loan?', answer: 'A trade-in is your current vehicle that the dealer accepts as partial payment toward your new car. The trade-in value is subtracted from the purchase price, reducing the amount you need to finance. Get an independent appraisal (Carmax, KBB) before visiting a dealer to ensure you get a fair trade-in value.' },
    ],
  },
  {
    slug: 'debt-payoff',
    title: 'Debt Payoff Calculator',
    description: 'Calculate how long it will take to pay off your debts using the avalanche (highest rate first) or snowball (lowest balance first) method.',
    category: 'financial',
    icon: 'TrendingDown',
    color: 'bg-red-50 text-red-700',
    keywords: ['debt payoff calculator', 'debt snowball calculator', 'debt avalanche calculator', 'pay off debt', 'credit card payoff', 'debt free calculator'],
    faqs: [
      { question: 'What is the debt avalanche method?', answer: 'The debt avalanche method involves paying minimums on all debts, then putting any extra money toward the debt with the highest interest rate. Once that is paid off, you roll that payment to the next highest rate. This method saves the most money in interest and is mathematically optimal.' },
      { question: 'What is the debt snowball method?', answer: 'The debt snowball method focuses on paying off the smallest balance first, regardless of interest rate. This provides quick psychological wins as debts are eliminated. Research shows many people are more successful with this method because the motivation from early wins helps them stay on track.' },
      { question: 'How much extra should I pay each month?', answer: 'Even small extra payments make a significant difference. An extra $100/month on a $10,000 credit card at 20% APR can cut payoff time from 10+ years to under 4 years and save thousands in interest. Use this calculator to see the exact impact of different extra payment amounts.' },
      { question: 'Should I pay off debt or invest?', answer: 'If your debt interest rate is higher than your expected investment return (typically 7-10% for stocks), pay off the debt first. High-interest debt (credit cards at 15-25%) should almost always be paid off before investing beyond any employer 401k match. Low-interest debt (mortgage at 3-4%) may be worth keeping while investing.' },
    ],
  },
  {
    slug: 'home-equity',
    title: 'Home Equity Loan Calculator',
    description: 'Calculate your home equity loan or HELOC payment, maximum borrowing amount, and combined loan-to-value ratio.',
    category: 'financial',
    icon: 'Home',
    color: 'bg-emerald-50 text-emerald-700',
    keywords: ['home equity loan calculator', 'HELOC calculator', 'home equity line of credit', 'second mortgage calculator', 'home equity payment'],
    faqs: [
      { question: 'What is the difference between a home equity loan and a HELOC?', answer: 'A home equity loan gives you a lump sum at a fixed interest rate, repaid over a set term (5-20 years). A HELOC is a revolving credit line with a variable rate -- you draw funds as needed during the draw period (typically 10 years) and repay during the repayment period. Home equity loans are better for one-time expenses; HELOCs work well for ongoing projects.' },
      { question: 'How much can I borrow with a home equity loan?', answer: 'Most lenders allow you to borrow up to 80-85% of your home value minus your existing mortgage balance. For example, if your home is worth $400,000 and you owe $250,000, you could potentially borrow up to $90,000 (85% of $400,000 = $340,000 minus $250,000 owed).' },
      { question: 'Is home equity loan interest tax deductible?', answer: 'Home equity loan interest may be tax deductible if the funds are used to buy, build, or substantially improve the home that secures the loan. Interest used for other purposes (debt consolidation, vacations) is generally not deductible. Consult a tax advisor for your specific situation.' },
      { question: 'What credit score do I need for a home equity loan?', answer: 'Most lenders require a minimum credit score of 620-680 for a home equity loan, with the best rates available to borrowers with scores above 740. You also typically need at least 15-20% equity in your home and a debt-to-income ratio below 43%.' },
    ],
  },
  {
    slug: 'heart-rate-zone',
    title: 'Heart Rate Zone Calculator',
    description: 'Calculate your 5 personalized heart rate training zones using the Karvonen method or % of max HR. Includes zone descriptions and training guidance.',
    category: 'health',
    icon: 'Heart',
    color: 'bg-red-50 text-red-700',
    keywords: ['heart rate zone calculator', 'target heart rate', 'training zones', 'max heart rate', 'Karvonen method', 'fat burning zone', 'cardio zones'],
    faqs: [
      { question: 'What are heart rate training zones?', answer: 'Heart rate training zones are percentage ranges of your maximum heart rate that correspond to different exercise intensities. Zone 1 (50-60%) is recovery, Zone 2 (60-70%) is fat burning, Zone 3 (70-80%) is aerobic, Zone 4 (80-90%) is threshold, and Zone 5 (90-100%) is maximum effort. Training in different zones produces different physiological adaptations.' },
      { question: 'How do I calculate my maximum heart rate?', answer: 'The most common formula is 220 minus your age. For example, a 35-year-old has an estimated max HR of 185 bpm. This formula has a standard deviation of about 10-12 bpm, so individual variation is significant. The most accurate way to determine your true max HR is through a supervised maximal exercise test.' },
      { question: 'What is the Karvonen method?', answer: 'The Karvonen method (also called Heart Rate Reserve method) calculates training zones using your resting heart rate in addition to your max HR. Heart Rate Reserve = Max HR minus Resting HR. Target HR = (HRR x intensity%) + Resting HR. This method is more personalized and accurate than simple % of max HR.' },
      { question: 'What heart rate zone burns the most fat?', answer: 'Zone 2 (60-70% max HR) burns the highest percentage of calories from fat. However, higher intensity zones burn more total calories per minute. For overall fat loss, a combination of Zone 2 steady-state cardio and higher-intensity interval training is most effective.' },
    ],
  },
  {
    slug: 'water-intake',
    title: 'Water Intake Calculator',
    description: 'Calculate your daily water intake recommendation based on body weight, activity level, climate, and special conditions like pregnancy.',
    category: 'health',
    icon: 'Droplets',
    color: 'bg-blue-50 text-blue-700',
    keywords: ['water intake calculator', 'daily water intake', 'how much water should I drink', 'hydration calculator', 'water consumption calculator'],
    faqs: [
      { question: 'How much water should I drink per day?', answer: 'The National Academies recommends about 3.7 liters (125 oz) per day for men and 2.7 liters (91 oz) for women from all beverages and food. About 20% comes from food, so drinking roughly 3 liters (men) or 2.2 liters (women) per day is a good target. Individual needs vary based on body size, activity, and climate.' },
      { question: 'Does coffee or tea count toward daily water intake?', answer: 'Yes. Despite the mild diuretic effect of caffeine, studies show that caffeinated beverages like coffee and tea still contribute to net fluid intake. The diuretic effect is small and does not offset the fluid consumed. However, alcohol is a stronger diuretic and does not count toward hydration goals.' },
      { question: 'How do I know if I am drinking enough water?', answer: 'The simplest indicator is urine color. Pale yellow (like lemonade) indicates good hydration. Dark yellow or amber means you need more water. Clear urine may indicate overhydration. Other signs of dehydration include thirst, dry mouth, headache, fatigue, and decreased urine frequency.' },
      { question: 'Can you drink too much water?', answer: 'Yes. Hyponatremia (water intoxication) occurs when you drink so much water that sodium levels in the blood become dangerously diluted. This is rare in healthy people but can occur during endurance events when drinking large amounts of plain water. Electrolyte drinks are recommended for exercise lasting more than 1-2 hours.' },
    ],
  },
  {
    slug: 'due-date',
    title: 'Due Date Calculator',
    description: 'Calculate your pregnancy due date and key milestones from your last menstrual period, conception date, or IVF transfer date.',
    category: 'health',
    icon: 'Baby',
    color: 'bg-pink-50 text-pink-700',
    keywords: ['due date calculator', 'pregnancy due date', 'when is my baby due', 'estimated due date', 'EDD calculator', 'IVF due date'],
    faqs: [
      { question: 'How is a pregnancy due date calculated?', answer: "Naegele's Rule is the standard method: add 280 days (40 weeks) to the first day of your last menstrual period (LMP). This assumes a 28-day cycle. If your cycle is longer or shorter, the ovulation date shifts accordingly. Ultrasound dating in the first trimester is the most accurate method." },
      { question: 'What is a full-term pregnancy?', answer: 'A full-term pregnancy is 39-40 weeks. Early term is 37-38 weeks, late term is 41 weeks, and post-term is 42+ weeks. Babies born before 37 weeks are considered premature. The American College of Obstetricians and Gynecologists recommends waiting until at least 39 weeks for elective deliveries.' },
      { question: 'How accurate is an estimated due date?', answer: 'Only about 5% of babies are born on their exact due date. About 80% are born within 2 weeks of the EDD. First-time mothers tend to deliver slightly later than their due date. Ultrasound dating before 14 weeks is accurate to within 5-7 days; later ultrasounds are less precise.' },
      { question: 'What is the difference between gestational age and fetal age?', answer: 'Gestational age is counted from the first day of the last menstrual period (LMP) and is the standard medical measurement. Fetal age (conceptional age) is counted from conception, which is typically 2 weeks after LMP. When doctors say you are 10 weeks pregnant, they mean 10 weeks gestational age, which is about 8 weeks since conception.' },
    ],
  },
  {
    slug: 'menstrual-cycle',
    title: 'Menstrual Cycle Calculator',
    description: 'Predict your next period, ovulation date, and fertile window for the next 3-12 cycles based on your cycle length.',
    category: 'health',
    icon: 'CalendarHeart',
    color: 'bg-pink-50 text-pink-700',
    keywords: ['menstrual cycle calculator', 'period calculator', 'next period date', 'ovulation calculator', 'fertile window', 'period tracker'],
    faqs: [
      { question: 'How do I calculate my next period date?', answer: 'Add your average cycle length to the first day of your last period. For example, if your last period started on March 1 and your cycle is 28 days, your next period is expected around March 29. Cycle length is measured from the first day of one period to the first day of the next.' },
      { question: 'What is a normal menstrual cycle length?', answer: 'A normal cycle ranges from 21 to 35 days, with 28 days being the average. Cycle length can vary from month to month due to stress, illness, travel, diet changes, and hormonal fluctuations. Consistently irregular cycles may warrant a discussion with a healthcare provider.' },
      { question: 'When is the fertile window?', answer: 'The fertile window is the 6 days ending on ovulation day. Ovulation typically occurs about 14 days before the next period (not 14 days after the last period, unless you have a 28-day cycle). Sperm can survive 3-5 days in the reproductive tract, so intercourse in the days leading up to ovulation can result in pregnancy.' },
      { question: 'What is the luteal phase?', answer: 'The luteal phase is the second half of the menstrual cycle, from ovulation to the start of the next period. It is typically 12-14 days long and is more consistent than the follicular phase (before ovulation). Progesterone dominates this phase, preparing the uterine lining for potential implantation.' },
    ],
  },
  {
    slug: 'business-valuation',
    title: 'Business Valuation Calculator',
    description: 'Estimate your business value using 5 methods: earnings multiple, EBITDA multiple, revenue multiple, asset-based, and DCF analysis.',
    category: 'financial',
    icon: 'Briefcase',
    color: 'bg-purple-50 text-purple-700',
    keywords: ['business valuation calculator', 'how much is my business worth', 'business value calculator', 'EBITDA multiple', 'DCF calculator', 'company valuation'],
    faqs: [
      { question: 'How is a small business valued?', answer: 'Small businesses (under $1M revenue) are typically valued using a multiple of Seller Discretionary Earnings (SDE) -- usually 2-3x for very small businesses and up to 4-5x for larger ones. The multiple depends on growth trends, customer concentration, industry, owner dependency, and recurring revenue.' },
      { question: 'What is EBITDA and why is it used for valuation?', answer: 'EBITDA stands for Earnings Before Interest, Taxes, Depreciation, and Amortization. It is used for valuation because it approximates operating cash flow and allows comparison across companies with different capital structures and tax situations. Middle-market businesses ($1M-$50M) are commonly valued at 4-8x EBITDA.' },
      { question: 'What is a DCF valuation?', answer: 'Discounted Cash Flow (DCF) valuation estimates a business value by projecting future cash flows and discounting them back to present value using a required rate of return (discount rate). It is theoretically the most rigorous method but is highly sensitive to assumptions about growth rate and discount rate.' },
      { question: 'What factors increase business value?', answer: 'Key value drivers include: recurring revenue (subscriptions, contracts), customer diversification, strong management team that does not depend on the owner, documented systems and processes, growing revenue trends, high profit margins, proprietary technology or IP, and a defensible competitive position.' },
    ],
  },
  {
    slug: 'break-even',
    title: 'Break-Even Calculator',
    description: 'Calculate your break-even point in units and revenue. Find out how many sales you need to cover fixed and variable costs.',
    category: 'financial',
    icon: 'BarChart',
    color: 'bg-emerald-50 text-emerald-700',
    keywords: ['break even calculator', 'break even analysis', 'break even point', 'contribution margin', 'fixed costs variable costs', 'profit calculator'],
    faqs: [
      { question: 'What is a break-even point?', answer: 'The break-even point is the level of sales at which total revenue equals total costs -- neither a profit nor a loss. Above the break-even point, each additional unit sold generates profit. Below it, the business operates at a loss. It is a fundamental concept in business planning and pricing decisions.' },
      { question: 'What is contribution margin?', answer: 'Contribution margin is the selling price per unit minus the variable cost per unit. It represents how much each sale contributes toward covering fixed costs and generating profit. For example, if you sell a product for $50 and it costs $20 to produce, the contribution margin is $30 per unit.' },
      { question: 'What are fixed vs. variable costs?', answer: 'Fixed costs remain constant regardless of production volume (rent, salaries, insurance, equipment depreciation). Variable costs change proportionally with output (raw materials, direct labor, packaging, shipping). Understanding this distinction is essential for pricing, budgeting, and profitability analysis.' },
      { question: 'How do I use break-even analysis for pricing?', answer: 'Break-even analysis helps you set minimum viable prices. If your fixed costs are $10,000/month and variable cost is $25/unit, you need a price above $25 to make any contribution. At $50/unit, you need to sell 400 units to break even. Raising the price to $60 reduces break-even to 333 units, giving you more margin of safety.' },
    ],
  },
  {
    slug: 'depreciation',
    title: 'Depreciation Calculator',
    description: 'Calculate asset depreciation using straight-line, double declining balance, sum of years digits, or units of production methods.',
    category: 'financial',
    icon: 'TrendingDown',
    color: 'bg-gray-50 text-gray-700',
    keywords: ['depreciation calculator', 'straight line depreciation', 'double declining balance', 'MACRS depreciation', 'asset depreciation', 'book value calculator'],
    faqs: [
      { question: 'What is straight-line depreciation?', answer: 'Straight-line depreciation spreads the cost of an asset evenly over its useful life. Annual depreciation = (Cost - Salvage Value) / Useful Life. For example, a $50,000 machine with a $5,000 salvage value and 5-year life depreciates $9,000 per year. It is the simplest and most commonly used method for financial reporting.' },
      { question: 'What is double declining balance depreciation?', answer: 'Double declining balance (DDB) is an accelerated method that depreciates more in early years. The rate is 2 / useful life, applied to the remaining book value each year. For a 5-year asset, the rate is 40% per year. DDB switches to straight-line when straight-line gives a higher deduction.' },
      { question: 'What is MACRS depreciation?', answer: 'MACRS (Modified Accelerated Cost Recovery System) is the depreciation method required by the IRS for US tax purposes. It uses predetermined recovery periods and rates based on asset class. Most business equipment uses 5 or 7-year MACRS. MACRS typically provides larger deductions in early years than book depreciation.' },
      { question: 'What is salvage value?', answer: 'Salvage value (residual value) is the estimated value of an asset at the end of its useful life. It reduces the depreciable base -- you only depreciate the difference between cost and salvage value. If an asset has no expected resale value, salvage value is $0 and the full cost is depreciated.' },
    ],
  },
  {
    slug: 'workers-comp',
    title: 'Workers Comp Calculator',
    description: 'Estimate your annual workers compensation insurance premium based on payroll, job classification code, and experience modifier.',
    category: 'financial',
    icon: 'ShieldCheck',
    color: 'bg-blue-50 text-blue-700',
    keywords: ['workers comp calculator', 'workers compensation insurance', 'WC premium calculator', 'NCCI class code', 'experience modifier', 'workers comp rate'],
    faqs: [
      { question: 'How is workers comp insurance calculated?', answer: 'Workers comp premiums are calculated as: (Annual Payroll / 100) x Class Rate x Experience Modifier. The class rate is set by NCCI (National Council on Compensation Insurance) based on the risk level of the job classification. The experience modifier (X-Mod) adjusts for your specific claims history.' },
      { question: 'What is an experience modifier (X-Mod)?', answer: 'The experience modifier compares your actual claims history to the expected claims for businesses in your industry. An X-Mod of 1.0 is average. Below 1.0 means fewer claims than average (discount on premium). Above 1.0 means more claims than average (surcharge). X-Mods typically range from 0.5 to 2.0.' },
      { question: 'What are NCCI class codes?', answer: 'NCCI (National Council on Compensation Insurance) assigns 4-digit class codes to job types based on their injury risk. Office workers (8810) have very low rates around $0.18 per $100 payroll. High-risk jobs like logging (8227) can have rates of $25+ per $100 payroll. Misclassifying employees can result in significant premium adjustments at audit.' },
      { question: 'Is workers comp required for all businesses?', answer: 'Workers compensation requirements vary by state. Most states require coverage for businesses with 1 or more employees, though some states exempt very small employers or specific industries. Sole proprietors and partners are often exempt but can opt in. Penalties for non-compliance can include fines, stop-work orders, and personal liability for injury claims.' },
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
