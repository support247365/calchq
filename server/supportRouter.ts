/*
 * CalcHQ Support Router
 * Provides a tRPC procedure for the Level 2 AI chat support feature.
 */
import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";

const SYSTEM_PROMPT = `You are a helpful support assistant for CalcHQ (calchq.io), a free online calculator platform. 
CalcHQ offers over 63 free calculators across four categories: Financial (loans, mortgages, salary, investments), Health & Fitness (BMI, TDEE, calories, body fat), Math (percentages, fractions, algebra), and Tools (unit converters, date calculators, currency).

Your role is to:
1. Help users understand how to use specific calculators on CalcHQ
2. Explain what the calculator results mean
3. Answer questions about financial, health, math, and tool-related calculations
4. Guide users to the right calculator for their needs

Keep responses concise, friendly, and accurate. If a user asks something outside the scope of calculators or general math/finance/health topics, politely redirect them. 
If you cannot resolve their issue, suggest they email support@calchq.io for further assistance.`;

export const supportRouter = router({
  chat: publicProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const result = await invokeLLM({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...input.messages,
        ],
      });

      const reply = result.choices[0]?.message?.content;
      const replyText = typeof reply === "string" ? reply : "";

      return { reply: replyText };
    }),
});
