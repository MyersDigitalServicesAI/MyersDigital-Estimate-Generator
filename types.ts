
export enum ProjectType {
  RESIDENTIAL = 'Residential',
  COMMERCIAL = 'Commercial'
}

export enum ProjectScale {
  SMALL = 'Small / Install',
  MEDIUM = 'Medium / Reno',
  LARGE = 'Large / Structural'
}

export enum ProjectTimeline {
  STANDARD = 'Standard (3-4 weeks)',
  RUSH = 'Rush (1-2 weeks)',
  EXTENDED = 'Extended (8+ weeks)'
}

export enum Step {
  INTAKE = 'intake',
  CLARIFY = 'clarify',
  PROCESSING = 'processing',
  RESULT = 'result'
}

export interface LineItem {
  name: string;
  qty: number;
  unit: string;
  rate: number;
  total: number;
}

export interface StrategicInsight {
  type: 'risk' | 'rag' | 'market' | 'vision';
  title: string;
  text: string;
  impact: 'low' | 'medium' | 'high';
}

export interface VisionAnalysis {
  documentType: 'blueprint' | 'receipt' | 'chart' | 'specification' | 'other';
  summary: string;
  extractedItems?: { name: string; qty: number; unit: string; rate: number }[];
  detectedSize?: string;
  detectedLocation?: string;
  detectedProjectType?: string;
}

export interface EstimateResult {
  materials: LineItem[];
  labor: LineItem;
  insights: StrategicInsight[];
  regionalMultiplier: number;
  marketConfidence: number;
  riskScore: number; // 0-100
  overheadEstimate: number;
}

export interface ProjectData {
  scope: string;
  projectType: ProjectType;
  projectScale: ProjectScale;
  timeline: ProjectTimeline;
  location: string;
  size: string;
  description: string;
  customItems: { name: string; qty: number; unit: string; rate: number }[];
  blueprintImage?: string; // base64
  visionAnalysis?: VisionAnalysis;
}
