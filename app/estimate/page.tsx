'use client';

import { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';

export default function EstimatePage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: '',
    county: '',
    state: '',
    clientName: '',
    clientEmail: '',
    description: ''
  });
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetPricing = async () => {
    setLoading(true);
    try {
      const getPricingData = httpsCallable(functions, 'getPricingData');
      const result = await getPricingData({
        projectType: formData.projectType,
        county: formData.county,
        state: formData.state
      });
      
      setEstimate(result.data);
      setStep(2);
    } catch (error) {
      alert('Error fetching pricing: ' + error.message);
    }
    setLoading(false);
  };

  const handleExportPDF = async () => {
    setLoading(true);
    try {
      const generatePDF = httpsCallable(functions, 'generateEstimatePDF');
      const result = await generatePDF({
        clientName: formData.clientName,
        projectDetails: {
          description: formData.description,
          location: `${formData.county}, ${formData.state}`,
          timeline: '2-3 weeks'
        },
        pricing: estimate.pricing,
        companyInfo: {
          name: 'Myers Digital Services AI',
          address: 'Brook Park, Ohio',
          phone: '(216) 716-0296',
          email: 'myersdigitalservicesai@gmail.com',
          license: 'OH-12345'
        },
        estimateNumber: `EST-${Date.now()}`
      });

      // Download PDF
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${result.data.pdf}`;
      link.download = result.data.filename;
      link.click();
    } catch (error) {
      alert('Error generating PDF: ' + error.message);
    }
    setLoading(false);
  };

  const handleEmailEstimate = async () => {
    setLoading(true);
    try {
      const sendEmail = httpsCallable(functions, 'sendEstimateEmail');
      await sendEmail({
        clientEmail: formData.clientEmail,
        clientName: formData.clientName,
        pdfBase64: estimate.pdfBase64,
        estimateNumber: `EST-${Date.now()}`,
        companyInfo: {
          name: 'MyersDigital Services AI',
          fromEmail: 'estimates@myersdigital.com',
          owner: 'Your Name',
          phone: '(555) 123-4567'
        }
      });
      alert('Estimate emailed successfully!');
    } catch (error) {
      alert('Error sending email: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Construction Estimate Generator</h1>

      {step === 1 ? (
        <div className="space-y-4">
          <input
            placeholder="Project Type (roofing, HVAC, plumbing...)"
            value={formData.projectType}
            onChange={(e) => setFormData({...formData, projectType: e.target.value})}
            className="w-full p-2 border rounded"
          />
          <input
            placeholder="County"
            value={formData.county}
            onChange={(e) => setFormData({...formData, county: e.target.value})}
            className="w-full p-2 border rounded"
          />
          <input
            placeholder="State"
            value={formData.state}
            onChange={(e) => setFormData({...formData, state: e.target.value})}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleGetPricing}
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Fetching pricing...' : 'Get Real-Time Pricing'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <input
            placeholder="Client Name"
            value={formData.clientName}
            onChange={(e) => setFormData({...formData, clientName: e.target.value})}
            className="w-full p-2 border rounded"
          />
          <input
            placeholder="Client Email"
            type="email"
            value={formData.clientEmail}
            onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Project Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border rounded"
            rows={4}
          />
          
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-bold mb-2">Estimate Summary</h3>
            <p>Total: ${estimate?.total?.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Based on real-time market pricing</p>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={loading}
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Generating PDF...' : 'Export as PDF'}
          </button>
          
          <button
            onClick={handleEmailEstimate}
            disabled={loading}
            className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Sending email...' : 'Email to Client'}
          </button>
        </div>
      )}
    </div>
  );
}
