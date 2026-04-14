const puppeteer = require('puppeteer');
const xss = require('xss');

/**
 * Generate PDF securely by sanitizing input and rendering it in a headless browser.
 * @param {Object} interviewData - The analyzed data from Gemini
 * @returns {Buffer} - PDF Buffer
 */
const generatePDF = async (interviewData) => {
  // We use xss cleanly here to absolutely ensure no javascript execution
  // within our Puppeteer environment if any input slipped through
  const safeJobDesc = xss(interviewData.jobDescription);
  const safeScore = xss(interviewData.matchScore?.toString() || '0');
  const safeSummary = xss(interviewData.summary || '');
  
  // Create an ATS Optimized HTML structure
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>ATS Optimized Resume / Interview Prep</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: auto; padding: 20px; }
        h1, h2 { color: #2c3e50; }
        .score { font-size: 24px; font-weight: bold; color: #27ae60; margin-bottom: 20px; }
        .section { margin-bottom: 25px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9; }
        .tag-list { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 10px; }
        .tag { background: #e0e7ff; color: #3730a3; padding: 5px 10px; border-radius: 4px; font-size: 14px; }
        ul { padding-left: 20px; }
      </style>
    </head>
    <body>
      <h1>AI Interview Analysis & ATS Optimization</h1>
      <div class="score">Resume Match Score: ${safeScore}%</div>
      
      <div class="section">
        <h2>Executive Summary</h2>
        <p>${safeSummary}</p>
      </div>

      <div class="section">
        <h2>Identified Skill Gaps</h2>
        <ul class="tag-list">
          ${(interviewData.skillGaps || []).map(gap => `<li class="tag">${xss(gap)}</li>`).join('')}
        </ul>
      </div>

      <div class="section">
        <h2>Suggested Technical Questions</h2>
        <ul>
          ${(interviewData.technicalQuestions || []).map(q => `<li>${xss(q)}</li>`).join('')}
        </ul>
      </div>

      <div class="section">
        <h2>Behavioral Questions</h2>
        <ul>
          ${(interviewData.behavioralQuestions || []).map(q => `<li>${xss(q)}</li>`).join('')}
        </ul>
      </div>

      <div class="section">
        <h2>Actionable Recommendations</h2>
        <ul>
          ${(interviewData.recommendations || []).map(q => `<li>${xss(q)}</li>`).join('')}
        </ul>
      </div>
    </body>
    </html>
  `;

  // Launch headless browser securely
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', // Critical for free tiers (Render/Heroku/Vercel) to avoid Memory limits
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
      '--single-process' // Also saves immense amounts of RAM in cloud environments
    ]
  });
  
  const page = await browser.newPage();
  
  // Set the HTML content onto the page
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  // Generate the PDF
  const pdfBuffer = await page.pdf({ 
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
  });

  await browser.close();

  return pdfBuffer;
};

module.exports = { generatePDF };
