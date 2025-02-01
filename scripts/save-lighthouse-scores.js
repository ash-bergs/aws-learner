/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Define __dirname for CommonJS (Node.js automatically provides it)
const prisma = new PrismaClient();

async function getReports() {
  const reportsDir = path.join(__dirname, '../.lighthouseci');

  // Get all JSON reports
  const reportFiles = fs
    .readdirSync(reportsDir)
    .filter((file) => file.endsWith('.json') && file.startsWith('lhr'))
    .map((file) => path.join(reportsDir, file));

  // Read and parse reports
  return reportFiles.map((file) => JSON.parse(fs.readFileSync(file, 'utf8')));
}

function aggregateReports(reports) {
  const groupedReports = {};

  reports.forEach((report) => {
    const url = report.finalUrl;

    if (!groupedReports[url]) {
      groupedReports[url] = {
        performance: 0,
        accessibility: 0,
        bestPractices: 0,
        seo: 0,
        count: 0,
      };
    }

    groupedReports[url].performance +=
      report.categories.performance.score * 100;
    groupedReports[url].accessibility +=
      report.categories.accessibility.score * 100;
    groupedReports[url].bestPractices +=
      report.categories['best-practices'].score * 100;
    groupedReports[url].seo += report.categories.seo.score * 100;
    groupedReports[url].count += 1;
  });

  for (const url in groupedReports) {
    const data = groupedReports[url];
    groupedReports[url] = {
      performance: data.performance / data.count,
      accessibility: data.accessibility / data.count,
      bestPractices: data.bestPractices / data.count,
      seo: data.seo / data.count,
    };
  }

  return groupedReports;
}

async function saveScoresToDatabase(aggregatedData) {
  for (const [url, scores] of Object.entries(aggregatedData)) {
    await prisma.lighthouseScore.create({
      data: {
        url,
        performance: scores.performance,
        accessibility: scores.accessibility,
        bestPractices: scores.bestPractices,
        seo: scores.seo,
      },
    });
  }

  console.log('Lighthouse scores saved successfully.');
}

async function main() {
  const reports = await getReports();
  const aggregatedData = aggregateReports(reports);
  await saveScoresToDatabase(aggregatedData);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
