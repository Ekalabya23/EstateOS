import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

export const generateIncomeStatement = (properties: any[], transactions: any[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Annual Income Statement', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${format(new Date(), 'PPpp')}`, 14, 30);
  
  // Calculate totals
  let totalIncome = 0;
  let totalExpenses = 0;
  
  transactions.forEach(t => {
    if (t.type === 'income') totalIncome += t.amount;
    if (t.type === 'expense') totalExpenses += t.amount;
  });
  
  const netIncome = totalIncome - totalExpenses;

  // Summary Table
  autoTable(doc, {
    startY: 40,
    head: [['Financial Summary', 'Amount']],
    body: [
      ['Total Rental Income', formatCurrency(totalIncome)],
      ['Total Operating Expenses', formatCurrency(totalExpenses)],
      ['Net Operating Income (NOI)', formatCurrency(netIncome)],
    ],
    theme: 'grid',
    headStyles: { fillColor: [44, 44, 44] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  // Properties Breakdown
  const propertyData = properties.map(p => [
    p.title,
    p.city,
    p.status,
    formatCurrency(p.price)
  ]);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['Property', 'Location', 'Status', 'Valuation']],
    body: propertyData,
    theme: 'striped',
    headStyles: { fillColor: [180, 160, 120] } // Champagne color
  });

  doc.save(`Income_Statement_${format(new Date(), 'yyyy')}.pdf`);
};

export const generateTenantLedger = (tenant: any, transactions: any[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Tenant Ledger', 14, 22);
  
  doc.setFontSize(12);
  doc.text(`Tenant: ${tenant.firstName} ${tenant.lastName}`, 14, 32);
  doc.text(`Property: ${tenant.property?.title || 'Unknown'}`, 14, 40);
  
  const tableData = transactions.map(t => [
    format(new Date(t.date), 'MMM dd, yyyy'),
    t.description,
    t.type === 'income' ? 'Charge' : 'Payment',
    formatCurrency(t.amount)
  ]);

  autoTable(doc, {
    startY: 50,
    head: [['Date', 'Description', 'Type', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [44, 44, 44] },
  });

  doc.save(`Tenant_Ledger_${tenant.firstName}.pdf`);
};

export const generatePortfolioSummary = (stats: any) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Portfolio Summary', 14, 22);
  
  autoTable(doc, {
    startY: 35,
    head: [['Metric', 'Value']],
    body: [
      ['Total Properties', stats.totalProperties?.toString() || '0'],
      ['Total Portfolio Value', formatCurrency(stats.totalValue || 0)],
      ['Monthly Yield', formatCurrency(stats.monthlyYield || 0)],
      ['Annual Yield %', `${stats.annualYieldPercent || 0}%`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [180, 160, 120] },
  });

  doc.save('Portfolio_Summary.pdf');
};
