/**
 * SEO content enrichment for all 27 CalcHQ calculators.
 * Each entry adds:
 *   - explanation: 2-3 paragraphs for "What is a X?" section
 *   - howTo: step-by-step guide for "How to Use" section + HowTo schema
 */

export const CALCULATOR_CONTENT: Record<
  string,
  {
    explanation: string[];
    howTo: { intro: string; steps: { title: string; text: string }[] };
  }
> = {
  loan: {
    explanation: [
      'A loan calculator is a financial tool that helps you determine the monthly payment, total interest paid, and full repayment schedule for any type of personal loan, auto loan, or installment debt. By entering the loan amount, interest rate, and repayment term, you can instantly see exactly what you will owe each month and how much the loan will cost in total.',
      'The calculation uses the standard amortization formula, which distributes your payments so that early installments are weighted toward interest and later payments go mostly toward principal. This is why paying extra early in a loan term saves disproportionately more interest.',
      'Understanding your loan terms before signing is one of the most important financial decisions you can make. Even a 1% difference in interest rate on a $20,000 auto loan can mean hundreds of dollars in extra costs over the life of the loan.',
    ],
    howTo: {
      intro: 'Follow these steps to calculate your loan payment and total cost in seconds.',
      steps: [
        { title: 'Enter the loan amount', text: 'Type the total amount you plan to borrow, before any down payment.' },
        { title: 'Enter the annual interest rate', text: 'Input the APR (Annual Percentage Rate) shown in your loan offer, not the monthly rate.' },
        { title: 'Set the loan term', text: 'Choose the number of months or years over which you will repay the loan.' },
        { title: 'Review your results', text: 'The calculator instantly shows your monthly payment, total interest paid, and total repayment amount.' },
        { title: 'Explore the amortization schedule', text: 'Scroll down to see a full month-by-month breakdown of principal vs. interest for every payment.' },
      ],
    },
  },

  mortgage: {
    explanation: [
      'A mortgage calculator helps homebuyers and homeowners estimate their monthly mortgage payment based on the home price, down payment, interest rate, and loan term. It can also factor in property taxes and homeowner\'s insurance to give you a complete picture of your monthly housing cost (PITI).',
      'Mortgage payments are structured as amortizing loans, meaning each payment covers both interest and a portion of the principal. In the early years, the majority of each payment goes toward interest. Over time, the balance shifts so that more of each payment reduces the principal.',
      'Using a mortgage calculator before house hunting helps you set a realistic budget. Lenders typically require that your total housing payment not exceed 28% of your gross monthly income, and your total debt payments not exceed 36% — the 28/36 rule.',
    ],
    howTo: {
      intro: 'Calculate your estimated monthly mortgage payment in four simple steps.',
      steps: [
        { title: 'Enter the home price', text: 'Input the purchase price of the home you are considering.' },
        { title: 'Enter your down payment', text: 'Enter the amount or percentage you plan to put down. A 20% down payment avoids private mortgage insurance (PMI).' },
        { title: 'Enter the interest rate and term', text: 'Use the rate from your lender pre-approval or current market rates. Common terms are 15 or 30 years.' },
        { title: 'Add taxes and insurance (optional)', text: 'For a complete PITI payment, add your estimated annual property taxes and homeowner\'s insurance.' },
        { title: 'Review your monthly payment', text: 'The calculator shows your total monthly payment broken down into principal, interest, taxes, and insurance.' },
      ],
    },
  },

  'rent-vs-buy': {
    explanation: [
      'The rent vs. buy calculator compares the true long-term financial cost of renting a home versus purchasing one. It accounts for factors that are often overlooked in simple comparisons, including opportunity cost of the down payment, home appreciation, rent increases, tax benefits, and transaction costs.',
      'Buying a home builds equity over time and provides stability, but it comes with significant upfront costs (down payment, closing costs), ongoing maintenance expenses (typically 1–2% of home value per year), and reduced financial flexibility. Renting offers lower upfront costs and the ability to invest the down payment elsewhere.',
      'The right answer depends heavily on how long you plan to stay in the area. Most financial experts suggest that buying only makes sense if you plan to stay for at least 5–7 years, enough time to recoup the transaction costs through equity building and appreciation.',
    ],
    howTo: {
      intro: 'Compare the total cost of renting vs. buying over your expected time horizon.',
      steps: [
        { title: 'Enter your home purchase details', text: 'Input the home price, down payment, mortgage rate, and loan term.' },
        { title: 'Enter your rental details', text: 'Input your current or expected monthly rent and the annual rent increase rate.' },
        { title: 'Set your time horizon', text: 'Enter how many years you plan to stay in the home or area.' },
        { title: 'Adjust investment return rate', text: 'Set the expected annual return if you were to invest your down payment instead of using it for a home purchase.' },
        { title: 'Compare the results', text: 'The calculator shows the total cost of each option over your time horizon and identifies which is financially better for your situation.' },
      ],
    },
  },

  salary: {
    explanation: [
      'A salary calculator converts your compensation between different pay periods — annual, monthly, biweekly, weekly, daily, and hourly. This is essential when comparing job offers that quote different pay structures, or when budgeting based on your actual take-home frequency.',
      'The standard full-time work year is 2,080 hours (40 hours per week × 52 weeks). However, if you work more or fewer hours, the calculator adjusts accordingly. Salaried employees are paid the same regardless of hours worked, while hourly employees are paid for each hour.',
      'When comparing a salaried position to an hourly one, be sure to account for benefits, overtime eligibility, and paid time off. A $60,000 salary with full benefits may be worth more than a $35/hour contract position with no benefits.',
    ],
    howTo: {
      intro: 'Convert your salary to any pay period in seconds.',
      steps: [
        { title: 'Enter your salary amount', text: 'Type your gross pay amount (before taxes and deductions).' },
        { title: 'Select your pay period', text: 'Choose whether the amount you entered is annual, monthly, weekly, or hourly.' },
        { title: 'Set your hours per week', text: 'Enter how many hours per week you work. This is used to calculate your effective hourly rate.' },
        { title: 'View all conversions', text: 'The calculator instantly shows your equivalent pay for every time period — annual, monthly, biweekly, weekly, daily, and hourly.' },
      ],
    },
  },

  'sales-tax': {
    explanation: [
      'A sales tax and tip calculator helps you quickly determine the final cost of any purchase after adding sales tax, or the total bill after adding a gratuity at a restaurant. It can also split the bill evenly among multiple people.',
      'Sales tax rates in the United States vary by state and locality, ranging from 0% (in states like Oregon and Montana) to over 10% in some cities. Knowing the tax rate for your area helps you budget accurately for purchases.',
      'Tipping customs vary by country and service type. In the United States, 15–20% is standard for restaurant service, 10–15% for food delivery, and $1–2 per bag for hotel bellhops. This calculator makes it easy to calculate any tip amount and split it among your group.',
    ],
    howTo: {
      intro: 'Calculate your total bill with tax and tip in three easy steps.',
      steps: [
        { title: 'Enter the pre-tax amount', text: 'Type the subtotal of your bill before any tax or tip.' },
        { title: 'Enter the tax rate', text: 'Input your local sales tax rate as a percentage (e.g., 8.5 for 8.5%).' },
        { title: 'Enter the tip percentage', text: 'Choose your desired tip percentage. 15%, 18%, and 20% are the most common options.' },
        { title: 'Split the bill (optional)', text: 'Enter the number of people splitting the bill to see each person\'s share.' },
        { title: 'View your total', text: 'The calculator shows the tax amount, tip amount, total bill, and per-person cost.' },
      ],
    },
  },

  tdee: {
    explanation: [
      'Your Total Daily Energy Expenditure (TDEE) is the total number of calories your body burns in a 24-hour period, accounting for your resting metabolism (BMR) and all physical activity. It is the most important number for anyone trying to manage their weight through diet.',
      'TDEE is calculated by multiplying your Basal Metabolic Rate (BMR) by an activity multiplier that reflects your lifestyle — from sedentary (desk job, little exercise) to extra active (hard training twice a day). The Mifflin-St Jeor equation is used to calculate BMR, as it is the most validated formula for most adults.',
      'To lose weight, consume fewer calories than your TDEE. To gain weight or muscle, consume more. To maintain your current weight, eat at your TDEE. A 500-calorie daily deficit typically produces about 1 pound of fat loss per week.',
    ],
    howTo: {
      intro: 'Find out exactly how many calories you burn each day.',
      steps: [
        { title: 'Enter your age, sex, height, and weight', text: 'These are used to calculate your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation.' },
        { title: 'Select your activity level', text: 'Choose the option that best describes your typical weekly activity, from sedentary to extra active.' },
        { title: 'View your TDEE', text: 'Your total daily calorie burn is displayed, along with calorie targets for weight loss, maintenance, and muscle gain.' },
        { title: 'Set your goal', text: 'Use the calorie targets shown to plan your diet. For weight loss, aim for the deficit target. For muscle gain, aim for the surplus target.' },
      ],
    },
  },

  macro: {
    explanation: [
      'A macro calculator determines your optimal daily intake of the three macronutrients — protein, carbohydrates, and fat — based on your body composition, activity level, and fitness goal. Tracking macros is more precise than simply counting calories because it ensures your body gets the right fuel for your specific goal.',
      'Protein is essential for muscle repair and growth (4 calories per gram). Carbohydrates are the body\'s primary energy source (4 calories per gram). Fat supports hormonal health and nutrient absorption (9 calories per gram). The ideal ratio of these three nutrients varies significantly depending on whether you are trying to lose fat, build muscle, or maintain your current physique.',
      'This calculator uses your TDEE as the foundation and then distributes your calories across macros based on your selected goal. For fat loss, protein is kept high to preserve muscle. For muscle gain, carbohydrates are increased to fuel training and recovery.',
    ],
    howTo: {
      intro: 'Get your personalized daily macro targets in minutes.',
      steps: [
        { title: 'Enter your stats', text: 'Input your age, sex, height, weight, and activity level to calculate your TDEE.' },
        { title: 'Select your goal', text: 'Choose from fat loss, maintenance, or muscle gain. This adjusts your total calorie target.' },
        { title: 'View your macro breakdown', text: 'The calculator shows your daily targets for protein, carbohydrates, and fat in both grams and calories.' },
        { title: 'Use the targets for meal planning', text: 'Track your daily food intake against these targets using a food tracking app like MyFitnessPal or Cronometer.' },
      ],
    },
  },

  bmi: {
    explanation: [
      'Body Mass Index (BMI) is a numerical value calculated from a person\'s height and weight. It is used as a screening tool to categorize individuals as underweight, normal weight, overweight, or obese. The formula is: BMI = weight (kg) ÷ height (m)².',
      'BMI is widely used by healthcare providers because it is quick, inexpensive, and correlates reasonably well with body fat levels at the population level. However, it has significant limitations — it does not distinguish between fat mass and muscle mass, and it can misclassify muscular athletes as overweight.',
      'The CDC defines BMI categories as: Underweight (below 18.5), Normal weight (18.5–24.9), Overweight (25–29.9), and Obese (30 and above). These thresholds are the same for all adults but differ for children and teenagers.',
    ],
    howTo: {
      intro: 'Calculate your BMI and understand what it means for your health.',
      steps: [
        { title: 'Enter your height', text: 'Input your height in feet and inches (imperial) or centimeters (metric).' },
        { title: 'Enter your weight', text: 'Input your weight in pounds (imperial) or kilograms (metric).' },
        { title: 'View your BMI', text: 'Your BMI is calculated instantly and displayed with your weight category (underweight, normal, overweight, or obese).' },
        { title: 'Review the healthy range', text: 'The calculator shows the healthy weight range for your height, so you can see how far you are from the normal BMI range if applicable.' },
      ],
    },
  },

  'body-fat': {
    explanation: [
      'Body fat percentage is the proportion of your total body weight that is composed of fat tissue. Unlike BMI, which only considers height and weight, body fat percentage distinguishes between fat mass and lean mass (muscle, bone, organs, water), making it a more accurate measure of body composition.',
      'This calculator uses the U.S. Navy method, which estimates body fat from circumference measurements of the neck, waist, and hips (for women). It is one of the most practical field methods because it requires only a tape measure and has been validated against more expensive techniques like DEXA scans.',
      'Healthy body fat ranges differ by sex and age. For men, 10–20% is considered fit; for women, 18–28%. Athletes often fall below these ranges. Very low body fat (below 5% for men, below 12% for women) can be dangerous and is not recommended for most people.',
    ],
    howTo: {
      intro: 'Estimate your body fat percentage using just a tape measure.',
      steps: [
        { title: 'Measure your neck circumference', text: 'Measure around the narrowest part of your neck, just below the larynx (Adam\'s apple), keeping the tape horizontal.' },
        { title: 'Measure your waist circumference', text: 'For men: measure at the navel. For women: measure at the narrowest point of the waist.' },
        { title: 'Measure your hip circumference (women only)', text: 'Measure around the widest part of your hips and buttocks, keeping the tape horizontal.' },
        { title: 'Enter your height', text: 'Input your height in inches or centimeters.' },
        { title: 'View your body fat percentage', text: 'The calculator shows your estimated body fat percentage and your fitness category.' },
      ],
    },
  },

  bmr: {
    explanation: [
      'Your Basal Metabolic Rate (BMR) is the number of calories your body burns at complete rest — just to keep you alive. It accounts for energy used by your heart, lungs, brain, liver, kidneys, and all other organs. BMR typically represents 60–75% of total daily calorie expenditure.',
      'BMR is calculated using either the Mifflin-St Jeor equation (recommended for most people) or the Harris-Benedict equation (an older formula). Both use age, sex, height, and weight as inputs. Mifflin-St Jeor is considered more accurate for modern populations.',
      'Your BMR is the floor of your calorie needs — you should never eat fewer calories than your BMR for extended periods, as this can cause muscle loss, nutrient deficiencies, and metabolic adaptation. BMR is the starting point for calculating your TDEE (Total Daily Energy Expenditure).',
    ],
    howTo: {
      intro: 'Find your resting calorie burn in seconds.',
      steps: [
        { title: 'Enter your age', text: 'BMR decreases with age as muscle mass naturally declines.' },
        { title: 'Select your sex', text: 'Men and women have different BMR formulas due to differences in average muscle mass and body composition.' },
        { title: 'Enter your height and weight', text: 'Use your current measurements for the most accurate result.' },
        { title: 'View your BMR', text: 'Your resting calorie burn is displayed in calories per day. This is the minimum you should eat to support basic bodily functions.' },
      ],
    },
  },

  'one-rep-max': {
    explanation: [
      'Your one rep max (1RM) is the maximum amount of weight you can lift for a single repetition of a given exercise with proper form. It is the gold standard measure of muscular strength and is used to prescribe training loads — for example, "lift 80% of your 1RM for 4 sets of 5 reps."',
      'Testing your true 1RM requires careful warm-up, proper technique, and carries some injury risk. This calculator uses submaximal testing — you lift a weight you can handle for multiple reps, and the formula estimates your 1RM from that performance. The Epley formula (weight × (1 + reps/30)) is the most widely used.',
      'Once you know your 1RM, you can use percentage-based programming to structure your training. Common training zones include: 90–100% for strength, 75–85% for hypertrophy (muscle growth), and 60–75% for muscular endurance.',
    ],
    howTo: {
      intro: 'Estimate your maximum strength without the risk of a true 1RM test.',
      steps: [
        { title: 'Choose your exercise', text: 'Select the lift you want to estimate — bench press, squat, deadlift, or any other exercise.' },
        { title: 'Enter the weight lifted', text: 'Input the weight you used for your working set (in pounds or kilograms).' },
        { title: 'Enter the number of reps', text: 'Enter how many reps you completed with that weight. For best accuracy, use a set of 3–10 reps.' },
        { title: 'View your estimated 1RM', text: 'Your estimated one rep max is displayed, along with a percentage table showing recommended weights for different rep ranges.' },
      ],
    },
  },

  'calories-burned': {
    explanation: [
      'The calories burned calculator estimates the energy you expend during exercise based on your body weight, the type of activity, and the duration. It uses MET (Metabolic Equivalent of Task) values — standardized measures of exercise intensity relative to rest.',
      'A MET value of 1 represents energy expenditure at rest. Walking at a moderate pace has a MET of about 3.5, meaning it burns 3.5 times more calories than sitting still. Running at 6 mph has a MET of about 10. The formula is: Calories = MET × weight (kg) × duration (hours).',
      'These estimates are averages and may vary by 15–20% from your actual calorie burn, depending on your fitness level, body composition, and exercise intensity. For more precise tracking, a heart rate monitor or fitness tracker provides more personalized data.',
    ],
    howTo: {
      intro: 'Estimate how many calories you burned during your workout.',
      steps: [
        { title: 'Select your activity', text: 'Choose from the list of common exercises, from walking and running to swimming and cycling.' },
        { title: 'Enter your weight', text: 'Input your body weight in pounds or kilograms. Heavier individuals burn more calories for the same activity.' },
        { title: 'Enter the duration', text: 'Input how long you performed the activity in minutes.' },
        { title: 'View your calorie burn', text: 'The calculator shows your estimated calories burned, along with the MET value used for the calculation.' },
      ],
    },
  },

  'fat-burning-zone': {
    explanation: [
      'The fat burning zone refers to the range of exercise intensity — measured as a percentage of maximum heart rate — at which your body uses the highest proportion of fat as its primary fuel source. This zone is typically 60–70% of your maximum heart rate.',
      'At lower intensities, fat provides a greater percentage of the energy used, but total calorie burn is lower. At higher intensities, carbohydrates become the dominant fuel, but total calorie burn is much higher. For overall fat loss, total calorie deficit matters most — but the fat burning zone is useful for long, sustainable cardio sessions.',
      'Your maximum heart rate is estimated as 220 minus your age (Haskell & Fox formula). This is an average; individual maximum heart rates can vary by ±10–20 bpm. A stress test with a cardiologist provides the most accurate measurement.',
    ],
    howTo: {
      intro: 'Find your personalized heart rate zones for fat burning and cardio training.',
      steps: [
        { title: 'Enter your age', text: 'Your age is used to estimate your maximum heart rate using the 220 minus age formula.' },
        { title: 'Enter your resting heart rate (optional)', text: 'For more accurate zones using the Karvonen method, enter your resting heart rate (measured first thing in the morning).' },
        { title: 'View your heart rate zones', text: 'The calculator displays your target heart rate for the fat burning zone (60–70% max HR), cardio zone (70–85%), and peak zone (85–95%).' },
        { title: 'Use the zones during exercise', text: 'Wear a heart rate monitor during cardio and aim to keep your heart rate within the target zone for your goal.' },
      ],
    },
  },

  percentage: {
    explanation: [
      'A percentage calculator solves the three most common percentage problems: finding what percentage one number is of another, calculating a percentage of a number, and determining the percentage change between two values. Percentages are used everywhere — from discounts and taxes to grades and statistics.',
      'The word "percent" comes from the Latin "per centum," meaning "per hundred." A percentage is simply a ratio expressed as a fraction of 100. So 25% means 25 per 100, or 0.25 as a decimal.',
      'Percentage change is especially important in finance and data analysis. A stock that drops from $100 to $80 has fallen 20%, but recovering from $80 back to $100 requires a 25% gain — an asymmetry that trips up many investors.',
    ],
    howTo: {
      intro: 'Solve any percentage problem instantly with three calculation modes.',
      steps: [
        { title: 'Choose your calculation type', text: 'Select from: "What is X% of Y?", "X is what % of Y?", or "Percentage change from X to Y."' },
        { title: 'Enter your values', text: 'Input the numbers for your specific problem. The calculator labels each field clearly.' },
        { title: 'View the result', text: 'Your answer is calculated instantly with a plain-English explanation of the result.' },
      ],
    },
  },

  'compound-interest': {
    explanation: [
      'Compound interest is the process by which interest is earned not only on the original principal but also on the accumulated interest from previous periods. Albert Einstein reportedly called it the "eighth wonder of the world" — it is the fundamental mechanism behind long-term wealth building.',
      'The formula for compound interest is: A = P(1 + r/n)^(nt), where A is the final amount, P is the principal, r is the annual interest rate, n is the number of compounding periods per year, and t is the number of years. This calculator also supports regular monthly contributions, which dramatically accelerate growth.',
      'The difference between starting to invest at age 25 versus age 35 can be enormous. Investing $500/month from age 25 to 65 at 7% annual return yields approximately $1.2 million. Starting at 35 yields only about $567,000 — less than half, despite only a 10-year difference.',
    ],
    howTo: {
      intro: 'See exactly how your savings or investment will grow over time.',
      steps: [
        { title: 'Enter your initial investment', text: 'Input the starting amount you are investing or saving today.' },
        { title: 'Enter the annual interest rate', text: 'Use the expected annual return rate. The S&P 500 has historically averaged about 10% before inflation.' },
        { title: 'Set the time period', text: 'Enter the number of years you plan to invest.' },
        { title: 'Add monthly contributions (optional)', text: 'Enter any regular monthly amount you plan to add to the investment.' },
        { title: 'Choose compounding frequency', text: 'Select how often interest compounds — daily, monthly, quarterly, or annually.' },
        { title: 'View your growth chart', text: 'The calculator shows your final balance, total contributions, and total interest earned, along with a year-by-year growth chart.' },
      ],
    },
  },

  retirement: {
    explanation: [
      'A retirement calculator helps you determine how much money you need to save for retirement and whether your current savings rate will get you there. It projects your retirement nest egg based on your current savings, monthly contributions, expected investment return, and retirement timeline.',
      'The most widely used retirement planning benchmark is the 4% rule, which suggests you can safely withdraw 4% of your portfolio in year one of retirement and adjust for inflation each year, with a high probability of not running out of money over a 30-year retirement. This means you need 25 times your expected annual expenses saved.',
      'Social Security benefits can significantly supplement retirement savings. The average Social Security benefit in 2024 is about $1,700/month. Your actual benefit depends on your earnings history and the age at which you claim — claiming at 62 reduces benefits by up to 30%, while delaying to 70 increases them by 8% per year.',
    ],
    howTo: {
      intro: 'Find out if you are on track for retirement and how much you need to save.',
      steps: [
        { title: 'Enter your current age and retirement age', text: 'This determines your investment time horizon — how many years your money has to grow.' },
        { title: 'Enter your current retirement savings', text: 'Include all retirement accounts: 401(k), IRA, Roth IRA, pension value, and other long-term savings.' },
        { title: 'Enter your monthly contribution', text: 'Include all contributions: your 401(k) contribution plus any employer match.' },
        { title: 'Set your expected annual return', text: 'A balanced portfolio of stocks and bonds has historically returned 6–8% annually. Adjust based on your risk tolerance.' },
        { title: 'Enter your desired retirement income', text: 'How much do you want to spend per year in retirement? A common target is 70–80% of your pre-retirement income.' },
        { title: 'View your retirement projection', text: 'The calculator shows your projected nest egg, whether it meets your income goal, and how long it will last.' },
      ],
    },
  },

  paycheck: {
    explanation: [
      'A paycheck calculator estimates your net take-home pay after all federal and state taxes, Social Security, Medicare, and voluntary deductions like 401(k) contributions. It helps you understand exactly where your gross pay goes and how much you will actually receive in each paycheck.',
      'Federal income tax in the United States uses a progressive bracket system — you pay a higher rate only on the income above each threshold, not on your entire income. For 2024, the brackets range from 10% (on the first $11,600 for single filers) to 37% (on income above $609,350).',
      'Pre-tax deductions like 401(k) contributions, Health Savings Account (HSA) contributions, and Flexible Spending Account (FSA) contributions reduce your taxable income, which means you pay less in federal and state income tax. This is why contributing to a 401(k) effectively costs you less than the contribution amount.',
    ],
    howTo: {
      intro: 'Calculate your exact take-home pay after all taxes and deductions.',
      steps: [
        { title: 'Enter your gross salary', text: 'Input your annual salary or hourly wage and select your pay frequency (weekly, biweekly, semi-monthly, monthly).' },
        { title: 'Select your filing status', text: 'Choose single, married filing jointly, or head of household. This determines your federal tax bracket.' },
        { title: 'Enter your state', text: 'State income tax rates vary significantly. Nine states have no income tax at all.' },
        { title: 'Enter pre-tax deductions', text: 'Add your 401(k) contribution percentage and any other pre-tax deductions (HSA, FSA, health insurance).' },
        { title: 'View your paycheck breakdown', text: 'The calculator shows your gross pay, each deduction itemized, and your final net take-home pay per paycheck.' },
      ],
    },
  },

  roi: {
    explanation: [
      'Return on Investment (ROI) is a performance metric used to evaluate the efficiency or profitability of an investment. It is expressed as a percentage and calculated by dividing the net profit by the cost of the investment. ROI is one of the most universal metrics in business and personal finance.',
      'Simple ROI tells you the total return over the entire holding period. Annualized ROI (also called CAGR — Compound Annual Growth Rate) normalizes that return to a per-year figure, making it possible to compare investments held for different time periods on an equal basis.',
      'ROI has limitations: it does not account for the time value of money, risk, or opportunity cost on its own. A 50% ROI over 10 years is much less impressive than a 50% ROI over 1 year. This is why annualized ROI is generally more useful for comparing investments.',
    ],
    howTo: {
      intro: 'Calculate the return on any investment in seconds.',
      steps: [
        { title: 'Enter your initial investment', text: 'Input the total amount you invested, including any fees or transaction costs.' },
        { title: 'Enter the final value', text: 'Input the current or final value of the investment.' },
        { title: 'Enter the holding period (optional)', text: 'For annualized ROI, enter the number of years or months you held the investment.' },
        { title: 'View your ROI', text: 'The calculator shows your total ROI percentage, net profit in dollars, and annualized ROI (CAGR) if a time period was entered.' },
      ],
    },
  },

  refinance: {
    explanation: [
      'A mortgage refinance calculator helps you determine whether refinancing your existing mortgage makes financial sense. It compares your current loan terms to a new loan and calculates your monthly savings, total interest savings, and break-even point — the number of months it takes to recoup the closing costs.',
      'Refinancing replaces your existing mortgage with a new one, typically to secure a lower interest rate, reduce the monthly payment, shorten the loan term, or access home equity (cash-out refinance). Closing costs typically range from 2–5% of the loan amount.',
      'The break-even point is the most critical metric in a refinance decision. If your break-even is 24 months and you plan to stay in your home for 10 years, refinancing makes strong financial sense. If you plan to move in 18 months, the closing costs will not be recouped.',
    ],
    howTo: {
      intro: 'Find out how much you could save by refinancing your mortgage.',
      steps: [
        { title: 'Enter your current loan details', text: 'Input your current balance, interest rate, and remaining term.' },
        { title: 'Enter the new loan terms', text: 'Input the new interest rate and term you are considering.' },
        { title: 'Enter closing costs', text: 'Input the estimated closing costs for the refinance (typically 2–5% of the loan amount).' },
        { title: 'View your savings', text: 'The calculator shows your monthly savings, total interest savings over the life of the loan, and the break-even point in months.' },
      ],
    },
  },

  pregnancy: {
    explanation: [
      'A pregnancy due date calculator estimates the date your baby is expected to be born, typically 40 weeks (280 days) from the first day of your last menstrual period (LMP). This method, known as Naegele\'s Rule, is the standard used by obstetricians worldwide.',
      'Pregnancy is divided into three trimesters: the first trimester (weeks 1–12) covers early development and the highest risk of miscarriage; the second trimester (weeks 13–26) is often the most comfortable period; and the third trimester (weeks 27–40) involves rapid fetal growth and preparation for birth.',
      'Only about 5% of babies are born on their exact due date. Most arrive within a two-week window on either side. An ultrasound performed in the first trimester (before 14 weeks) provides the most accurate dating and may adjust the due date calculated from LMP.',
    ],
    howTo: {
      intro: 'Calculate your estimated due date and pregnancy milestones.',
      steps: [
        { title: 'Enter the first day of your last period', text: 'This is the standard starting point for pregnancy dating, even though conception typically occurs about 2 weeks later.' },
        { title: 'Enter your average cycle length (optional)', text: 'If your cycle is not 28 days, adjusting this improves accuracy.' },
        { title: 'View your due date', text: 'Your estimated due date (EDD) is calculated as 280 days from your LMP.' },
        { title: 'Review your pregnancy timeline', text: 'The calculator shows your current week of pregnancy, trimester, and key milestone dates.' },
      ],
    },
  },

  ovulation: {
    explanation: [
      'An ovulation calculator predicts the days in your menstrual cycle when you are most likely to be fertile — specifically, the 5 days before ovulation and the day of ovulation itself. This fertile window is the only time in each cycle when pregnancy is possible.',
      'Ovulation typically occurs about 14 days before the start of your next period. For a 28-day cycle, that is around day 14. For a 32-day cycle, it would be around day 18. The calculator adjusts based on your cycle length.',
      'While ovulation calculators are useful for planning, they are estimates based on average cycle patterns. Stress, illness, travel, and hormonal changes can shift ovulation timing. Ovulation predictor kits (OPKs) that detect the LH surge provide more reliable same-cycle confirmation.',
    ],
    howTo: {
      intro: 'Identify your most fertile days to maximize your chances of conception.',
      steps: [
        { title: 'Enter the first day of your last period', text: 'This is day 1 of your current cycle.' },
        { title: 'Enter your average cycle length', text: 'Count from the first day of one period to the first day of the next. Most cycles are 21–35 days.' },
        { title: 'View your fertile window', text: 'The calculator shows your estimated ovulation date and the 5-day fertile window before it.' },
        { title: 'Plan accordingly', text: 'For the best chance of conception, aim for intercourse every 1–2 days during the fertile window, particularly the 2–3 days before ovulation.' },
      ],
    },
  },

  'calorie-deficit': {
    explanation: [
      'A calorie deficit calculator determines how many calories you need to eat each day to lose weight at your desired rate. It starts by calculating your Total Daily Energy Expenditure (TDEE) — the number of calories you burn each day — and then subtracts a deficit based on your weight loss goal.',
      'One pound of body fat contains approximately 3,500 calories. To lose 1 pound per week, you need a daily calorie deficit of 500 calories (3,500 ÷ 7). To lose 2 pounds per week — the maximum recommended by most health authorities — you need a 1,000-calorie daily deficit.',
      'Very aggressive calorie deficits (more than 1,000 calories below TDEE) are generally not recommended because they increase the risk of muscle loss, nutrient deficiencies, and metabolic adaptation. A moderate deficit of 500–750 calories per day is sustainable and effective for most people.',
    ],
    howTo: {
      intro: 'Find your daily calorie target for safe, sustainable weight loss.',
      steps: [
        { title: 'Enter your stats', text: 'Input your age, sex, height, weight, and activity level to calculate your TDEE.' },
        { title: 'Enter your weight loss goal', text: 'Choose how many pounds per week you want to lose (0.5, 1, or 2 lbs/week).' },
        { title: 'View your daily calorie target', text: 'The calculator shows your TDEE, your calorie deficit, and your daily calorie intake target.' },
        { title: 'Track your intake', text: 'Use a food tracking app to log your meals and ensure you stay within your daily calorie target.' },
      ],
    },
  },

  'ideal-weight': {
    explanation: [
      'An ideal weight calculator estimates the weight range considered healthy for a person of a given height and sex. This calculator uses four medically recognized formulas — Robinson (1983), Miller (1983), Devine (1974), and Hamwi (1964) — and displays the average, giving a more balanced estimate than any single formula.',
      'These formulas were originally developed for clinical use in determining medication dosages and are not intended as strict weight targets. They represent population averages and do not account for individual variation in muscle mass, bone density, or body frame size.',
      'A complementary approach is to use the healthy BMI range (18.5–24.9) to calculate a healthy weight range for your height. This is shown alongside the formula-based ideal weight for comparison.',
    ],
    howTo: {
      intro: 'Find the ideal weight range for your height and sex.',
      steps: [
        { title: 'Enter your height', text: 'Input your height in feet and inches or centimeters.' },
        { title: 'Select your sex', text: 'The formulas use different base values for men and women.' },
        { title: 'View your ideal weight', text: 'The calculator shows the ideal weight from each of the four formulas, their average, and the healthy weight range based on BMI.' },
        { title: 'Use it as a guide, not a target', text: 'Remember that ideal weight formulas are estimates. Body composition, fitness level, and overall health are more important than a specific number on the scale.' },
      ],
    },
  },

  sleep: {
    explanation: [
      'A sleep calculator helps you determine the best time to go to bed or wake up based on 90-minute sleep cycles. Sleep occurs in cycles that alternate between light sleep (NREM stages 1–3) and REM (Rapid Eye Movement) sleep. Waking up at the end of a complete cycle, during the lightest stage of sleep, minimizes grogginess and sleep inertia.',
      'Most adults need 5–6 complete sleep cycles per night, which equals 7.5–9 hours of sleep. The calculator adds 15 minutes of fall-asleep time to ensure the cycles are properly aligned with your actual sleep onset.',
      'Sleep quality matters as much as quantity. Consistent sleep and wake times — even on weekends — help regulate your circadian rhythm, making it easier to fall asleep and wake up naturally. Exposure to blue light from screens in the hour before bed suppresses melatonin production and delays sleep onset.',
    ],
    howTo: {
      intro: 'Find the perfect bedtime or wake-up time to feel refreshed.',
      steps: [
        { title: 'Choose your calculation direction', text: 'Select "I want to wake up at..." to find the best bedtime, or "I want to go to bed at..." to find the best wake-up times.' },
        { title: 'Enter your target time', text: 'Input your desired wake-up time or bedtime.' },
        { title: 'View your optimal times', text: 'The calculator shows multiple bedtime or wake-up options, each aligned with the end of a complete 90-minute sleep cycle.' },
        { title: 'Choose the right number of cycles', text: 'For most adults, 5 cycles (7.5 hours) or 6 cycles (9 hours) is ideal. Select the option that best fits your schedule.' },
      ],
    },
  },

  age: {
    explanation: [
      'An age calculator computes your exact age from your date of birth to today (or any target date), expressed in years, months, days, weeks, and hours. It accounts for the varying lengths of months and leap years to give a precise result.',
      'Beyond simple age calculation, this tool shows interesting statistics about your life — how many days you have been alive, how many weeks, and how many hours. It also counts down the exact number of days until your next birthday.',
      'Age calculations are used in many practical contexts: determining eligibility for age-restricted activities, calculating age for medical or legal purposes, or simply satisfying curiosity about the passage of time.',
    ],
    howTo: {
      intro: 'Calculate your exact age and interesting life statistics.',
      steps: [
        { title: 'Enter your date of birth', text: 'Select your birth month, day, and year from the date picker.' },
        { title: 'Set the target date (optional)', text: 'By default, the calculator uses today\'s date. You can change this to calculate your age on any past or future date.' },
        { title: 'View your exact age', text: 'Your age is displayed in years, months, and days, with the day of the week you were born.' },
        { title: 'Explore your life statistics', text: 'Scroll down to see your total age in days, weeks, months, and hours, plus the countdown to your next birthday.' },
      ],
    },
  },

  calculator: {
    explanation: [
      'This multi-mode calculator combines three different calculator types in a single tool: a Standard calculator for everyday arithmetic, a Scientific calculator for trigonometry and advanced math, and an Engineering calculator for technical computations. Switch between modes instantly with the toggle at the top.',
      'Standard mode handles the four basic operations — addition, subtraction, multiplication, and division — plus percentage calculations. Scientific mode adds trigonometric functions (sin, cos, tan), inverse trig, logarithms (log, ln), square roots, exponents, and mathematical constants (π, e). Engineering mode extends this with cube roots, absolute value, ceiling/floor functions, and displays results in scientific notation.',
      'The calculator maintains a full history of your calculations, which you can scroll through and reuse. This makes it easy to chain calculations or verify previous work without re-entering values.',
    ],
    howTo: {
      intro: 'Use the right calculator mode for any math problem.',
      steps: [
        { title: 'Select your mode', text: 'Click Standard, Scientific, or Engineering at the top of the calculator to switch modes. The button layout updates automatically.' },
        { title: 'Enter your calculation', text: 'Click the number and operator buttons, or use your keyboard for faster input.' },
        { title: 'Use scientific functions (Scientific/Engineering mode)', text: 'Press a function button like sin, cos, log, or sqrt, then enter your value and close the parenthesis before pressing equals.' },
        { title: 'Press equals to calculate', text: 'Press the = button or Enter key to compute the result. The calculation is saved to your history.' },
        { title: 'Review your history', text: 'Scroll the history panel to see previous calculations. Click any entry to load that result as your starting value.' },
      ],
    },
  },

  'unit-converter': {
    explanation: [
      'A unit converter translates measurements between different systems and units — for example, converting miles to kilometers, pounds to kilograms, or Fahrenheit to Celsius. It is an essential tool for international travel, cooking, science, and engineering.',
      'The most common conversion need in the United States is between the imperial system (used in the US) and the metric system (used by most of the world). This converter handles length, weight, temperature, volume, area, and more.',
      'Temperature conversions are a special case because they involve both multiplication and addition (unlike most unit conversions which are purely multiplicative). The formula for Celsius to Fahrenheit is: °F = (°C × 9/5) + 32. For Kelvin: K = °C + 273.15.',
    ],
    howTo: {
      intro: 'Convert between any units of measurement instantly.',
      steps: [
        { title: 'Select the measurement category', text: 'Choose from length, weight, temperature, volume, area, speed, or other categories.' },
        { title: 'Select the "from" unit', text: 'Choose the unit you are converting from (e.g., miles, pounds, Fahrenheit).' },
        { title: 'Enter the value', text: 'Type the number you want to convert.' },
        { title: 'Select the "to" unit', text: 'Choose the unit you want to convert to (e.g., kilometers, kilograms, Celsius).' },
        { title: 'View the result', text: 'The converted value is displayed instantly. You can also swap the units to convert in the opposite direction.' },
      ],
    },
  },
};
