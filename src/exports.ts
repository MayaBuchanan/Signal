/**
 * exports.ts
 * Pure helpers for CSV and Markdown exports.
 * No React imports — safe to call from any component.
 */
import { Relationship, Interaction } from './types';
import { stageProbability, formatCurrency } from './utils';
import { getRelationships, getInteractions } from './storage';

// ── CSV helpers ──────────────────────────────────────────────────────────────

function csvEscape(val: unknown): string {
  if (val == null) return '';
  const s = String(val).replace(/"/g, '""');
  return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
}

function toCSV(rows: string[][]): string {
  return rows.map(row => row.map(csvEscape).join(',')).join('\n');
}

function downloadFile(filename: string, content: string, mime = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── A) Pipeline CSV ───────────────────────────────────────────────────────────

export function exportPipelineCSV() {
  const relationships = getRelationships();
  const interactions  = getInteractions();

  // Build last-touched map
  const lastTouched: Record<string, string> = {};
  for (const i of interactions) {
    const prev = lastTouched[i.relationshipId];
    if (!prev || i.date > prev) lastTouched[i.relationshipId] = i.date;
  }

  const header = [
    'Name', 'Title', 'Company', 'Industry', 'Region', 'Owner',
    'Stage', 'Lead Score', 'Estimated ARR', 'Probability (%)',
    'Lead Source', 'Last Touched', 'Next Follow-Up', 'Next Action',
    'Target Close', 'Notes',
  ];

  const rows = relationships.map(r => [
    r.name,
    r.title ?? '',
    r.organization,
    r.industry,
    r.region,
    r.owner,
    r.stage,
    r.leadScore != null ? String(r.leadScore) : '',
    r.dealValue != null ? String(r.dealValue) : '',
    stageProbability[r.stage] != null ? String(stageProbability[r.stage]) : '',
    r.leadSource ?? '',
    lastTouched[r.id]
      ? new Date(lastTouched[r.id]).toLocaleDateString('en-US')
      : '',
    r.nextFollowUpDate
      ? new Date(r.nextFollowUpDate).toLocaleDateString('en-US')
      : '',
    r.nextAction ?? '',
    r.closeDate
      ? new Date(r.closeDate).toLocaleDateString('en-US')
      : '',
    r.notes,
  ]);

  const stamp = new Date().toISOString().slice(0, 10);
  downloadFile(`signal-pipeline-${stamp}.csv`, toCSV([header, ...rows]));
}

// ── B) Activity CSV ───────────────────────────────────────────────────────────

export function exportActivityCSV() {
  const relationships = getRelationships();
  const interactions  = getInteractions();

  const relMap: Record<string, Relationship> = {};
  for (const r of relationships) relMap[r.id] = r;

  const header = [
    'Lead Name', 'Company', 'Date', 'Activity Type', 'Direction',
    'Outcome', 'Subject / Topic', 'Notes / Reflection',
  ];

  // Newest first
  const sorted = [...interactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const rows = sorted.map(i => {
    const rel = relMap[i.relationshipId];
    return [
      rel?.name ?? i.relationshipId,
      rel?.organization ?? '',
      new Date(i.date).toLocaleDateString('en-US'),
      i.type,
      i.direction ?? '',
      i.outcome,
      i.subject ?? '',
      i.reflection ?? '',
    ];
  });

  const stamp = new Date().toISOString().slice(0, 10);
  downloadFile(`signal-activity-${stamp}.csv`, toCSV([header, ...rows]));
}

// ── C) Account Brief (Markdown) ───────────────────────────────────────────────

export function generateAccountBrief(
  rel: Relationship,
  interactions: Interaction[]
): string {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
  const prob = stageProbability[rel.stage] ?? '—';

  // Last 5 interactions, newest first
  const recent = [...interactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Heuristic: pull "objections" from reflections that mention common signals
  const OBJECTION_SIGNALS = [
    'concern', 'objection', 'push back', 'pushback', 'hesit', 'budget',
    'competitor', 'not interested', 'no response', 'freeze', 'delay',
    'timeline', 'pricing', 'expensive', 'risk', 'compliance', 'security',
  ];
  const objections = interactions
    .filter(i => {
      const text = (i.reflection ?? '').toLowerCase();
      return OBJECTION_SIGNALS.some(kw => text.includes(kw));
    })
    .slice(0, 3)
    .map(i => {
      const snippet = (i.reflection ?? '').slice(0, 120);
      return `- **${i.type}** (${new Date(i.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}): ${snippet}${snippet.length === 120 ? '…' : ''}`;
    });

  const activitiesBlock = recent.length
    ? recent.map(i => {
        const d = new Date(i.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dir = i.direction ? ` · ${i.direction}` : '';
        const subj = i.subject ? ` — "${i.subject}"` : '';
        const refl = i.reflection ? `\n  > ${i.reflection.slice(0, 200)}${i.reflection.length > 200 ? '…' : ''}` : '';
        return `- **${d}** ${i.type}${dir}${subj} *(${i.outcome})*${refl}`;
      }).join('\n')
    : '_No activity recorded yet._';

  const objBlock = objections.length
    ? objections.join('\n')
    : '_No notable objections flagged._';

  const md = `# Account Brief: ${rel.organization}
**Contact:** ${rel.name}${rel.title ? `, ${rel.title}` : ''}
**Generated:** ${today}
**Owner:** ${rel.owner || '—'}

---

## Qualification Summary

| Field | Value |
|---|---|
| Stage | **${rel.stage}** |
| Win Probability | ${prob}% |
| Estimated ARR | ${rel.dealValue ? formatCurrency(rel.dealValue) : '—'} |
| Lead Score | ${'★'.repeat(rel.leadScore ?? 0)}${'☆'.repeat(5 - (rel.leadScore ?? 0))} (${rel.leadScore ?? 0}/5) |
| Lead Source | ${rel.leadSource ?? '—'} |
| Industry | ${rel.industry || '—'} |
| Region | ${rel.region || '—'} |
| Target Close | ${rel.closeDate ? new Date(rel.closeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'} |
| Next Follow-Up | ${rel.nextFollowUpDate ? new Date(rel.nextFollowUpDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'} |

## Stakeholder Summary

**Primary Contact:** ${rel.name}${rel.title ? ` — ${rel.title}` : ''} at **${rel.organization}**

${rel.notes || '_No notes recorded._'}

## Last 5 Activities

${activitiesBlock}

## Objections & Risk Signals

${objBlock}

## Next Steps

${rel.nextAction ? `**Immediate:** ${rel.nextAction}` : '_No next action recorded._'}

---
*Generated by Signal BDR · ${today}*
`;

  return md;
}

export function downloadAccountBrief(rel: Relationship, interactions: Interaction[]) {
  const md = generateAccountBrief(rel, interactions);
  const slug = rel.organization.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const stamp = new Date().toISOString().slice(0, 10);
  downloadFile(`account-brief-${slug}-${stamp}.md`, md, 'text/markdown;charset=utf-8;');
}
