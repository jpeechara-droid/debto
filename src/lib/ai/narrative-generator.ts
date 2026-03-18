

interface NarrativeInput {
  userName: string;
  creditScore: number;
  totalDebt: number;
  monthlyEMI: number;
  monthlyIncome: number;
  debtToIncome: number;
  healthStatus: string;
  activeLoans: number;
  overdueCount: number;
  monthsSaved: number;
  interestSaved: number;
  topStrategy: string;
  highestRateLoan: { lender: string; type: string; apr: number } | null;
  utilization: number;
  paymentHistoryPct: number;
}

interface NarrativeResult {
  success: boolean;
  insightBox: string;
  creditAdvice: string[];
  smartSuggestion: string;
  overallSummary: string;
  error?: string;
}

const SYSTEM_PROMPT = `You are Debto AI, a friendly and expert Indian financial advisor. You generate brief, actionable insights about a user's debt portfolio. Rules:
- NEVER mention specific rupee amounts or percentages — those come from the calculation engine
- Use encouraging but honest tone  
- Reference Indian financial products and context (CIBIL, RBI guidelines, etc.)
- Keep each output section to 1-3 sentences maximum
- Use simple language (B1 English level)
- Do NOT use markdown formatting — plain text only
- Focus on what the user should DO next, not what they already know`;

/**
 * Generate personalized narrative text using Claude API
 */
export async function generateNarrative(
  input: NarrativeInput
): Promise<NarrativeResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Dev mode — return template-based narrative
  if (!apiKey) {
    console.log("[DEV] Claude narrative generation simulated");
    return getDevNarrative(input);
  }

  try {
    const userPrompt = buildPrompt(input);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Claude API error:", errBody);
      return getDevNarrative(input); // Fallback to template
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    // Parse the structured response
    return parseNarrativeResponse(text, input);
  } catch (error) {
    console.error("Claude narrative generation error:", error);
    return getDevNarrative(input); // Fallback to template
  }
}

function buildPrompt(input: NarrativeInput): string {
  return `Generate personalized debt insights for this user. Return exactly 4 sections separated by "---":

Section 1 - INSIGHT BOX (1 sentence, the key motivational insight about their debt-free journey)
Section 2 - CREDIT ADVICE (3 bullet points, each a specific action they should take)
Section 3 - SMART SUGGESTION (1 sentence, a specific next step)
Section 4 - OVERALL SUMMARY (2-3 sentences, encouraging overview)

User context:
- Name: ${input.userName}
- Credit score: ${input.creditScore} (out of 900)
- Active loans: ${input.activeLoans}
- Overdue accounts: ${input.overdueCount}
- Health status: ${input.healthStatus}
- Debt-to-income ratio category: ${input.debtToIncome <= 35 ? "healthy" : input.debtToIncome <= 50 ? "moderate" : "high"}
- Recommended strategy: ${input.topStrategy}
- Can save significant interest by following the optimized plan
- Highest rate loan: ${input.highestRateLoan ? `${input.highestRateLoan.type} from ${input.highestRateLoan.lender}` : "N/A"}
- Credit utilization level: ${input.utilization > 50 ? "high" : input.utilization > 30 ? "moderate" : "low"}
- Payment history: ${input.paymentHistoryPct >= 95 ? "excellent" : input.paymentHistoryPct >= 80 ? "good" : "needs improvement"}`;
}

function parseNarrativeResponse(
  text: string,
  input: NarrativeInput
): NarrativeResult {
  const sections = text.split("---").map((s) => s.trim()).filter(Boolean);

  return {
    success: true,
    insightBox: sections[0] || getDevNarrative(input).insightBox,
    creditAdvice: sections[1]
      ? sections[1]
        .split("\n")
        .map((l) => l.replace(/^[-•*]\s*/, "").trim())
        .filter(Boolean)
        .slice(0, 3)
      : getDevNarrative(input).creditAdvice,
    smartSuggestion: sections[2] || getDevNarrative(input).smartSuggestion,
    overallSummary: sections[3] || getDevNarrative(input).overallSummary,
  };
}

/**
 * Template-based narrative for dev mode or API fallback
 */
function getDevNarrative(input: NarrativeInput): NarrativeResult {
  const overdueWarning =
    input.overdueCount > 0
      ? `You have ${input.overdueCount} overdue account${input.overdueCount > 1 ? "s" : ""} — clearing ${input.overdueCount > 1 ? "these" : "this"} first will protect your CIBIL score.`
      : "";

  return {
    success: true,
    insightBox: `By following the AI-optimized strategy, you could become debt-free sooner and save significantly on interest. ${overdueWarning}`.trim(),
    creditAdvice: [
      input.utilization > 30
        ? "Reduce your credit card utilization below 30% to improve your CIBIL score. Consider paying down card balances before other debts."
        : "Great job keeping credit utilization low — this is helping your score.",
      input.overdueCount > 0
        ? "Clear overdue payments immediately. Each month of delay can drop your score by 50-100 points."
        : "Continue making all payments on time — your consistency is your biggest asset.",
      input.highestRateLoan
        ? `Consider a balance transfer for your ${input.highestRateLoan.type}. Several banks are offering lower rates right now.`
        : "Your interest rates look competitive. Focus on extra payments to the highest-rate loan.",
    ],
    smartSuggestion:
      input.overdueCount > 0
        ? "Start by clearing your overdue account this week — even a partial payment helps."
        : "Try adding a small extra payment to your highest-rate loan this month. Even a little extra makes a big difference over time.",
    overallSummary: `${input.userName}, your financial health is ${input.healthStatus.toLowerCase()}. With ${input.activeLoans} active loans and a CIBIL score of ${input.creditScore}, you're in a ${input.creditScore >= 750 ? "strong" : input.creditScore >= 650 ? "decent" : "challenging"} position. The AI-recommended strategy can help you optimize your debt repayment journey.`,
  };
}
