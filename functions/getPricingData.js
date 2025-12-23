const functions = require('firebase-functions');
const axios = require('axios');

exports.getPricingData = functions.https.onCall(async (data, context) => {
  const { projectType, county, state } = data;
  
  // Call 1build API for real-time pricing
  const response = await axios.post(
    'https://api.1build.com/v1/estimate',
    {
      projectType: projectType,      // "roofing", "hvac", etc.
      location: {
        county: county,
        state: state
      },
      fetchCompetitorData: true       // Get what competitors charge
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.ONEBUILD_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return {
    materialCosts: response.data.materials,
    laborCosts: response.data.labor,
    equipmentCosts: response.data.equipment,
    competitorRates: response.data.marketComparison,
    timestamp: new Date()
  };
});
