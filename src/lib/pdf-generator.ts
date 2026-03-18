/**
 * PDF Report Generator
 * Generates downloadable PDF reports for credit analysis
 *
 * Uses jsPDF for server-side PDF generation (no React dependency)
 * Install: npm install jspdf
 *
 * Alternative: Use the browser's built-in print-to-PDF for client-side
 */

interface PDFReportData {
  userName: string;
  generatedAt: string;
  creditScore: number;
  debtSnapshot: {
    totalDebt: number;
    monthlyEMI: number;
    activeLoans: number;
    debtToIncome: number;
    healthStatus: string;
  };
  debtFreeTimeline: {
    currentPayoff: string;
    optimizedPayoff: string;
    monthsSaved: number;
    totalSaved: number;
  };
  strategies: {
    id: string;
    label: string;
    loans: { name: string; apr: number; balance: number }[];
  }[];
  creditHealth: {
    utilization: { value: number; status: string };
    paymentHistory: { value: number; status: string };
    accountMix: { value: number; status: string };
  };
  narrativeText: string;
}

/**
 * Generate a PDF report as a downloadable Blob URL (client-side)
 * This creates an HTML-based PDF using the browser's print functionality
 */
export function generatePDFHTML(data: PDFReportData): string {
  const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Debto AI Debt Analysis Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1B2A4A; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { text-align: center; padding: 30px 0; border-bottom: 3px solid #1B2A4A; margin-bottom: 30px; }
    .header h1 { font-size: 28px; color: #1B2A4A; }
    .header .subtitle { color: #666; font-size: 14px; margin-top: 5px; }
    .section { margin-bottom: 30px; page-break-inside: avoid; }
    .section h2 { font-size: 18px; color: #1B2A4A; border-left: 4px solid #FF6B00; padding-left: 12px; margin-bottom: 15px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px; }
    .stat-card { background: #f8f9fc; border-radius: 8px; padding: 15px; }
    .stat-card .label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-card .value { font-size: 24px; font-weight: 700; color: #1B2A4A; margin-top: 4px; }
    .stat-card .sub { font-size: 12px; color: #888; }
    .score-badge { display: inline-block; background: #1B2A4A; color: white; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; }
    .insight-box { background: #1B2A4A; color: white; padding: 20px; border-radius: 12px; margin: 15px 0; }
    .insight-box p { color: rgba(255,255,255,0.9); font-size: 14px; }
    .strategy-loan { background: #f8f9fc; padding: 12px 15px; border-radius: 8px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
    .strategy-loan .name { font-weight: 600; font-size: 14px; }
    .strategy-loan .details { font-size: 13px; color: #666; }
    .footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; margin-top: 40px; color: #999; font-size: 12px; }
    .disclaimer { background: #fff8f0; border: 1px solid #ffe0b2; border-radius: 8px; padding: 15px; font-size: 12px; color: #795548; margin-top: 20px; }
    @media print { body { padding: 20px; } .section { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏦 Debto AI Debt Analysis</h1>
    <p class="subtitle">Personalized Report for ${data.userName} • Generated ${new Date(data.generatedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
  </div>

  <div class="section">
    <h2>Credit Score</h2>
    <p style="text-align:center; margin: 15px 0;">
      <span class="score-badge">CIBIL Score: ${data.creditScore} / 900</span>
    </p>
  </div>

  <div class="section">
    <h2>Debt Snapshot</h2>
    <div class="grid">
      <div class="stat-card">
        <div class="label">Total Outstanding Debt</div>
        <div class="value">${formatINR(data.debtSnapshot.totalDebt)}</div>
      </div>
      <div class="stat-card">
        <div class="label">Monthly EMI Burden</div>
        <div class="value">${formatINR(data.debtSnapshot.monthlyEMI)}</div>
      </div>
      <div class="stat-card">
        <div class="label">Active Accounts</div>
        <div class="value">${data.debtSnapshot.activeLoans}</div>
      </div>
      <div class="stat-card">
        <div class="label">Debt-to-Income Ratio</div>
        <div class="value">${data.debtSnapshot.debtToIncome}%</div>
        <div class="sub">${data.debtSnapshot.healthStatus}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Debt-Free Timeline</h2>
    <div class="grid">
      <div class="stat-card">
        <div class="label">Current Payoff Date</div>
        <div class="value" style="font-size:18px">${data.debtFreeTimeline.currentPayoff}</div>
      </div>
      <div class="stat-card">
        <div class="label">Optimized Payoff Date</div>
        <div class="value" style="font-size:18px; color:#2E75B6">${data.debtFreeTimeline.optimizedPayoff}</div>
      </div>
    </div>
    <div class="insight-box">
      <p>⚡ By following the AI-optimized strategy, you could become debt-free <strong>${data.debtFreeTimeline.monthsSaved} months earlier</strong> and save approximately <strong>${formatINR(data.debtFreeTimeline.totalSaved)}</strong> in interest.</p>
    </div>
  </div>

  <div class="section">
    <h2>AI-Recommended Strategy</h2>
    ${data.strategies
      .filter((s) => s.id === "ai")
      .map(
        (s) =>
          s.loans
            .map(
              (l, i) =>
                `<div class="strategy-loan">
                  <div>
                    <div class="name">${i === 0 ? "🎯 " : ""}${l.name}</div>
                    <div class="details">${l.apr}% APR • Balance: ${formatINR(l.balance)}</div>
                  </div>
                  ${i === 0 ? '<span style="background:#FF6B00;color:white;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:600">PAY FIRST</span>' : ""}
                </div>`
            )
            .join("")
      )
      .join("")}
  </div>

  <div class="section">
    <h2>Credit Health Factors</h2>
    <div class="grid">
      <div class="stat-card">
        <div class="label">Credit Utilization</div>
        <div class="value">${data.creditHealth.utilization.value}%</div>
        <div class="sub">${data.creditHealth.utilization.status}</div>
      </div>
      <div class="stat-card">
        <div class="label">Payment History</div>
        <div class="value">${data.creditHealth.paymentHistory.value}%</div>
        <div class="sub">${data.creditHealth.paymentHistory.status}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>AI Insights</h2>
    <p style="font-size:14px; color:#444;">${data.narrativeText}</p>
  </div>

  <div class="disclaimer">
    <strong>Disclaimer:</strong> This report is generated by Debto's AI analysis engine for informational purposes only. It does not constitute financial advice. All financial calculations are based on the data available at the time of generation. Debto is not a registered financial advisor. Please consult a certified financial planner before making major financial decisions.
  </div>

  <div class="footer">
    <p>Generated by Debto AI Debt Management Platform</p>
    <p>debto.in • Confidential</p>
  </div>
</body>
</html>`;

  return html;
}

/**
 * Trigger browser print dialog for PDF download
 */
export function printPDF(data: PDFReportData) {
  const html = generatePDFHTML(data);
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  }
}
