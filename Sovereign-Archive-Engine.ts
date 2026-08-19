// Sovereign-Archive-Engine.ts
// Beast System 3.0 — Sovereign Archive Engine

export class SovereignArchiveEngine {
  constructor(memoryEngine) {
    this.memoryEngine = memoryEngine;

    this.archive = {
      epochs: [],
      records: []
    };

    this.currentEpoch = this.createEpoch();
    this.running = false;
  }

  // ---- CREATE NEW EPOCH ----
  createEpoch() {
    return {
      epochId: `epoch-${Date.now()}`,
      startTimestamp: Date.now(),
      endTimestamp: null,
      records: []
    };
  }

  // ---- START ARCHIVE LOOP ----
  start(interval = 8000) {
    this.running = true;
    this.loop(interval);
  }

  stop() {
    this.running = false;
    this.currentEpoch.endTimestamp = Date.now();
    this.archive.epochs.push(this.currentEpoch);
  }

  async loop(interval) {
    while (this.running) {
      const memory = this.memoryEngine.getMemory();
      const lineage = this.memoryEngine.getLineage();

      const record = this.createRecord(memory, lineage);
      this.storeRecord(record);

      await this.sleep(interval);
    }
  }

  // ---- CREATE ARCHIVAL RECORD ----
  createRecord(memory, lineage) {
    return {
      timestamp: Date.now(),
      snapshot: memory.snapshots[memory.snapshots.length - 1],
      analytics: memory.analytics[memory.analytics.length - 1],
      insights: memory.insights[memory.insights.length - 1],
      evolution: memory.evolution[memory.evolution.length - 1],
      autonomy: memory.autonomy[memory.autonomy.length - 1],
      lineage: lineage[lineage.length - 1]
    };
  }

  // ---- STORE RECORD ----
  storeRecord(record) {
    this.currentEpoch.records.push(record);
    this.archive.records.push(record);

    // Keep archive bounded but epoch immutable
    if (this.archive.records.length > 5000) {
      this.archive.records.shift();
    }
  }

  // ---- CLOSE CURRENT EPOCH AND START NEW ONE ----
  rotateEpoch() {
    this.currentEpoch.endTimestamp = Date.now();
    this.archive.epochs.push(this.currentEpoch);
    this.currentEpoch = this.createEpoch();
  }

  // ---- RETRIEVE FULL ARCHIVE ----
  getArchive() {
    return this.archive;
  }

  // ---- RETRIEVE EPOCHS ----
  getEpochs() {
    return this.archive.epochs;
  }

  // ---- RETRIEVE RECORDS ----
  getRecords() {
    return this.archive.records;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
