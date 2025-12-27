// Professional PDF Generator for Construction Estimates
// Uses jsPDF for client-side PDF generation

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export interface EstimateData {
  estimateNumber: string
  clientName: string
  clientEmail?: string
  projectType: string
  county: string
  state: string
  projectSize: string
  projectDescription?: string
  lineItems: Array<{
    desc: string
    qty: number
    rate: number
    total: number
  }>
  subtotal: number
  tax: number
  total: number
  competitorData?: {
    min: number
    max: number
    avg: number
  }
  createdAt?: string
}

export async function generatePDF(data: EstimateData): Promise<Blob> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' })
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  // Header
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(37, 99, 235)
  doc.text('MyersDigital Services AI', 20, y)
  y += 6
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text('Brook Park, OH | (216) 716-0296', 20, y)

  // Estimate Title
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('ESTIMATE', pageWidth - 20, 20, { align: 'right' })
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`#${data.estimateNumber}`, pageWidth - 20, 27, { align: 'right' })
  doc.text(new Date().toLocaleDateString(), pageWidth - 20, 33, { align: 'right' })

  y = 50
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('PREPARED FOR:', 20, y)
  y += 7
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(data.clientName, 20, y)
  if (data.clientEmail) {
    y += 5
    doc.text(data.clientEmail, 20, y)
  }

  y += 10
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('PROJECT:', 20, y)
  y += 7
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`${data.projectType.toUpperCase()} | ${data.county}, ${data.state}`, 20, y)

  // Table
  y += 10
  const tableData = data.lineItems.map(item => [
    item.desc,
    item.qty.toString(),
    `$${item.rate.toFixed(2)}`,
    `$${item.total.toFixed(2)}`
  ])

  autoTable(doc, {
    startY: y,
    head: [['Description', 'Qty', 'Rate', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] }
  })

  y = (doc as any).lastAutoTable.finalY + 10
  const totalsX = pageWidth - 75

  doc.setFontSize(10)
  doc.text('Subtotal:', totalsX, y, { align: 'right' })
  doc.text(`$${data.subtotal.toFixed(2)}`, pageWidth - 20, y, { align: 'right' })
  y += 6
  doc.text('Tax:', totalsX, y, { align: 'right' })
  doc.text(`$${data.tax.toFixed(2)}`, pageWidth - 20, y, { align: 'right' })
  y += 8
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL:', totalsX, y, { align: 'right' })
  doc.text(`$${data.total.toFixed(2)}`, pageWidth - 20, y, { align: 'right' })

  return doc.output('blob')
}

export async function downloadPDF(data: EstimateData): Promise<void> {
  const blob = await generatePDF(data)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `estimate-${data.estimateNumber}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function getPDFBase64(data: EstimateData): Promise<string> {
  const blob = await generatePDF(data)
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
