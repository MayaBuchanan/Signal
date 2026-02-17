import { AppData, Relationship, Interaction } from './types';

const STORAGE_KEY = 'signal-app-data';
const CURRENT_VERSION = 1;

const defaultData: AppData = {
  relationships: [],
  interactions: [],
  version: CURRENT_VERSION
};

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { ...defaultData };
    }
    
    const parsed = JSON.parse(stored) as AppData;
    
    // Schema versioning - migrate if needed
    if (!parsed.version || parsed.version < CURRENT_VERSION) {
      // Add migration logic here when needed
      parsed.version = CURRENT_VERSION;
    }
    
    // Ensure all required fields exist
    return {
      relationships: parsed.relationships || [],
      interactions: parsed.interactions || [],
      version: parsed.version || CURRENT_VERSION
    };
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return { ...defaultData };
  }
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

export const saveRelationships = (relationships: Relationship[]): void => {
  const data = loadData();
  data.relationships = relationships;
  data.version = CURRENT_VERSION;
  saveData(data);
};

export const saveInteractions = (interactions: Interaction[]): void => {
  const data = loadData();
  data.interactions = interactions;
  data.version = CURRENT_VERSION;
  saveData(data);
};

export const getRelationships = (): Relationship[] => {
  return loadData().relationships;
};

export const getInteractions = (): Interaction[] => {
  return loadData().interactions;
};

export const getInteractionsByRelationshipId = (relationshipId: string): Interaction[] => {
  return loadData().interactions.filter(i => i.relationshipId === relationshipId);
};
