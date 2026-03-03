/**
 * Demo seed data for Signal BDR Portfolio App
 * Scenario: BDR at a mid-market B2B SaaS company (workflow automation)
 * Targeting: FinTech, HealthTech, Logistics verticals, 100-1000 employee cos.
 * All names/companies are fictional.
 */

import { Relationship, Interaction, Stage, LeadSource, InteractionType, Outcome, Tone, Direction } from '../types';

// Stable IDs so seed is idempotent
const REL_IDS = {
  meridian:   'seed-rel-01',
  novalink:   'seed-rel-02',
  apexhealth: 'seed-rel-03',
  trailstone: 'seed-rel-04',
  crestdata:  'seed-rel-05',
  luminary:   'seed-rel-06',
  bridgeport: 'seed-rel-07',
  skyforge:   'seed-rel-08',
  verdant:    'seed-rel-09',
  ironclad:   'seed-rel-10',
  pinnacle:   'seed-rel-11',
  cascadeops: 'seed-rel-12',
};

export const SEED_RELATIONSHIPS: Relationship[] = [
  {
    id: REL_IDS.meridian,
    name: 'Jordan Ellis',
    title: 'VP of Operations',
    organization: 'Meridian Financial',
    industry: 'FinTech',
    region: 'Northeast',
    stage: Stage.ProposalSent,
    leadSource: LeadSource.Outbound,
    leadScore: 5,
    dealValue: 84000,
    closeDate: new Date('2026-03-31').toISOString(),
    nextFollowUpDate: new Date('2026-03-05').toISOString(),
    nextAction: 'Follow up on legal review of MSA — ping Tuesday AM',
    owner: 'Maya Buchanan',
    notes: 'Strong ICP fit. 400-person FinTech, manual reconciliation workflows eating ~20hrs/week ops team. Champion is Jordan; economic buyer is CFO Dana Osei (met on discovery). Price sensitivity around implementation cost, not ARR. Sent proposal 2/24.',
    createdAt: new Date('2026-01-08').toISOString(),
    updatedAt: new Date('2026-02-24').toISOString(),
  },
  {
    id: REL_IDS.novalink,
    name: 'Priya Sharma',
    title: 'Head of Product',
    organization: 'NovaLink Logistics',
    industry: 'Logistics',
    region: 'Midwest',
    stage: Stage.DemoScheduled,
    leadSource: LeadSource.Outbound,
    leadScore: 4,
    dealValue: 60000,
    closeDate: new Date('2026-04-15').toISOString(),
    nextFollowUpDate: new Date('2026-03-04').toISOString(),
    nextAction: 'Send demo confirmation + agenda; prep logistics-specific deck',
    owner: 'Maya Buchanan',
    notes: 'Replied to cold email on 2nd follow-up. Pain: disconnected carrier systems causing 3-day delay in exception handling. Demo booked for 3/6. Priya is the influencer; final sign-off is CEO.',
    createdAt: new Date('2026-01-15').toISOString(),
    updatedAt: new Date('2026-02-28').toISOString(),
  },
  {
    id: REL_IDS.apexhealth,
    name: 'Marcus Webb',
    title: 'Director of Revenue Cycle',
    organization: 'Apex Health Systems',
    industry: 'HealthTech',
    region: 'Southeast',
    stage: Stage.Qualified,
    leadSource: LeadSource.Inbound,
    leadScore: 4,
    dealValue: 120000,
    closeDate: new Date('2026-05-01').toISOString(),
    nextFollowUpDate: new Date('2026-03-07').toISOString(),
    nextAction: 'Send case study from Northview Health, schedule discovery call #2 with IT',
    owner: 'Maya Buchanan',
    notes: 'Inbound demo request via website 2/10. 600-person health system. Current pain: billing reconciliation done in Excel. HIPAA compliance concern raised — need to loop in their IT security team. High ACV potential.',
    createdAt: new Date('2026-02-10').toISOString(),
    updatedAt: new Date('2026-02-20').toISOString(),
  },
  {
    id: REL_IDS.trailstone,
    name: 'Casey Morgan',
    title: 'COO',
    organization: 'Trailstone Capital',
    industry: 'FinTech',
    region: 'West',
    stage: Stage.ClosedWon,
    leadSource: LeadSource.Referral,
    leadScore: 5,
    dealValue: 48000,
    closeDate: new Date('2026-02-14').toISOString(),
    nextFollowUpDate: undefined,
    nextAction: 'Intro to CSM team — kickoff scheduled 3/3',
    owner: 'Maya Buchanan',
    notes: 'Referral from Jordan at Meridian Financial. Fast cycle — 3 weeks from first call to closed. Strong fit, minimal objections. Great reference candidate at 90 days.',
    createdAt: new Date('2026-01-22').toISOString(),
    updatedAt: new Date('2026-02-14').toISOString(),
  },
  {
    id: REL_IDS.crestdata,
    name: 'Alexis Torres',
    title: 'Senior Director of Eng',
    organization: 'CrestData Analytics',
    industry: 'FinTech',
    region: 'Northeast',
    stage: Stage.Prospect,
    leadSource: LeadSource.Outbound,
    leadScore: 3,
    dealValue: 36000,
    closeDate: new Date('2026-06-01').toISOString(),
    nextFollowUpDate: new Date('2026-03-10').toISOString(),
    nextAction: 'Send personalized cold email referencing their Series B announcement',
    owner: 'Maya Buchanan',
    notes: 'Identified via LinkedIn. Just raised Series B — likely scaling ops team. No response to first outreach. Will try personalized follow-up referencing their funding news.',
    createdAt: new Date('2026-02-01').toISOString(),
    updatedAt: new Date('2026-02-20').toISOString(),
  },
  {
    id: REL_IDS.luminary,
    name: 'Devon Park',
    title: 'VP Finance',
    organization: 'Luminary Payments',
    industry: 'FinTech',
    region: 'West',
    stage: Stage.Qualified,
    leadSource: LeadSource.Outbound,
    leadScore: 4,
    dealValue: 72000,
    closeDate: new Date('2026-04-30').toISOString(),
    nextFollowUpDate: new Date('2026-03-06').toISOString(),
    nextAction: 'Send ROI calculator based on their stated 15hrs/week manual AP process',
    owner: 'Maya Buchanan',
    notes: 'Connected after cold call on 3rd attempt. Great discovery call — confirmed budget and timeline. Key pain: AP automation. Competitor is Zip. Need to highlight our ERP integrations.',
    createdAt: new Date('2026-01-28').toISOString(),
    updatedAt: new Date('2026-02-22').toISOString(),
  },
  {
    id: REL_IDS.bridgeport,
    name: 'Sam Delgado',
    title: 'Head of Supply Chain',
    organization: 'Bridgeport Freight',
    industry: 'Logistics',
    region: 'Midwest',
    stage: Stage.Prospect,
    leadSource: LeadSource.Event,
    leadScore: 3,
    dealValue: 42000,
    closeDate: new Date('2026-05-15').toISOString(),
    nextFollowUpDate: new Date('2026-03-08').toISOString(),
    nextAction: 'LinkedIn connect + personalized note referencing SCA conference conversation',
    owner: 'Maya Buchanan',
    notes: 'Met at Supply Chain Advantage conference 2/27. Brief conversation — mentioned frustration with manual freight audit process. Agreed to connect on LinkedIn. Warm enough to skip cold email sequence.',
    createdAt: new Date('2026-02-27').toISOString(),
    updatedAt: new Date('2026-02-27').toISOString(),
  },
  {
    id: REL_IDS.skyforge,
    name: 'Riley Chen',
    title: 'Director of Operations',
    organization: 'Skyforge Technologies',
    industry: 'HealthTech',
    region: 'West',
    stage: Stage.ClosedLost,
    leadSource: LeadSource.Outbound,
    leadScore: 2,
    dealValue: 0,
    closeDate: new Date('2026-02-01').toISOString(),
    nextFollowUpDate: undefined,
    nextAction: 'Re-engage in Q4 if they revisit budget',
    owner: 'Maya Buchanan',
    notes: 'Lost to incumbent (legacy system deep integration). Not a budget issue — IT team had just spent 18 months integrating their EHR and had no appetite for another project. Good learning: qualify IT bandwidth earlier. Set reminder for Q4 re-engage.',
    createdAt: new Date('2025-11-10').toISOString(),
    updatedAt: new Date('2026-02-01').toISOString(),
  },
  {
    id: REL_IDS.verdant,
    name: 'Taylor Brooks',
    title: 'CFO',
    organization: 'Verdant AgriTech',
    industry: 'AgriTech',
    region: 'Midwest',
    stage: Stage.Prospect,
    leadSource: LeadSource.Outbound,
    leadScore: 2,
    dealValue: 28000,
    closeDate: undefined,
    nextFollowUpDate: new Date('2026-03-15').toISOString(),
    nextAction: 'Test with second cold email sequence — try phone this time',
    owner: 'Maya Buchanan',
    notes: 'Outside core ICP (AgriTech vs FinTech/Logistics target). Included due to company size and ops complexity. Lower priority — no response to two emails.',
    createdAt: new Date('2026-02-05').toISOString(),
    updatedAt: new Date('2026-02-19').toISOString(),
  },
  {
    id: REL_IDS.ironclad,
    name: 'Morgan Price',
    title: 'VP of Partnerships',
    organization: 'IronClad Insurance',
    industry: 'FinTech',
    region: 'Southeast',
    stage: Stage.Qualified,
    leadSource: LeadSource.Referral,
    leadScore: 4,
    dealValue: 54000,
    closeDate: new Date('2026-04-01').toISOString(),
    nextFollowUpDate: new Date('2026-03-03').toISOString(),
    nextAction: 'Confirm discovery call details, send pre-call questionnaire',
    owner: 'Maya Buchanan',
    notes: 'Referral from a former colleague. Insurance ops — claims processing workflow is entirely manual. Morgan is an internal champion but needs CFO sign-off. Discovery scheduled 3/5.',
    createdAt: new Date('2026-02-12').toISOString(),
    updatedAt: new Date('2026-02-26').toISOString(),
  },
  {
    id: REL_IDS.pinnacle,
    name: 'Jamie Okafor',
    title: 'CTO',
    organization: 'Pinnacle Health Network',
    industry: 'HealthTech',
    region: 'Northeast',
    stage: Stage.DemoScheduled,
    leadSource: LeadSource.Inbound,
    leadScore: 5,
    dealValue: 150000,
    closeDate: new Date('2026-04-30').toISOString(),
    nextFollowUpDate: new Date('2026-03-05').toISOString(),
    nextAction: 'Send security questionnaire response + SOC 2 Type II report',
    owner: 'Maya Buchanan',
    notes: 'Largest inbound lead this quarter. 1,200-person health network, multiple facilities. CTO Jamie is evaluating 3 vendors. Our differentiator: HIPAA compliance + EHR integrations. Demo 3/9 with full exec panel. High priority.',
    createdAt: new Date('2026-02-15').toISOString(),
    updatedAt: new Date('2026-02-28').toISOString(),
  },
  {
    id: REL_IDS.cascadeops,
    name: 'Avery Nguyen',
    title: 'Director of IT',
    organization: 'CascadeOps',
    industry: 'Logistics',
    region: 'West',
    stage: Stage.Prospect,
    leadSource: LeadSource.Outbound,
    leadScore: 3,
    dealValue: 32000,
    closeDate: undefined,
    nextFollowUpDate: new Date('2026-03-12').toISOString(),
    nextAction: 'Try LinkedIn after no email response — reference their recent warehouse expansion news',
    owner: 'Maya Buchanan',
    notes: 'Identified via LinkedIn — saw post about expanding to 3 new warehouses. Classic expansion-phase ops pain. Cold email opened twice, no reply. Worth a LinkedIn touch.',
    createdAt: new Date('2026-02-18').toISOString(),
    updatedAt: new Date('2026-02-25').toISOString(),
  },
];

export const SEED_INTERACTIONS: Interaction[] = [
  // ── Meridian Financial (Jordan Ellis) ──────────────────────────────────────
  { id: 'seed-int-01', relationshipId: REL_IDS.meridian, type: InteractionType.ColdEmail, subject: 'Quick question about Meridian\'s reconciliation process', date: new Date('2026-01-09').toISOString(), direction: Direction.Outbound, outcome: Outcome.NoResponse, tone: Tone.Neutral, reflection: 'Sent first cold email. No response. Will follow up in 3 days.' },
  { id: 'seed-int-02', relationshipId: REL_IDS.meridian, type: InteractionType.FollowUpEmail, subject: 'Re: Quick question about Meridian\'s reconciliation process', date: new Date('2026-01-13').toISOString(), direction: Direction.Outbound, outcome: Outcome.Positive, tone: Tone.Energizing, reflection: 'Jordan replied — "good timing, we\'re evaluating tools right now." Booked exploratory call.' },
  { id: 'seed-int-03', relationshipId: REL_IDS.meridian, type: InteractionType.DiscoveryCall, subject: 'Discovery — reconciliation workflow pain points', date: new Date('2026-01-20').toISOString(), direction: Direction.Outbound, outcome: Outcome.Positive, tone: Tone.Energizing, reflection: '45 min call. Confirmed: 3 FTEs spending 20hrs/week on manual rec. CFO Dana Osei joined last 10 min — very engaged. Asked about SOX compliance features. Strong fit. Sending tailored deck.' },
  { id: 'seed-int-04', relationshipId: REL_IDS.meridian, type: InteractionType.FollowUpEmail, subject: 'Signal + Meridian: tailored overview + compliance FAQ', date: new Date('2026-01-23').toISOString(), direction: Direction.Outbound, outcome: Outcome.Positive, tone: Tone.Neutral, reflection: 'Sent deck + SOX compliance one-pager. Jordan confirmed receipt and shared with Dana.' },
  { id: 'seed-int-05', relationshipId: REL_IDS.meridian, type: InteractionType.Demo, subject: 'Full product demo — compliance + reconciliation workflows', date: new Date('2026-02-03').toISOString(), direction: Direction.Outbound, outcome: Outcome.Positive, tone: Tone.Energizing, reflection: 'Demo with Jordan + Dana + 1 IT rep. Went 70 min (scheduled 60). Dana asked detailed implementation questions — buying signal. One concern: data migration timeline. Committed to sending detailed impl. plan.' },
  { id: 'seed-int-06', relationshipId: REL_IDS.meridian, type: InteractionType.FollowUpEmail, subject: 'Implementation timeline + migration support overview', date: new Date('2026-02-06').toISOString(), direction: Direction.Outbound, outcome: Outcome.Positive, tone: Tone.Neutral, reflection: 'Sent impl. plan. Jordan responded same day — "this is helpful, moving to procurement review."' },
  { id: 'seed-int-07', relationshipId: REL_IDS.meridian, type: InteractionType.ProposalReview, subject: 'Proposal walkthrough call', date: new Date('2026-02-24').toISOString(), direction: Direction.Outbound, outcome: Outcome.Positive, tone: Tone.Energizing, reflection: 'Walked through proposal line by line. Main discussion: professional services cost. Agreed to bundle 2 extra onboarding sessions. Jordan said legal review starts this week. Expected close EOQ.' },

  // ── NovaLink Logistics (Priya Sharma) ─────────────────────────────────────
  { id: 'seed-int-08', relationshipId: REL_IDS.novalink, type: InteractionType.ColdEmail, subject: 'Carrier exception handling at NovaLink — 3-min read', date: new Date('2026-01-16').toISOString(), direction: Direction.Outbound, outcome: Outcome.NoResponse, tone: Tone.Neutral, reflection: 'Personalized cold email referencing NovaLink\'s LinkedIn post about Q4 delays. No response.' },
  { id: 'seed-int-09', relationshipId: REL_IDS.novalink, type: InteractionType.FollowUpEmail, subject: 'Following up — carrier exception automation', date: new Date('2026-01-21').toISOString(), direction: Direction.Outbound, outcome: Outcome.NoResponse, tone: Tone.Neutral, reflection: 'Second touch. Still no reply. Will try one more email then LinkedIn.' },
  { id: 'seed-int-10', relationshipId: REL_IDS.novalink, type: InteractionType.LinkedInMessage, subject: 'Connecting re: logistics ops automation', date: new Date('2026-01-27').toISOString(), direction: Direction.Outbound, outcome: Outcome.Positive, tone: Tone.Energizing, reflection: 'LinkedIn message worked — Priya accepted and replied within 2 hours. "Timing is right, we just kicked off vendor eval." Booked 30-min intro call.' },
  { id: 'seed-int-11', relationshipId: REL_IDS.novalink, type: InteractionType.DiscoveryCall, subject: 'Intro / discovery call', date: new Date('2026-02-04').toISOString(), direction: Direction.Outbound, outcome: Outcome.Positive, tone: Tone.Energizing, reflection: 'Great call. Confirmed 3-vendor shortlist (us, competitor A, competitor B). Key differentiator they care about: API flexibility for carrier integrations. Demo booked for 3/6.' },
  { id: 'seed-int-12', relationshipId: REL_IDS.novalink, type: InteractionType.FollowUpEmail, subject: 'Demo prep: agenda + carrier integration overview', date: new Date('2026-02-28').toISOString(), direction: Direction.Outbound, outcome: Outcome.Positive, tone: Tone.Neutral, reflection: 'Sent agenda + logistics-specific case study. Priya confirmed attendance + added her eng lead to the invite.' },

  // ── Apex Health Systems (Marcus Webb) ─────────────────────────────────────
  { id: 'seed-int-13', relationshipId: REL_IDS.apexhealth, type: InteractionType.Email, subject: 'Re: Demo Request — Apex Health Systems', date: new Date('2026-02-10').toISOString(), direction: Direction.Inbound, outcome: Outcome.Positive, tone: Tone.Energizing, reflection: 'Inbound from website form. Responded within 15 minutes. Booked discovery call same day.' },
  { id: 'seed-int-14', relationshipId: REL_IDS.apexhealth, type: InteractionType.DiscoveryCall, subject: 'Discovery — revenue cycle & billing pain points', date: new Date('2026-02-13').toISOString(), direction: Direction.Inbound, outcome: Outcome.Positive, tone: Tone.Energizing, reflection: '60 min discovery. Marcus is meticulous — came with a list of questions. Primary pain: billing rec done in Excel across 6 facilities. HIPAA compliance is a hard requirement. He specifically asked about SOC 2. Strong fit but IT security review will be a gate.' },
  { id: 'seed-int-15', relationshipId: REL_IDS.apexhealth, type: InteractionType.FollowUpEmail, subject: 'SOC 2 Type II report + HIPAA compliance overview', date: new Date('2026-02-16').toISOString(), direction: Direction.Outbound, outcome: Outcome.Positive, tone: Tone.Neutral, reflection: 'Sent compliance docs. Marcus forwarded to IT security team (good sign — internal momentum).' },
  { id: 'seed-int-16', relationshipId: REL_IDS.apexhealth, type: InteractionType.FollowUpEmail, subject: 'Northview Health case study — similar use case', date: new Date('2026-02-20').toISOString(), direction: Direction.Outbound, outcome: Outcome.Neutral, tone: Tone.Neutral, reflection: 'Sent health system case study. No reply yet — Marcus mentioned he\'s traveling this week. Following up 3/7.' },

  // ── Trailstone Capital (Casey Morgan) — CLOSED WON ────────────────────────
  { id: 'seed-int-17', relationshipId: REL_IDS.trailstone, type: InteractionType.ColdCall, subject: 'Cold call — AP workflow automation', date: new Date('2026-01-23').toISOString(), direction: Direction.Outbound, outcome: Outcome.Positive, tone: Tone.Energizing, reflection: 'Referral call from Jordan at Meridian — Casey picked up immediately. 20 min conversation. Confirmed strong fit and asked to see a demo ASAP.' },
  { id: 'seed-int-18', relationshipId: REL_IDS.trailstone, type: InteractionType.Demo, subject: 'Product demo — AP & reconciliation', date: new Date('2026-01-28').toISOString(), direction: Direction.Outbound, outcome: Outcome.Positive, tone: Tone.Energizing, reflection: 'Short demo (40 min). Casey said "this is exactly what we\'ve been looking for." Wants to move fast — sent proposal same day.' },
  { id: 'seed-int-19', relationshipId: REL_IDS.trailstone, type: InteractionType.ProposalReview, subject: 'Proposal review + legal', date: new Date('2026-02-05').toISOString(), direction: Direction.Outbound, outcome: Outcome.Positive, tone: Tone.Energizing, reflection: 'Casey had minor redlines on SLA terms. Resolved same day with AE. PO submitted 2/14. Closed!' },

  // ── Luminary Payments (Devon Park) ────────────────────────────────────────
  { id: 'seed-int-20', relationshipId: REL_IDS.luminary, type: InteractionType.ColdCall, subject: 'Cold call #1 — AP automation', date: new Date('2026-01-29').toISOString(), direction: Direction.Outbound, outcome: Outcome.NoResponse, tone: Tone.Neutral, reflection: 'Voicemail left.' },
  { id: 'seed-int-21', relationshipId: REL_IDS.luminary, type: InteractionType.Voicemail, subject: 'Follow-up voicemail re: AP automation', date: new Date('2026-02-03').toISOString(), direction: Direction.Outbound, outcome: Outcome.NoResponse, tone: Tone.Neutral, reflection: 'Second voicemail. Will follow with cold email.' },
  { id: 'seed-int-22', relationshipId: REL_IDS.luminary, type: InteractionType.ColdEmail, subject: 'Luminary Payments + workflow automation — 2-min read', date: new Date('2026-02-05').toISOString(), direction: Direction.Outbound, outcome: Outcome.NoResponse, tone: Tone.Neutral, reflection: 'Email sent day after voicemail. No reply.' },
  { id: 'seed-int-23', relationshipId: REL_IDS.luminary, type: InteractionType.ColdCall, subject: 'Cold call #3 — connected', date: new Date('2026-02-11').toISOString(), direction: Direction.Outbound, outcome: Outcome.Positive, tone: Tone.Energizing, reflection: 'Devon picked up on 3rd call attempt. Great conversation — confirmed they\'re spending 15hrs/week on manual AP. Competitor is Zip. Discovery call booked for 2/22.' },
  { id: 'seed-int-24', relationshipId: REL_IDS.luminary, type: InteractionType.DiscoveryCall, subject: 'Discovery — AP & Zip evaluation', date: new Date('2026-02-22').toISOString(), direction: Direction.Outbound, outcome: Outcome.Positive, tone: Tone.Energizing, reflection: 'Thorough discovery. Devon is methodical. Zip is their other finalist — their differentiator ask is ERP integrations (we win here). Sending ROI calc to quantify the 15hrs/week pain.' },

  // ── IronClad Insurance (Morgan Price) ─────────────────────────────────────
  { id: 'seed-int-25', relationshipId: REL_IDS.ironclad, type: InteractionType.ColdEmail, subject: 'Intro — workflow automation for insurance ops', date: new Date('2026-02-13').toISOString(), direction: Direction.Outbound, outcome: Outcome.Positive, tone: Tone.Energizing, reflection: 'Referral intro email from mutual contact. Morgan replied within the hour.' },
  { id: 'seed-int-26', relationshipId: REL_IDS.ironclad, type: InteractionType.DiscoveryCall, subject: 'Discovery — claims processing workflow', date: new Date('2026-02-19').toISOString(), direction: Direction.Outbound, outcome: Outcome.Positive, tone: Tone.Energizing, reflection: 'Morgan is a great internal champion. Claims processing is 100% manual — 8 FTEs. CFO sign-off required above $50k. We\'re at $54k so will need to make the ROI case to CFO directly.' },
  { id: 'seed-int-27', relationshipId: REL_IDS.ironclad, type: InteractionType.FollowUpEmail, subject: 'Pre-call questionnaire for discovery call #2', date: new Date('2026-02-26').toISOString(), direction: Direction.Outbound, outcome: Outcome.Positive, tone: Tone.Neutral, reflection: 'Sent questionnaire for CFO meeting. Morgan confirmed the CFO is "on board in principle" — good signal.' },

  // ── Pinnacle Health Network (Jamie Okafor) ────────────────────────────────
  { id: 'seed-int-28', relationshipId: REL_IDS.pinnacle, type: InteractionType.Email, subject: 'Re: Inbound Demo Request — Pinnacle Health Network', date: new Date('2026-02-15').toISOString(), direction: Direction.Inbound, outcome: Outcome.Positive, tone: Tone.Energizing, reflection: 'Largest inbound of the quarter. Responded in 8 min. Jamie confirmed they\'re evaluating 3 vendors with a 60-day decision timeline.' },
  { id: 'seed-int-29', relationshipId: REL_IDS.pinnacle, type: InteractionType.DiscoveryCall, subject: 'Discovery — enterprise health network requirements', date: new Date('2026-02-20').toISOString(), direction: Direction.Inbound, outcome: Outcome.Positive, tone: Tone.Energizing, reflection: '75 min call with Jamie + 2 ops directors. Requirements documented: HIPAA, EHR integrations (Epic + Cerner), multi-facility rollout, SSO. This is an enterprise deal — looping in AE and Solutions Engineer.' },
  { id: 'seed-int-30', relationshipId: REL_IDS.pinnacle, type: InteractionType.FollowUpEmail, subject: 'SOC 2 report + EHR integration documentation', date: new Date('2026-02-24').toISOString(), direction: Direction.Outbound, outcome: Outcome.Positive, tone: Tone.Neutral, reflection: 'Sent full security package. Jamie replied: "sharing with our CISO — expect questions." Demo scheduled for 3/9 with exec panel.' },

  // ── Skyforge Technologies (Riley Chen) — CLOSED LOST ─────────────────────
  { id: 'seed-int-31', relationshipId: REL_IDS.skyforge, type: InteractionType.ColdEmail, subject: 'Workflow automation for HealthTech ops teams', date: new Date('2025-11-12').toISOString(), direction: Direction.Outbound, outcome: Outcome.Positive, tone: Tone.Neutral, reflection: 'Riley replied quickly — seemed interested. Good timing? TBD.' },
  { id: 'seed-int-32', relationshipId: REL_IDS.skyforge, type: InteractionType.DiscoveryCall, subject: 'Discovery call', date: new Date('2025-11-19').toISOString(), direction: Direction.Outbound, outcome: Outcome.Neutral, tone: Tone.Neutral, reflection: 'Good conversation but red flag: IT team just finished an 18-month EHR integration. Riley is interested but said "we\'re in IT change freeze until Q3." Will continue but low priority.' },
  { id: 'seed-int-33', relationshipId: REL_IDS.skyforge, type: InteractionType.Demo, subject: 'Product demo', date: new Date('2025-12-10').toISOString(), direction: Direction.Outbound, outcome: Outcome.Neutral, tone: Tone.Neutral, reflection: 'Demo went well technically but Riley confirmed IT won\'t approve another integration project. Formally lost 2/1. Note to self: qualify IT bandwidth earlier in future HealthTech cycles.' },

  // ── CrestData Analytics (Alexis Torres) ───────────────────────────────────
  { id: 'seed-int-34', relationshipId: REL_IDS.crestdata, type: InteractionType.ColdEmail, subject: 'Congrats on the Series B — quick question on ops scaling', date: new Date('2026-02-03').toISOString(), direction: Direction.Outbound, outcome: Outcome.NoResponse, tone: Tone.Neutral, reflection: 'Personalized email referencing their Series B. No response. Will follow up in a week.' },
  { id: 'seed-int-35', relationshipId: REL_IDS.crestdata, type: InteractionType.FollowUpEmail, subject: 'Following up — scaling ops post-fundraise', date: new Date('2026-02-12').toISOString(), direction: Direction.Outbound, outcome: Outcome.NoResponse, tone: Tone.Neutral, reflection: 'Second touch. Still no reply. Opened once according to email tracker. Will try LinkedIn.' },

  // ── Bridgeport Freight (Sam Delgado) ──────────────────────────────────────
  { id: 'seed-int-36', relationshipId: REL_IDS.bridgeport, type: InteractionType.Meeting, subject: 'SCA Conference — intro conversation', date: new Date('2026-02-27').toISOString(), direction: Direction.Inbound, outcome: Outcome.Positive, tone: Tone.Energizing, reflection: 'Met Sam at the Supply Chain Advantage conference. 15-min hallway conversation. He mentioned manual freight audit process as a recurring headache. Agreed to connect on LinkedIn for a follow-up call.' },

  // ── CascadeOps (Avery Nguyen) ──────────────────────────────────────────────
  { id: 'seed-int-37', relationshipId: REL_IDS.cascadeops, type: InteractionType.ColdEmail, subject: 'Scaling ops across 3 new CascadeOps warehouses', date: new Date('2026-02-19').toISOString(), direction: Direction.Outbound, outcome: Outcome.NoResponse, tone: Tone.Neutral, reflection: 'Personalized email referencing their warehouse expansion LinkedIn post. Opened twice, no reply.' },
  { id: 'seed-int-38', relationshipId: REL_IDS.cascadeops, type: InteractionType.FollowUpEmail, subject: 'Re: Scaling ops across 3 new CascadeOps warehouses', date: new Date('2026-02-25').toISOString(), direction: Direction.Outbound, outcome: Outcome.NoResponse, tone: Tone.Neutral, reflection: 'Second touch. Will pivot to LinkedIn next.' },
];

import {
  getRelationships,
  getInteractions,
  saveRelationships,
  saveInteractions,
} from '../storage';

/**
 * Loads seed data into localStorage — ONLY if it hasn't been loaded yet.
 * Never overwrites existing non-seed records. Safe to call multiple times.
 */
export function loadSeedData(): { added: number } {
  const existingRels = getRelationships();
  const existingInts = getInteractions();

  const existingRelIds = new Set(existingRels.map(r => r.id));
  const existingIntIds = new Set(existingInts.map(i => i.id));

  const newRels = SEED_RELATIONSHIPS.filter(r => !existingRelIds.has(r.id));
  const newInts = SEED_INTERACTIONS.filter(i => !existingIntIds.has(i.id));

  if (newRels.length > 0) saveRelationships([...existingRels, ...newRels]);
  if (newInts.length > 0) saveInteractions([...existingInts, ...newInts]);

  return { added: newRels.length };
}
