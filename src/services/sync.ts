import { apiClient } from '../api/client';
import { loadData, saveData, getAuditLog } from '../storage';

interface SyncStatus {
  lastSync: string | null;
  isSyncing: boolean;
}

class SyncService {
  private syncStatus: SyncStatus = {
    lastSync: localStorage.getItem('last-sync'),
    isSyncing: false,
  };

  private listeners: Array<(status: SyncStatus) => void> = [];

  onStatusChange(callback: (status: SyncStatus) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb(this.syncStatus));
  }

  private updateStatus(updates: Partial<SyncStatus>) {
    this.syncStatus = { ...this.syncStatus, ...updates };
    this.notifyListeners();
  }

  /**
   * Sync data from cloud to local storage
   */
  async syncFromCloud(): Promise<void> {
    try {
      this.updateStatus({ isSyncing: true });

      // Fetch all data from API
      const [relationships, interactions] = await Promise.all([
        apiClient.getRelationships(),
        apiClient.getInteractions(),
      ]);

      // Convert MongoDB _id to id for frontend compatibility
      const normalizedRelationships = relationships.map((r: any) => ({
        id: r._id,
        name: r.name,
        organization: r.organization,
        industry: r.industry || '',
        region: r.region || '',
        stage: r.stage,
        owner: r.owner || '',
        notes: r.notes || '',
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        // New BDR fields — safe defaults if not present on older cloud records
        title: r.title || '',
        leadSource: r.leadSource || undefined,
        leadScore: r.leadScore ?? undefined,
        dealValue: r.dealValue ?? undefined,
        closeDate: r.closeDate || undefined,
        nextFollowUpDate: r.nextFollowUpDate || undefined,
        nextAction: r.nextAction || '',
      }));

      const normalizedInteractions = interactions.map((i: any) => ({
        id: i._id,
        relationshipId: i.relationshipId,
        type: i.type,
        date: i.date,
        outcome: i.outcome,
        tone: i.tone,
        reflection: i.reflection || '',
        // New BDR fields
        subject: i.subject || '',
        direction: i.direction || undefined,
      }));

      // Save to localStorage — preserve existing auditLog (cloud doesn't sync audit events)
      saveData({
        relationships: normalizedRelationships,
        interactions: normalizedInteractions,
        auditLog: getAuditLog(),
        version: 1,
        schemaVersion: 3,
      });

      const now = new Date().toISOString();
      localStorage.setItem('last-sync', now);
      this.updateStatus({ lastSync: now, isSyncing: false });

      console.log('✅ Sync from cloud completed');
    } catch (error) {
      console.error('❌ Sync from cloud failed:', error);
      this.updateStatus({ isSyncing: false });
      throw error;
    }
  }

  /**
   * Push local data to cloud
   */
  async syncToCloud(): Promise<void> {
    try {
      this.updateStatus({ isSyncing: true });

      const localData = loadData();

      // Get existing cloud data to compare
      const [cloudRelationships, cloudInteractions] = await Promise.all([
        apiClient.getRelationships(),
        apiClient.getInteractions(),
      ]);

      const cloudRelIds = new Set(cloudRelationships.map((r: any) => r._id));
      const cloudIntIds = new Set(cloudInteractions.map((i: any) => i._id));

      // Sync relationships
      for (const rel of localData.relationships) {
        const relData = {
          name: rel.name,
          organization: rel.organization,
          industry: rel.industry,
          region: rel.region,
          stage: rel.stage,
          owner: rel.owner,
          notes: rel.notes,
          // New BDR fields
          title: rel.title,
          leadSource: rel.leadSource,
          leadScore: rel.leadScore,
          dealValue: rel.dealValue,
          closeDate: rel.closeDate,
          nextFollowUpDate: rel.nextFollowUpDate,
          nextAction: rel.nextAction,
        };

        if (cloudRelIds.has(rel.id)) {
          // Update existing
          await apiClient.updateRelationship(rel.id, relData);
        } else {
          // Create new
          await apiClient.createRelationship(relData);
        }
      }

      // Sync interactions
      for (const int of localData.interactions) {
        const intData = {
          relationshipId: int.relationshipId,
          type: int.type,
          date: int.date,
          outcome: int.outcome,
          tone: int.tone,
          reflection: int.reflection,
          // New BDR fields
          subject: int.subject,
          direction: int.direction,
        };

        if (cloudIntIds.has(int.id)) {
          // Update existing
          await apiClient.updateInteraction(int.id, intData);
        } else {
          // Create new
          await apiClient.createInteraction(intData);
        }
      }

      const now = new Date().toISOString();
      localStorage.setItem('last-sync', now);
      this.updateStatus({ lastSync: now, isSyncing: false });

      console.log('✅ Sync to cloud completed');
    } catch (error) {
      console.error('❌ Sync to cloud failed:', error);
      this.updateStatus({ isSyncing: false });
      throw error;
    }
  }

  /**
   * Full bidirectional sync (download from cloud)
   */
  async fullSync(): Promise<void> {
    // For simplicity, we'll prioritize cloud data
    // In a production app, you'd implement conflict resolution
    await this.syncFromCloud();
  }

  getStatus(): SyncStatus {
    return { ...this.syncStatus };
  }
}

export const syncService = new SyncService();
