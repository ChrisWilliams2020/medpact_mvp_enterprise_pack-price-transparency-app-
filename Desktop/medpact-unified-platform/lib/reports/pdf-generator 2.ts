import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ReportData {
  title: string;
  generatedDate: string;
  practice: {
    name: string;
    address: string;
    phone: string;
  };
  summary: {
    totalRevenue: number;
    totalPatients: number;
    avgReimbursement: number;
    payorCount: number;
  };
  payorBreakdown: Array<{
    payor: string;
    patients: number;
    revenue: number;
    percentage: number;
  }>;
  performanceMetrics?: {
    patientSatisfaction: number;
    cleanClaimRate: number;
    denialRate: number;
    avgWaitTime: number;
  };
  recommendations?: string[];
}

export function generatePDFReport(data: ReportData): jsPDF {
  const doc = new jsPDF();
  let yPosition = 20;

  // Header
  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235);
  doc.text(data.title, 105, yPosition, { align: 'center' });
  
  yPosition += 10;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${data.generatedDate}`, 105, yPosition, { align: 'center' });

  // Practice Info
  yPosition += 15;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Practice Information', 20, yPosition);
  
  yPosition += 7;
  doc.setFontSize(10);
  doc.text(data.practice.name, 20, yPosition);
  yPosition += 5;
  doc.text(data.practice.address, 20, yPosition);
  yPosition += 5;
  doc.text(data.practice.phone, 20, yPosition);

  // Summary Section
  yPosition += 15;
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text('Financial Summary', 20, yPosition);

  yPosition += 10;
  const summaryData = [
    ['Total Annual Revenue', `$${data.summary.totalRevenue.toLocaleString()}`],
    ['Total Patients', data.summary.totalPatients.toLocaleString()],
    ['Average Reimbursement', `$${data.summary.avgReimbursement.toFixed(2)}`],
    ['Active Payors', data.summary.payorCount.toString()],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['Metric', 'Value']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 20, right: 20 },
  });

  // Payor Breakdown
  yPosition = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text('Payor Mix Breakdown', 20, yPosition);

  yPosition += 10;
  const payorData = data.payorBreakdown.map(p => [
    p.payor,
    p.patients.toLocaleString(),
    `$${p.revenue.toLocaleString()}`,
    `${p.percentage.toFixed(1)}%`,
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [['Payor', 'Patients', 'Revenue', '% of Total']],
    body: payorData,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 20, right: 20 },
  });

  if (data.performanceMetrics) {
    yPosition = (doc as any).lastAutoTable.finalY + 15;
    
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235);
    doc.text('Performance Metrics', 20, yPosition);

    yPosition += 10;
    const metricsData = [
      ['Patient Satisfaction', `${data.performanceMetrics.patientSatisfaction}%`],
      ['Clean Claim Rate', `${data.performanceMetrics.cleanClaimRate}%`],
      ['Denial Rate', `${data.performanceMetrics.denialRate}%`],
      ['Average Wait Time', `${data.performanceMetrics.avgWaitTime} minutes`],
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [['Metric', 'Value']],
      body: metricsData,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
      margin: { left: 20, right: 20 },
    });
  }

  if (data.recommendations && data.recommendations.length > 0) {
    yPosition = (doc as any).lastAutoTable.finalY + 15;
    
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235);
    doc.text('AI Recommendations', 20, yPosition);

    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    data.recommendations.forEach((rec, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`${index + 1}. ${rec}`, 25, yPosition, { maxWidth: 160 });
      yPosition += 7;
    });
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} | MedPact Analytics Report`,
      105,
      290,
      { align: 'center' }
    );
  }

  return doc;
}
