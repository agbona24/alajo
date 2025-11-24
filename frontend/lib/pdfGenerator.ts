import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable
    lastAutoTable: { finalY: number }
  }
}

interface Contribution {
  id: number
  amount: number
  status: string
  payment_method: string
  reference: string
  created_at: string
  completed_at?: string
  notes?: string
}

interface Withdrawal {
  id: number
  amount: number
  status: string
  reference: string
  bank_account?: {
    bank_name: string
    account_number: string
    account_name: string
  }
  created_at: string
  processed_at?: string
  reason?: string
}

interface Transaction {
  id: number
  type: string
  amount: number
  status: string
  reference: string
  description?: string
  balance_before?: number
  balance_after?: number
  created_at: string
}

interface SavingsPlan {
  id: number
  name: string
  emoji: string
  current_amount: number
  target_amount: number
  daily_contribution: number
  frequency: string
  status: string
  start_date: string
  target_date: string
  contributions?: Contribution[]
  withdrawals?: Withdrawal[]
}

interface PassbookRecord {
  day: number
  date: string
  day_name: string
  amount: number
  status: string
}

interface UserInfo {
  name: string
  phone: string
  email?: string
}

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(Number(amount) || 0)
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Helper to add header to PDF
const addHeader = (doc: jsPDF, title: string, subtitle?: string) => {
  // Header background
  doc.setFillColor(102, 126, 234) // Purple gradient start
  doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F')

  // Company name
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('Alajo', 14, 18)

  // Subtitle
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Digital Savings Platform', 14, 26)

  // Report title
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(title, doc.internal.pageSize.width - 14, 18, { align: 'right' })

  if (subtitle) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(subtitle, doc.internal.pageSize.width - 14, 26, { align: 'right' })
  }

  // Generated date
  doc.setFontSize(8)
  doc.text(`Generated: ${new Date().toLocaleString('en-NG')}`, doc.internal.pageSize.width - 14, 34, { align: 'right' })

  return 50 // Return Y position after header
}

// Helper to add footer
const addFooter = (doc: jsPDF) => {
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(
      `Page ${i} of ${pageCount} | Alajo - Save Smarter`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    )
  }
}

/**
 * Generate Statement of Contributions PDF
 */
export const generateContributionStatement = (
  plan: SavingsPlan,
  contributions: Contribution[],
  user: UserInfo
): void => {
  const doc = new jsPDF()

  let yPos = addHeader(doc, 'Statement of Contributions', plan.name)

  // User Info Section
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Account Holder', 14, yPos)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Name: ${user.name}`, 14, yPos + 7)
  doc.text(`Phone: ${user.phone}`, 14, yPos + 14)
  if (user.email) {
    doc.text(`Email: ${user.email}`, 14, yPos + 21)
  }

  // Plan Summary
  doc.setFont('helvetica', 'bold')
  doc.text('Plan Summary', 110, yPos)

  doc.setFont('helvetica', 'normal')
  doc.text(`Plan: ${plan.emoji} ${plan.name}`, 110, yPos + 7)
  doc.text(`Daily Amount: ${formatCurrency(plan.daily_contribution)}`, 110, yPos + 14)
  doc.text(`Current Balance: ${formatCurrency(plan.current_amount)}`, 110, yPos + 21)
  doc.text(`Target: ${formatCurrency(plan.target_amount)}`, 110, yPos + 28)

  yPos += 45

  // Summary Stats Box
  const totalContributed = contributions
    .filter(c => c.status === 'completed')
    .reduce((sum, c) => sum + Number(c.amount), 0)
  const pendingAmount = contributions
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + Number(c.amount), 0)

  doc.setFillColor(240, 240, 250)
  doc.roundedRect(14, yPos, doc.internal.pageSize.width - 28, 25, 3, 3, 'F')

  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  doc.text('Total Contributions', 25, yPos + 10)
  doc.text('Pending', 80, yPos + 10)
  doc.text('Approved', 130, yPos + 10)
  doc.text('Progress', 175, yPos + 10)

  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  doc.text(contributions.length.toString(), 25, yPos + 19)
  doc.text(formatCurrency(pendingAmount), 80, yPos + 19)
  doc.setTextColor(34, 197, 94) // Green
  doc.text(formatCurrency(totalContributed), 130, yPos + 19)
  doc.setTextColor(102, 126, 234) // Purple
  const progress = plan.target_amount > 0 ? Math.round((plan.current_amount / plan.target_amount) * 100) : 0
  doc.text(`${progress}%`, 175, yPos + 19)

  yPos += 35

  // Contributions Table
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Contribution History', 14, yPos)

  const tableData = contributions.map(c => [
    formatDate(c.created_at),
    c.reference,
    formatCurrency(c.amount),
    c.payment_method.replace('_', ' ').toUpperCase(),
    c.status.toUpperCase(),
    c.completed_at ? formatDate(c.completed_at) : '-'
  ])

  autoTable(doc, {
    startY: yPos + 5,
    head: [['Date', 'Reference', 'Amount', 'Method', 'Status', 'Confirmed']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [102, 126, 234],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 35 },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 30 },
      4: { cellWidth: 25 },
      5: { cellWidth: 25 }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  })

  addFooter(doc)
  doc.save(`Alajo_Contributions_${plan.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`)
}

/**
 * Generate Withdrawal History PDF
 */
export const generateWithdrawalHistory = (
  withdrawals: Withdrawal[],
  user: UserInfo,
  planName?: string
): void => {
  const doc = new jsPDF()

  let yPos = addHeader(doc, 'Withdrawal History', planName || 'All Plans')

  // User Info
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Account Holder', 14, yPos)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Name: ${user.name}`, 14, yPos + 7)
  doc.text(`Phone: ${user.phone}`, 14, yPos + 14)

  // Summary
  const totalWithdrawn = withdrawals
    .filter(w => w.status === 'completed')
    .reduce((sum, w) => sum + Number(w.amount), 0)
  const pendingWithdrawals = withdrawals
    .filter(w => w.status === 'pending')
    .reduce((sum, w) => sum + Number(w.amount), 0)

  doc.setFont('helvetica', 'bold')
  doc.text('Summary', 110, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(`Total Withdrawn: ${formatCurrency(totalWithdrawn)}`, 110, yPos + 7)
  doc.text(`Pending: ${formatCurrency(pendingWithdrawals)}`, 110, yPos + 14)
  doc.text(`Total Requests: ${withdrawals.length}`, 110, yPos + 21)

  yPos += 40

  // Withdrawals Table
  const tableData = withdrawals.map(w => [
    formatDate(w.created_at),
    w.reference,
    formatCurrency(w.amount),
    w.bank_account ? `${w.bank_account.bank_name} - ${w.bank_account.account_number}` : 'N/A',
    w.status.toUpperCase(),
    w.processed_at ? formatDate(w.processed_at) : '-'
  ])

  autoTable(doc, {
    startY: yPos,
    head: [['Date', 'Reference', 'Amount', 'Bank Account', 'Status', 'Processed']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [234, 88, 12], // Orange
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 30 },
      2: { cellWidth: 25, halign: 'right' },
      3: { cellWidth: 45 },
      4: { cellWidth: 22 },
      5: { cellWidth: 25 }
    },
    alternateRowStyles: {
      fillColor: [255, 251, 235]
    }
  })

  addFooter(doc)
  doc.save(`Alajo_Withdrawals_${new Date().toISOString().split('T')[0]}.pdf`)
}

/**
 * Generate Transaction History PDF
 */
export const generateTransactionHistory = (
  transactions: Transaction[],
  user: UserInfo
): void => {
  const doc = new jsPDF()

  let yPos = addHeader(doc, 'Transaction History', 'All Transactions')

  // User Info
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Account Holder', 14, yPos)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Name: ${user.name}`, 14, yPos + 7)
  doc.text(`Phone: ${user.phone}`, 14, yPos + 14)

  // Summary
  const credits = transactions
    .filter(t => t.type === 'contribution' && t.status === 'completed')
    .reduce((sum, t) => sum + Number(t.amount), 0)
  const debits = transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  doc.setFont('helvetica', 'bold')
  doc.text('Summary', 110, yPos)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(34, 197, 94)
  doc.text(`Total Credits: ${formatCurrency(credits)}`, 110, yPos + 7)
  doc.setTextColor(239, 68, 68)
  doc.text(`Total Debits: ${formatCurrency(debits)}`, 110, yPos + 14)
  doc.setTextColor(0, 0, 0)
  doc.text(`Net: ${formatCurrency(credits - debits)}`, 110, yPos + 21)

  yPos += 40

  // Transactions Table
  const tableData = transactions.map(t => [
    formatDate(t.created_at),
    t.reference,
    t.type.toUpperCase(),
    t.type === 'withdrawal' ? `-${formatCurrency(t.amount)}` : `+${formatCurrency(t.amount)}`,
    t.status.toUpperCase(),
    t.description || '-'
  ])

  autoTable(doc, {
    startY: yPos,
    head: [['Date', 'Reference', 'Type', 'Amount', 'Status', 'Description']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [59, 130, 246], // Blue
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 30 },
      2: { cellWidth: 25 },
      3: { cellWidth: 28, halign: 'right' },
      4: { cellWidth: 22 },
      5: { cellWidth: 42 }
    },
    alternateRowStyles: {
      fillColor: [239, 246, 255]
    },
    didParseCell: function(data) {
      if (data.column.index === 3 && data.section === 'body') {
        const text = data.cell.text[0] || ''
        if (text.startsWith('-')) {
          data.cell.styles.textColor = [239, 68, 68]
        } else if (text.startsWith('+')) {
          data.cell.styles.textColor = [34, 197, 94]
        }
      }
    }
  })

  addFooter(doc)
  doc.save(`Alajo_Transactions_${new Date().toISOString().split('T')[0]}.pdf`)
}

/**
 * Generate Passbook PDF
 */
export const generatePassbookPDF = (
  plan: SavingsPlan,
  passbookData: {
    month_name: string
    daily_status: PassbookRecord[]
    summary: {
      total_paid: number
      days_paid: number
      days_remaining: number
      expected_total: number
      completion_rate: number
    }
  },
  user: UserInfo
): void => {
  const doc = new jsPDF()

  let yPos = addHeader(doc, 'Passbook Statement', `${passbookData.month_name}`)

  // User & Plan Info
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Account Holder', 14, yPos)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Name: ${user.name}`, 14, yPos + 7)
  doc.text(`Phone: ${user.phone}`, 14, yPos + 14)

  doc.setFont('helvetica', 'bold')
  doc.text('Savings Plan', 110, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(`${plan.emoji} ${plan.name}`, 110, yPos + 7)
  doc.text(`Daily Amount: ${formatCurrency(plan.daily_contribution)}`, 110, yPos + 14)

  yPos += 30

  // Monthly Summary Box
  doc.setFillColor(236, 253, 245) // Green tint
  doc.roundedRect(14, yPos, doc.internal.pageSize.width - 28, 30, 3, 3, 'F')

  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  doc.text('Days Paid', 25, yPos + 10)
  doc.text('Days Remaining', 65, yPos + 10)
  doc.text('Total Paid', 115, yPos + 10)
  doc.text('Completion', 165, yPos + 10)

  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  doc.text(`${passbookData.summary.days_paid}`, 25, yPos + 22)
  doc.text(`${passbookData.summary.days_remaining}`, 65, yPos + 22)
  doc.setTextColor(34, 197, 94)
  doc.text(formatCurrency(passbookData.summary.total_paid), 115, yPos + 22)
  doc.setTextColor(102, 126, 234)
  doc.text(`${passbookData.summary.completion_rate}%`, 165, yPos + 22)

  yPos += 45

  // Passbook Grid Table
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Daily Records', 14, yPos)

  const tableData = passbookData.daily_status.map(record => [
    record.day.toString(),
    record.day_name,
    record.date,
    formatCurrency(record.amount),
    record.status.toUpperCase()
  ])

  autoTable(doc, {
    startY: yPos + 5,
    head: [['Day', 'Day', 'Date', 'Amount', 'Status']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [102, 126, 234],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8,
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 20 },
      2: { cellWidth: 30 },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 30 }
    },
    didParseCell: function(data) {
      if (data.column.index === 4 && data.section === 'body') {
        const status = data.cell.text[0]
        if (status === 'PAID') {
          data.cell.styles.fillColor = [220, 252, 231]
          data.cell.styles.textColor = [22, 163, 74]
        } else if (status === 'MISSED') {
          data.cell.styles.fillColor = [254, 226, 226]
          data.cell.styles.textColor = [220, 38, 38]
        } else {
          data.cell.styles.fillColor = [254, 249, 195]
          data.cell.styles.textColor = [161, 98, 7]
        }
      }
    }
  })

  addFooter(doc)
  doc.save(`Alajo_Passbook_${plan.name.replace(/\s+/g, '_')}_${passbookData.month_name.replace(/\s+/g, '_')}.pdf`)
}

/**
 * Generate Complete Account Statement PDF
 */
export const generateAccountStatement = (
  plans: SavingsPlan[],
  transactions: Transaction[],
  user: UserInfo,
  dateRange?: { from: string; to: string }
): void => {
  const doc = new jsPDF()

  const subtitle = dateRange
    ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
    : 'Complete Statement'

  let yPos = addHeader(doc, 'Account Statement', subtitle)

  // User Info
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Account Holder', 14, yPos)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Name: ${user.name}`, 14, yPos + 7)
  doc.text(`Phone: ${user.phone}`, 14, yPos + 14)
  if (user.email) {
    doc.text(`Email: ${user.email}`, 14, yPos + 21)
  }

  // Account Summary
  const totalSavings = plans.reduce((sum, p) => sum + Number(p.current_amount || 0), 0)
  const totalTarget = plans.reduce((sum, p) => sum + Number(p.target_amount || 0), 0)

  doc.setFont('helvetica', 'bold')
  doc.text('Account Summary', 110, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(`Active Plans: ${plans.filter(p => p.status === 'active').length}`, 110, yPos + 7)
  doc.text(`Total Savings: ${formatCurrency(totalSavings)}`, 110, yPos + 14)
  doc.text(`Total Targets: ${formatCurrency(totalTarget)}`, 110, yPos + 21)

  yPos += 40

  // Plans Table
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Savings Plans', 14, yPos)

  const plansData = plans.map(p => [
    `${p.emoji} ${p.name}`,
    formatCurrency(p.daily_contribution),
    formatCurrency(p.current_amount),
    formatCurrency(p.target_amount),
    `${Math.round((Number(p.current_amount) / Number(p.target_amount || 1)) * 100)}%`,
    p.status.toUpperCase()
  ])

  autoTable(doc, {
    startY: yPos + 5,
    head: [['Plan', 'Daily', 'Balance', 'Target', 'Progress', 'Status']],
    body: plansData,
    theme: 'striped',
    headStyles: {
      fillColor: [102, 126, 234],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8
    }
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Recent Transactions
  if (transactions.length > 0) {
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Recent Transactions', 14, yPos)

    const recentTransactions = transactions.slice(0, 20).map(t => [
      formatDate(t.created_at),
      t.type.toUpperCase(),
      t.type === 'withdrawal' ? `-${formatCurrency(t.amount)}` : `+${formatCurrency(t.amount)}`,
      t.status.toUpperCase(),
      t.reference
    ])

    autoTable(doc, {
      startY: yPos + 5,
      head: [['Date', 'Type', 'Amount', 'Status', 'Reference']],
      body: recentTransactions,
      theme: 'striped',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8
      },
      didParseCell: function(data) {
        if (data.column.index === 2 && data.section === 'body') {
          const text = data.cell.text[0] || ''
          if (text.startsWith('-')) {
            data.cell.styles.textColor = [239, 68, 68]
          } else if (text.startsWith('+')) {
            data.cell.styles.textColor = [34, 197, 94]
          }
        }
      }
    })
  }

  addFooter(doc)
  doc.save(`Alajo_Account_Statement_${new Date().toISOString().split('T')[0]}.pdf`)
}
