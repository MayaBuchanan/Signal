/**
 * Demo seed data for Signal BDR Portfolio App
 * Scenario: BDR at a mid-market B2B SaaS company (workflow automation)
 * Targeting: FinTech, HealthTech, Logistics verticals, 100-1000 employee cos.
 * All names/companies are fictional.
 *
 * Dates are expressed as offsets from TODAY so the follow-up queue is always
 * populated on demo day — no matter when the app is loaded.
 */

import { Relationship, Interaction, Stage, LeadSource, InteractionType, Outcome, Tone, Direction } from '../types';

/** ISO string for midnight UTC N days from today (negative = past, positive = future) */
function d(offsetDays: number): string {
  const dt = new Date();
  dt.setHours(0, 0, 0, 0);
  dt.setDate(dt.getDate() + offsetDays);
  return dt.toISOString();
}

/** ISO string for a specific time on the day that is `offsetDays` from today */
function dt(offsetDays: number, hh = 9, mm = 0): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);
  date.setHours(hh, mm, 0, 0);
  return date.toISOString();
}

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
  // ── ProposalSent: overdue follow-up (-2 days) ──────────────────────────────
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
    closeDate: d(28),
    nextFollowUpDate: d(-2),
    nextAction: 'Follow up on legal review of MSA — ping Tuesday AM',
    owner: 'Maya Buchanan',
    notes: 'Strong ICP fit. 400-person FinTech, manual reconciliation workflows eating ~20hrs/week ops team. Champion is Jordan; economic buyer is CFO Dana Osei (met on discovery). Price sensitivity around implementation cost, not ARR. Sent proposal 3 days ago.',
    createdAt: d(-54),
    updatedAt: d(-7),
  },
  // ── DemoScheduled: due today ───────────────────────────────────────────────
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
    closeDate: d(43),
    nextFollowUpDate: d(0),
    nextAction: 'Send demo confirmation + agenda; prep logistics-specific deck',
    owner: 'Maya Buchanan',
    notes: 'Replied to cold email on 2nd follow-up. Pain: disconnected carrier systems causing 3-day delay in exception handling. Demo booked for tomorrow. Priya is the influencer; final sign-off is CEO.',
    createdAt: d(-47),
    updatedAt: d(-3),
  },
  // ── Qualified: due tomorrow (+1 day) ──────────────────────────────────────
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
    closeDate: d(59),
    nextFollowUpDate: d(1),
    nextAction: 'Send case study from Northview Health, schedule discovery call #2 with IT',
    owner: 'Maya Buchanan',
    notes: 'Inbound demo request via website. 600-person health system. Current pain: billing reconciliation done in Excel. HIPAA compliance concern raised — need to loop in their IT security team. High ACV potential.',
    createdAt: d(-21),
    updatedAt: d(-11),
  },
  // ── ClosedWon: 17 days ago ─────────────────────────────────────────────────
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
    closeDate: d(-17),
    nextFollowUpDate: undefined,
    nextAction: 'Intro to CSM team — kickoff scheduled this week',
    owner: 'Maya Buchanan',
    notes: 'Referral from Jordan at Meridian Financial. Fast cycle — 3 weeks from first call to closed. Strong fit, minimal objections. Great reference candidate at 90 days.',
    createdAt: d(-40),
    updatedAt: d(-17),
  },
  // ── Prospect: due in 7 days ────────────────────────────────────────────────
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
    closeDate: d(90),
    nextFollowUpDate: d(7),
    nextAction: 'Send personalized cold email referencing their Series B announcement',
    owner: 'Maya Buchanan',
    notes: 'Identified via LinkedIn. Just raised Series B — likely scaling ops team. No response to first outreach. Will try personalized follow-up referencing their funding news.',
    createdAt: d(-30),
    updatedAt: d(-11),
  },
  // ── Qualified: overdue (-1 day) ───────────────────────────────────────────
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
    closeDate: d(58),
    nextFollowUpDate: d(-1),
    nextAction: 'Send ROI calculator based on their stated 15hrs/week manual AP process',
    owner: 'Maya Buchanan',
    notes: 'Connected after cold call on 3rd attempt. Great discovery call — confirmed budget and timeline. Key pain: AP automation. Competitor is Zip. Need to highlight our ERP integrations.',
    createdAt: d(-34),
    updatedAt: d(-9),
  },
  // ── Prospect: due in 5 days ────────────────────────────────────────────────
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
    closeDate: d(73),
    nextFollowUpDate: d(5),
    nextAction: 'LinkedIn connect + personalized note referencing SCA conference conversation',
    owner: 'Maya Buchanan',
    notes: 'Met at Supply Chain Advantage conference last week. Brief conversation — mentioned frustration with manual freight audit process. Agreed to connect on LinkedIn. Warm enough to skip cold email sequence.',
    createdAt: d(-4),
    updatedAt: d(-4),
  },
  // ── ClosedLost ────────────────────────────────────────────────────────────
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
    closeDate: d(-30),
    nextFollowUpDate: undefined,
    nextAction: 'Re-engage in Q4 if they revisit budget',
    owner: 'Maya Buchanan',
    notes: 'Lost to incumbent (legacy system deep integration). Not a budget issue — IT team had just spent 18 months integrating their EHR and had no appetite for another project. Good learning: qualify IT bandwidth earlier. Set reminder for Q4 re-engage.',
    createdAt: d(-113),
    updatedAt: d(-30),
  },
  // ── Prospect: due in 12 days ───────────────────────────────────────────────
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
    nextFollowUpDate: d(12),
    nextAction: 'Test with second cold email sequence — try phone this time',
    owner: 'Maya Buchanan',
    notes: 'Outside core ICP (AgriTech vs FinTech/Logistics target). Included due to company size and ops complexity. Lower priority — no response to two emails.',
    createdAt: d(-26),
    updatedAt: d(-12),
  },
  // ── Qualified: due today ──────────────────────────────────────────────────
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
    closeDate: d(29),
    nextFollowUpDate: d(0),
    nextAction: 'Confirm discovery call details, send pre-call questionnaire',
    owner: 'Maya Buchanan',
    notes: 'Referral from a former colleague. Insurance ops — claims processing workflow is entirely manual. Morgan is an internal champion but needs CFO sign-off. Discovery scheduled in 2 days.',
    createdAt: d(-19),
    updatedAt: d(-5),
  },
  // ── DemoScheduled: due in +2 days ─────────────────────────────────────────
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
    closeDate: d(58),
    nextFollowUpDate: d(2),
    nextAction: 'Send security questionnaire response + SOC 2 Type II report',
    owner: 'Maya Buchanan',
    notes: 'Largest inbound lead this quarter. 1,200-person health network, multiple facilities. CTO Jamie is evaluating 3 vendors. Our differentiator: HIPAA compliance + EHR integrations. Demo next week with full exec panel. High priority.',
    createdAt: d(-16),
    updatedAt: d(-3),
  },
  // ── Prospect: due in 9 days ────────────────────────────────────────────────
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
    nextFollowUpDate: d(9),
    nextAction: 'Try LinkedIn after no email response — reference their recent warehouse expansion news',
    owner: 'Maya Buchanan',
    notes: 'Identified via LinkedIn — saw post about expanding to 3 new warehouses. Classic expansion-phase ops pain. Cold email opened twice, no reply. Worth a LinkedIn touch.',
    createdAt: d(-13),
    updatedAt: d(-6),
  },
];

export const SEED_INTERACTIONS: Interaction[] = [
  // ── Meridian Financial (Jordan Ellis) — cold email → proposal sent ─────────
  { id: 'seed-int-01', relationshipId: REL_IDS.meridian, type: InteractionType.ColdEmail,      subject: "Quick question about Meridian's reconciliation process",          date: dt(-53), direction: Direction.Outbound, outcome: Outcome.NoResponse, tone: Tone.Neutral,    reflection: 'Sent first cold email. No response. Will follow up in 3 days.' },
  { id: 'seed-int-02', relationshipId: REL_IDS.meridian, type: InteractionType.FollowUpEmail,  subject: "Re: Quick question about Meridian's reconciliation process",        date: dt(-49), direction: Direction.Outbound, outcome: Outcome.Positive,    tone: Tone.Energizing, reflection: 'Jordan replied — "good timing, we\'re evaluating tools right now." Booked exploratory call.' },
  { id: 'seed-int-03', relationshipId: REL_IDS.meridian, type: InteractionType.DiscoveryCall,  subject: 'Discovery — reconciliation workflow pain points',                   date: dt(-42), direction: Direction.Outbound, outcome: Outcome.Positive,    tone: Tone.Energizing, reflection: '45 min call. Confirmed: 3 FTEs spending 20hrs/week on manual rec. CFO Dana Osei joined last 10 min — very engaged. Asked about SOX compliance features. Strong fit.' },
  { id: 'seed-int-04', relationshipId: REL_IDS.meridian, type: InteractionType.FollowUpEmail,  subject: 'Signal + Meridian: tailored overview + compliance FAQ',              date: dt(-39), direction: Direction.Outbound, outcome: Outcome.Positive,    tone: Tone.Neutral,    reflection: 'Sent deck + SOX compliance one-pager. Jordan confirmed receipt and shared with Dana.' },
  { id: 'seed-int-05', relationshipId: REL_IDS.meridian, type: InteractionType.Demo,           subject: 'Full product demo — compliance + reconciliation workflows',          date: dt(-28), direction: Direction.Outbound, outcome: Outcome.Positive,    tone: Tone.Energizing, reflection: 'Demo with Jordan + Dana + 1 IT rep. Went 70 min (scheduled 60). Dana asked detailed implementation questions — buying signal. One concern: data migration timeline.' },
  { id: 'seed-int-06', relationshipId: REL_IDS.meridian, type: InteractionType.FollowUpEmail,  subject: 'Implementation timeline + migration support overview',               date: dt(-25), direction: Direction.Outbound, outcome: Outcome.Positive,    tone: Tone.Neutral,    reflection: 'Sent impl. plan. Jordan responded same day — "this is helpful, moving to procurement review."' },
  { id: 'seed-int-07', relationshipId: REL_IDS.meridian, type: InteractionType.ProposalReview, subject: 'Proposal walkthrough call',                                         date: dt(-7),  direction: Direction.Outbound, outcome: Outcome.Positive,    tone: Tone.Energizing, reflection: 'Walked through proposal line by line. Main discussion: professional services cost. Agreed to bundle 2 extra onboarding sessions. Jordan said legal review starts this week.' },

  // ── NovaLink Logistics (Priya Sharma) — cold email → demo scheduled ────────
  { id: 'seed-int-08', relationshipId: REL_IDS.novalink, type: InteractionType.ColdEmail,      subject: 'Carrier exception handling at NovaLink — 3-min read',               date: dt(-46), direction: Direction.Outbound, outcome: Outcome.NoResponse, tone: Tone.Neutral,    reflection: "Personalized cold email referencing NovaLink's LinkedIn post about Q4 delays. No response." },
  { id: 'seed-int-09', relationshipId: REL_IDS.novalink, type: InteractionType.FollowUpEmail,  subject: 'Following up — carrier exception automation',                       date: dt(-41), direction: Direction.Outbound, outcome: Outcome.NoResponse, tone: Tone.Neutral,    reflection: 'Second touch. Still no reply. Will try one more email then LinkedIn.' },
  { id: 'seed-int-10', relationshipId: REL_IDS.novalink, type: InteractionType.LinkedInMessage,subject: 'Connecting re: logistics ops automation',                            date: dt(-35), direction: Direction.Outbound, outcome: Outcome.Positive,    tone: Tone.Energizing, reflection: 'LinkedIn message worked — Priya accepted and replied within 2 hours. "Timing is right, we just kicked off vendor eval." Booked 30-min intro call.' },
  { id: 'seed-int-11', relationshipId: REL_IDS.novalink, type: InteractionType.DiscoveryCall,  subject: 'Intro / discovery call',                                            date: dt(-27), direction: Direction.Outbound, outcome: Outcome.Positive,    tone: Tone.Energizing, reflection: 'Great call. Confirmed 3-vendor shortlist. Key differentiator they care about: API flexibility for carrier integrations. Demo booked.' },
  { id: 'seed-int-12', relationshipId: REL_IDS.novalink, type: InteractionType.FollowUpEmail,  subject: 'Demo prep: agenda + carrier integration overview',                   date: dt(-3),  direction: Direction.Outbound, outcome: Outcome.Positive,    tone: Tone.Neutral,    reflection: 'Sent agenda + logistics-specific case study. Priya confirmed attendance + added her eng lead to the invite.' },

  // ── Apex Health Systems (Marcus Webb) — inbound → qualified ────────────────
  { id: 'seed-int-13', relationshipId: REL_IDS.apexhealth, type: InteractionType.Email,        subject: 'Re: Demo Request — Apex Health Systems',                            date: dt(-21), direction: Direction.Inbound,  outcome: Outcome.Positive,    tone: Tone.Energizing, reflection: 'Inbound from website form. Responded within 15 minutes. Booked discovery call same day.' },
  { id: 'seed-int-14', relationshipId: REL_IDS.apexhealth, type: InteractionType.DiscoveryCall,subject: 'Discovery — revenue cycle & billing pain points',                   date: dt(-18), direction: Direction.Inbound,  outcome: Outcome.Positive,    tone: Tone.Energizing, reflection: '60 min discovery. Marcus is meticulous — came with a list of questions. Primary pain: billing rec done in Excel across 6 facilities. HIPAA compliance is a hard requirement.' },
  { id: 'seed-int-15', relationshipId: REL_IDS.apexhealth, type: InteractionType.FollowUpEmail,subject: 'SOC 2 Type II report + HIPAA compliance overview',                   date: dt(-15), direction: Direction.Outbound, outcome: Outcome.Positive,    tone: Tone.Neutral,    reflection: 'Sent compliance docs. Marcus forwarded to IT security team (good sign — internal momentum).' },
  { id: 'seed-int-16', relationshipId: REL_IDS.apexhealth, type: InteractionType.FollowUpEmail,subject: 'Northview Health case study — similar use case',                    date: dt(-11), direction: Direction.Outbound, outcome: Outcome.Neutral,     tone: Tone.Neutral,    reflection: "Sent health system case study. No reply yet — Marcus mentioned he's traveling this week." },

  // ── Trailstone Capital (Casey Morgan) — referral → CLOSED WON ─────────────
  { id: 'seed-int-17', relationshipId: REL_IDS.trailstone, type: InteractionType.ColdCall,     subject: 'Cold call — AP workflow automation',                                date: dt(-39), direction: Direction.Outbound, outcome: Outcome.Positive,    tone: Tone.Energizing, reflection: 'Referral call from Jordan at Meridian — Casey picked up immediately. 20 min conversation. Confirmed strong fit and asked to see a demo ASAP.' },
  { id: 'seed-int-18', relationshipId: REL_IDS.trailstone, type: InteractionType.Demo,         subject: 'Product demo — AP & reconciliation',                                date: dt(-34), direction: Direction.Outbound, outcome: Outcome.Positive,    tone: Tone.Energizing, reflection: 'Short demo (40 min). Casey said "this is exactly what we\'ve been looking for." Wants to move fast — sent proposal same day.' },
  { id: 'seed-int-19', relationshipId: REL_IDS.trailstone, type: InteractionType.ProposalReview,subject: 'Proposal review + legal',                                          date: dt(-26), direction: Direction.Outbound, outcome: Outcome.Positive,    tone: Tone.Energizing, reflection: 'Casey had minor redlines on SLA terms. Resolved same day with AE. PO submitted. Closed!' },

  // ── Luminary Payments (Devon Park) — persistent outbound → qualified ───────
  { id: 'seed-int-20', relationshipId: REL_IDS.luminary, type: InteractionType.ColdCall,       subject: 'Cold call #1 — AP automation',                                     date: dt(-33), direction: Direction.Outbound, outcome: Outcome.NoResponse, tone: Tone.Neutral,    reflection: 'Voicemail left.' },
  { id: 'seed-int-21', relationshipId: REL_IDS.luminary, type: InteractionType.Voicemail,      subject: 'Follow-up voicemail re: AP automation',                             date: dt(-28), direction: Direction.Outbound, outcome: Outcome.NoResponse, tone: Tone.Neutral,    reflection: 'Second voicemail. Will follow with cold email.' },
  { id: 'seed-int-22', relationshipId: REL_IDS.luminary, type: InteractionType.ColdEmail,      subject: 'Luminary Payments + workflow automation — 2-min read',              date: dt(-26), direction: Direction.Outbound, outcome: Outcome.NoResponse, tone: Tone.Neutral,    reflection: 'Email sent day after voicemail. No reply.' },
  { id: 'seed-int-23', relationshipId: REL_IDS.luminary, type: InteractionType.ColdCall,       subject: 'Cold call #3 — connected',                                         date: dt(-20), direction: Direction.Outbound, outcome: Outcome.Positive,    tone: Tone.Energizing, reflection: "Devon picked up on 3rd call attempt. Great conversation — confirmed they're spending 15hrs/week on manual AP. Competitor is Zip. Discovery call booked." },
  { id: 'seed-int-24', relationshipId: REL_IDS.luminary, type: InteractionType.DiscoveryCall,  subject: 'Discovery — AP & Zip evaluation',                                   date: dt(-9),  direction: Direction.Outbound, outcome: Outcome.Positive,    tone: Tone.Energizing, reflection: "Thorough discovery. Devon is methodical. Zip is their other finalist — their differentiator ask is ERP integrations (we win here). Sending ROI calc." },

  // ── IronClad Insurance (Morgan Price) — referral → qualified ──────────────
  { id: 'seed-int-25', relationshipId: REL_IDS.ironclad, type: InteractionType.ColdEmail,      subject: 'Intro — workflow automation for insurance ops',                     date: dt(-19), direction: Direction.Outbound, outcome: Outcome.Positive,    tone: Tone.Energizing, reflection: 'Referral intro email from mutual contact. Morgan replied within the hour.' },
  { id: 'seed-int-26', relationshipId: REL_IDS.ironclad, type: InteractionType.DiscoveryCall,  subject: 'Discovery — claims processing workflow',                            date: dt(-13), direction: Direction.Outbound, outcome: Outcome.Positive,    tone: Tone.Energizing, reflection: "Morgan is a great internal champion. Claims processing is 100% manual — 8 FTEs. CFO sign-off required above $50k. We're at $54k so will need to make the ROI case to CFO directly." },
  { id: 'seed-int-27', relationshipId: REL_IDS.ironclad, type: InteractionType.FollowUpEmail,  subject: 'Pre-call questionnaire for discovery call #2',                      date: dt(-5),  direction: Direction.Outbound, outcome: Outcome.Positive,    tone: Tone.Neutral,    reflection: 'Sent questionnaire for CFO meeting. Morgan confirmed the CFO is "on board in principle" — good signal.' },

  // ── Pinnacle Health Network (Jamie Okafor) — large inbound ────────────────
  { id: 'seed-int-28', relationshipId: REL_IDS.pinnacle, type: InteractionType.Email,          subject: 'Re: Inbound Demo Request — Pinnacle Health Network',                date: dt(-16), direction: Direction.Inbound,  outcome: Outcome.Positive,    tone: Tone.Energizing, reflection: "Largest inbound of the quarter. Responded in 8 min. Jamie confirmed they're evaluating 3 vendors with a 60-day decision timeline." },
  { id: 'seed-int-29', relationshipId: REL_IDS.pinnacle, type: InteractionType.DiscoveryCall,  subject: 'Discovery — enterprise health network requirements',                 date: dt(-11), direction: Direction.Inbound,  outcome: Outcome.Positive,    tone: Tone.Energizing, reflection: '75 min call with Jamie + 2 ops directors. Requirements: HIPAA, EHR integrations (Epic + Cerner), multi-facility rollout, SSO. Looping in AE and Solutions Engineer.' },
  { id: 'seed-int-30', relationshipId: REL_IDS.pinnacle, type: InteractionType.FollowUpEmail,  subject: 'SOC 2 report + EHR integration documentation',                      date: dt(-7),  direction: Direction.Outbound, outcome: Outcome.Positive,    tone: Tone.Neutral,    reflection: 'Sent full security package. Jamie replied: "sharing with our CISO — expect questions." Demo scheduled next week with exec panel.' },

  // ── Skyforge Technologies (Riley Chen) — CLOSED LOST ──────────────────────
  { id: 'seed-int-31', relationshipId: REL_IDS.skyforge, type: InteractionType.ColdEmail,      subject: 'Workflow automation for HealthTech ops teams',                      date: dt(-111),direction: Direction.Outbound, outcome: Outcome.Positive,    tone: Tone.Neutral,    reflection: 'Riley replied quickly — seemed interested.' },
  { id: 'seed-int-32', relationshipId: REL_IDS.skyforge, type: InteractionType.DiscoveryCall,  subject: 'Discovery call',                                                   date: dt(-104),direction: Direction.Outbound, outcome: Outcome.Neutral,     tone: Tone.Neutral,    reflection: "Good conversation but red flag: IT team just finished an 18-month EHR integration. Riley is interested but said 'we're in IT change freeze until Q3.'" },
  { id: 'seed-int-33', relationshipId: REL_IDS.skyforge, type: InteractionType.Demo,           subject: 'Product demo',                                                     date: dt(-83), direction: Direction.Outbound, outcome: Outcome.Neutral,     tone: Tone.Neutral,    reflection: "Demo went well technically but Riley confirmed IT won't approve another integration project. Formally lost. Note to self: qualify IT bandwidth earlier." },

  // ── CrestData Analytics (Alexis Torres) — prospect outreach ───────────────
  { id: 'seed-int-34', relationshipId: REL_IDS.crestdata, type: InteractionType.ColdEmail,     subject: 'Congrats on the Series B — quick question on ops scaling',           date: dt(-28), direction: Direction.Outbound, outcome: Outcome.NoResponse, tone: Tone.Neutral,    reflection: 'Personalized email referencing their Series B. No response. Will follow up in a week.' },
  { id: 'seed-int-35', relationshipId: REL_IDS.crestdata, type: InteractionType.FollowUpEmail, subject: 'Following up — scaling ops post-fundraise',                         date: dt(-19), direction: Direction.Outbound, outcome: Outcome.NoResponse, tone: Tone.Neutral,    reflection: 'Second touch. Still no reply. Opened once according to email tracker. Will try LinkedIn.' },

  // ── Bridgeport Freight (Sam Delgado) — conference → prospect ──────────────
  { id: 'seed-int-36', relationshipId: REL_IDS.bridgeport, type: InteractionType.Meeting,      subject: 'SCA Conference — intro conversation',                               date: dt(-4),  direction: Direction.Inbound,  outcome: Outcome.Positive,    tone: Tone.Energizing, reflection: 'Met Sam at the Supply Chain Advantage conference. 15-min hallway conversation. He mentioned manual freight audit process as a recurring headache. Agreed to connect on LinkedIn.' },

  // ── CascadeOps (Avery Nguyen) — cold outbound ──────────────────────────────
  { id: 'seed-int-37', relationshipId: REL_IDS.cascadeops, type: InteractionType.ColdEmail,    subject: 'Scaling ops across 3 new CascadeOps warehouses',                    date: dt(-13), direction: Direction.Outbound, outcome: Outcome.NoResponse, tone: Tone.Neutral,    reflection: 'Personalized email referencing their warehouse expansion LinkedIn post. Opened twice, no reply.' },
  { id: 'seed-int-38', relationshipId: REL_IDS.cascadeops, type: InteractionType.FollowUpEmail,subject: 'Re: Scaling ops across 3 new CascadeOps warehouses',                 date: dt(-6),  direction: Direction.Outbound, outcome: Outcome.NoResponse, tone: Tone.Neutral,    reflection: 'Second touch. Will pivot to LinkedIn next.' },
];

import {
  getRelationships,
  getInteractions,
  saveRelationships,
  saveInteractions,
  saveAuditLog,
} from '../storage';
import { AuditEvent, AuditEventType } from '../types';

// ── Seed audit log ──────────────────────────────────────────────────────────
// Realistic trail matching the lifecycle of each seed relationship.
// IDs are stable (seed-aud-XX) so loadSeedData() stays idempotent.

function aud(
  id: string,
  type: AuditEventType,
  relId: string,
  relName: string,
  org: string,
  ts: string,
  detail: string,
  extra?: Partial<AuditEvent>,
): AuditEvent {
  return { id, type, relationshipId: relId, relationshipName: relName, organization: org, timestamp: ts, detail, ...extra };
}

export const SEED_AUDIT_EVENTS: AuditEvent[] = [
  // ── Meridian Financial ──────────────────────────────────────────────────
  aud('seed-aud-01','lead_created' as AuditEventType, REL_IDS.meridian,'Jordan Ellis','Meridian Financial',dt(-54,9,14),'Lead created — Prospect · $84,000',{newValue:'Prospect'}),
  aud('seed-aud-02',AuditEventType.ActivityLogged,    REL_IDS.meridian,'Jordan Ellis','Meridian Financial',dt(-53,10,2),'Activity logged — Cold Email: "Quick question about Meridian\'s reconciliation process" · No Response',{interactionType:'Cold Email',newValue:'No Response'}),
  aud('seed-aud-03',AuditEventType.ActivityLogged,    REL_IDS.meridian,'Jordan Ellis','Meridian Financial',dt(-49,11,30),'Activity logged — Follow-up Email · Positive',{interactionType:'Follow-up Email',newValue:'Positive'}),
  aud('seed-aud-04',AuditEventType.StageChanged,      REL_IDS.meridian,'Jordan Ellis','Meridian Financial',dt(-49,11,35),'Stage: Prospect → Qualified',{oldValue:'Prospect',newValue:'Qualified'}),
  aud('seed-aud-05',AuditEventType.FollowUpChanged,   REL_IDS.meridian,'Jordan Ellis','Meridian Financial',dt(-49,11,36),'Follow-up date set',{newValue:dt(-42)}),
  aud('seed-aud-06',AuditEventType.ActivityLogged,    REL_IDS.meridian,'Jordan Ellis','Meridian Financial',dt(-42,14,0),'Activity logged — Discovery Call · Positive',{interactionType:'Discovery Call',newValue:'Positive'}),
  aud('seed-aud-07',AuditEventType.NextActionChanged,  REL_IDS.meridian,'Jordan Ellis','Meridian Financial',dt(-42,14,45),'Next action updated',{oldValue:'Book discovery call',newValue:'Send tailored deck + SOX compliance FAQ'}),
  aud('seed-aud-08',AuditEventType.ActivityLogged,    REL_IDS.meridian,'Jordan Ellis','Meridian Financial',dt(-28,15,0),'Activity logged — Demo · Positive',{interactionType:'Demo',newValue:'Positive'}),
  aud('seed-aud-09',AuditEventType.StageChanged,      REL_IDS.meridian,'Jordan Ellis','Meridian Financial',dt(-28,16,0),'Stage: Qualified → Demo Scheduled',{oldValue:'Qualified',newValue:'Demo Scheduled'}),
  aud('seed-aud-10',AuditEventType.StageChanged,      REL_IDS.meridian,'Jordan Ellis','Meridian Financial',dt(-7,10,0),'Stage: Demo Scheduled → Proposal Sent',{oldValue:'Demo Scheduled',newValue:'Proposal Sent'}),
  aud('seed-aud-11',AuditEventType.ActivityLogged,    REL_IDS.meridian,'Jordan Ellis','Meridian Financial',dt(-7,10,30),'Activity logged — Proposal Review: "Proposal walkthrough call" · Positive',{interactionType:'Proposal Review',newValue:'Positive'}),
  aud('seed-aud-12',AuditEventType.FollowUpChanged,   REL_IDS.meridian,'Jordan Ellis','Meridian Financial',dt(-7,10,35),'Follow-up date updated',{newValue:dt(-2)}),

  // ── NovaLink Logistics ──────────────────────────────────────────────────
  aud('seed-aud-13',AuditEventType.LeadCreated,       REL_IDS.novalink,'Priya Sharma','NovaLink Logistics',dt(-47,8,45),'Lead created — Prospect · $60,000',{newValue:'Prospect'}),
  aud('seed-aud-14',AuditEventType.ActivityLogged,    REL_IDS.novalink,'Priya Sharma','NovaLink Logistics',dt(-46,9,0),'Activity logged — Cold Email · No Response',{interactionType:'Cold Email',newValue:'No Response'}),
  aud('seed-aud-15',AuditEventType.ActivityLogged,    REL_IDS.novalink,'Priya Sharma','NovaLink Logistics',dt(-35,14,0),'Activity logged — LinkedIn Message · Positive',{interactionType:'LinkedIn Message',newValue:'Positive'}),
  aud('seed-aud-16',AuditEventType.StageChanged,      REL_IDS.novalink,'Priya Sharma','NovaLink Logistics',dt(-35,14,5),'Stage: Prospect → Qualified',{oldValue:'Prospect',newValue:'Qualified'}),
  aud('seed-aud-17',AuditEventType.ActivityLogged,    REL_IDS.novalink,'Priya Sharma','NovaLink Logistics',dt(-27,11,0),'Activity logged — Discovery Call · Positive',{interactionType:'Discovery Call',newValue:'Positive'}),
  aud('seed-aud-18',AuditEventType.StageChanged,      REL_IDS.novalink,'Priya Sharma','NovaLink Logistics',dt(-27,11,45),'Stage: Qualified → Demo Scheduled',{oldValue:'Qualified',newValue:'Demo Scheduled'}),
  aud('seed-aud-19',AuditEventType.NextActionChanged,  REL_IDS.novalink,'Priya Sharma','NovaLink Logistics',dt(-3,9,0),'Next action updated',{newValue:'Send demo confirmation + agenda; prep logistics-specific deck'}),

  // ── Apex Health Systems ──────────────────────────────────────────────────
  aud('seed-aud-20',AuditEventType.LeadCreated,       REL_IDS.apexhealth,'Marcus Webb','Apex Health Systems',dt(-21,8,30),'Lead created — Qualified (inbound) · $120,000',{newValue:'Qualified'}),
  aud('seed-aud-21',AuditEventType.ActivityLogged,    REL_IDS.apexhealth,'Marcus Webb','Apex Health Systems',dt(-21,8,45),'Activity logged — Email: "Re: Demo Request — Apex Health Systems" · Positive',{interactionType:'Email',newValue:'Positive'}),
  aud('seed-aud-22',AuditEventType.ActivityLogged,    REL_IDS.apexhealth,'Marcus Webb','Apex Health Systems',dt(-18,10,0),'Activity logged — Discovery Call · Positive',{interactionType:'Discovery Call',newValue:'Positive'}),
  aud('seed-aud-23',AuditEventType.FollowUpChanged,   REL_IDS.apexhealth,'Marcus Webb','Apex Health Systems',dt(-18,11,0),'Follow-up date set',{newValue:dt(1)}),
  aud('seed-aud-24',AuditEventType.NextActionChanged,  REL_IDS.apexhealth,'Marcus Webb','Apex Health Systems',dt(-18,11,1),'Next action updated',{newValue:'Send case study from Northview Health, schedule discovery call #2 with IT'}),

  // ── Trailstone Capital (closed won) ──────────────────────────────────────
  aud('seed-aud-25',AuditEventType.LeadCreated,       REL_IDS.trailstone,'Casey Morgan','Trailstone Capital',dt(-40,10,0),'Lead created — Prospect (referral) · $48,000',{newValue:'Prospect'}),
  aud('seed-aud-26',AuditEventType.ActivityLogged,    REL_IDS.trailstone,'Casey Morgan','Trailstone Capital',dt(-39,14,0),'Activity logged — Cold Call · Positive',{interactionType:'Cold Call',newValue:'Positive'}),
  aud('seed-aud-27',AuditEventType.StageChanged,      REL_IDS.trailstone,'Casey Morgan','Trailstone Capital',dt(-39,14,10),'Stage: Prospect → Qualified',{oldValue:'Prospect',newValue:'Qualified'}),
  aud('seed-aud-28',AuditEventType.ActivityLogged,    REL_IDS.trailstone,'Casey Morgan','Trailstone Capital',dt(-34,15,0),'Activity logged — Demo · Positive',{interactionType:'Demo',newValue:'Positive'}),
  aud('seed-aud-29',AuditEventType.StageChanged,      REL_IDS.trailstone,'Casey Morgan','Trailstone Capital',dt(-34,15,45),'Stage: Qualified → Proposal Sent',{oldValue:'Qualified',newValue:'Proposal Sent'}),
  aud('seed-aud-30',AuditEventType.LeadClosedWon,     REL_IDS.trailstone,'Casey Morgan','Trailstone Capital',dt(-17,16,0),'Stage: Proposal Sent → Closed Won',{oldValue:'Proposal Sent',newValue:'Closed Won'}),

  // ── IronClad Insurance ──────────────────────────────────────────────────
  aud('seed-aud-31',AuditEventType.LeadCreated,       REL_IDS.ironclad,'Morgan Price','IronClad Insurance',dt(-19,9,0),'Lead created — Prospect (referral) · $54,000',{newValue:'Prospect'}),
  aud('seed-aud-32',AuditEventType.ActivityLogged,    REL_IDS.ironclad,'Morgan Price','IronClad Insurance',dt(-19,9,30),'Activity logged — Cold Email · Positive',{interactionType:'Cold Email',newValue:'Positive'}),
  aud('seed-aud-33',AuditEventType.StageChanged,      REL_IDS.ironclad,'Morgan Price','IronClad Insurance',dt(-19,9,35),'Stage: Prospect → Qualified',{oldValue:'Prospect',newValue:'Qualified'}),
  aud('seed-aud-34',AuditEventType.ActivityLogged,    REL_IDS.ironclad,'Morgan Price','IronClad Insurance',dt(-13,11,0),'Activity logged — Discovery Call · Positive',{interactionType:'Discovery Call',newValue:'Positive'}),
  aud('seed-aud-35',AuditEventType.FollowUpChanged,   REL_IDS.ironclad,'Morgan Price','IronClad Insurance',dt(-5,10,0),'Follow-up date set',{newValue:dt(0)}),

  // ── Pinnacle Health Network ──────────────────────────────────────────────
  aud('seed-aud-36',AuditEventType.LeadCreated,       REL_IDS.pinnacle,'Jamie Okafor','Pinnacle Health Network',dt(-16,8,0),'Lead created — Qualified (inbound) · $150,000',{newValue:'Qualified'}),
  aud('seed-aud-37',AuditEventType.ActivityLogged,    REL_IDS.pinnacle,'Jamie Okafor','Pinnacle Health Network',dt(-16,8,8),'Activity logged — Email: "Re: Inbound Demo Request" · Positive',{interactionType:'Email',newValue:'Positive'}),
  aud('seed-aud-38',AuditEventType.ActivityLogged,    REL_IDS.pinnacle,'Jamie Okafor','Pinnacle Health Network',dt(-11,14,0),'Activity logged — Discovery Call · Positive',{interactionType:'Discovery Call',newValue:'Positive'}),
  aud('seed-aud-39',AuditEventType.StageChanged,      REL_IDS.pinnacle,'Jamie Okafor','Pinnacle Health Network',dt(-11,15,0),'Stage: Qualified → Demo Scheduled',{oldValue:'Qualified',newValue:'Demo Scheduled'}),
  aud('seed-aud-40',AuditEventType.NextActionChanged,  REL_IDS.pinnacle,'Jamie Okafor','Pinnacle Health Network',dt(-7,9,0),'Next action updated',{newValue:'Send security questionnaire response + SOC 2 Type II report'}),

  // ── Skyforge Technologies (closed lost) ─────────────────────────────────
  aud('seed-aud-41',AuditEventType.LeadCreated,       REL_IDS.skyforge,'Riley Chen','Skyforge Technologies',dt(-113,10,0),'Lead created — Prospect',{newValue:'Prospect'}),
  aud('seed-aud-42',AuditEventType.StageChanged,      REL_IDS.skyforge,'Riley Chen','Skyforge Technologies',dt(-104,11,0),'Stage: Prospect → Qualified',{oldValue:'Prospect',newValue:'Qualified'}),
  aud('seed-aud-43',AuditEventType.ActivityLogged,    REL_IDS.skyforge,'Riley Chen','Skyforge Technologies',dt(-83,14,0),'Activity logged — Demo · Neutral',{interactionType:'Demo',newValue:'Neutral'}),
  aud('seed-aud-44',AuditEventType.LeadClosedLost,    REL_IDS.skyforge,'Riley Chen','Skyforge Technologies',dt(-30,9,0),'Stage: Qualified → Closed Lost — IT change freeze',{oldValue:'Qualified',newValue:'Closed Lost'}),

  // ── Luminary Payments ──────────────────────────────────────────────────
  aud('seed-aud-45',AuditEventType.LeadCreated,       REL_IDS.luminary,'Devon Park','Luminary Payments',dt(-34,9,0),'Lead created — Prospect · $72,000',{newValue:'Prospect'}),
  aud('seed-aud-46',AuditEventType.ActivityLogged,    REL_IDS.luminary,'Devon Park','Luminary Payments',dt(-20,10,0),'Activity logged — Cold Call · Positive',{interactionType:'Cold Call',newValue:'Positive'}),
  aud('seed-aud-47',AuditEventType.StageChanged,      REL_IDS.luminary,'Devon Park','Luminary Payments',dt(-20,10,15),'Stage: Prospect → Qualified',{oldValue:'Prospect',newValue:'Qualified'}),
  aud('seed-aud-48',AuditEventType.ActivityLogged,    REL_IDS.luminary,'Devon Park','Luminary Payments',dt(-9,15,0),'Activity logged — Discovery Call · Positive',{interactionType:'Discovery Call',newValue:'Positive'}),

  // ── CrestData / Bridgeport / Verdant / CascadeOps (prospect-stage) ───────
  aud('seed-aud-49',AuditEventType.LeadCreated,       REL_IDS.crestdata,'Alexis Torres','CrestData Analytics',dt(-30,8,0),'Lead created — Prospect · $36,000',{newValue:'Prospect'}),
  aud('seed-aud-50',AuditEventType.ActivityLogged,    REL_IDS.crestdata,'Alexis Torres','CrestData Analytics',dt(-28,9,0),'Activity logged — Cold Email · No Response',{interactionType:'Cold Email',newValue:'No Response'}),
  aud('seed-aud-51',AuditEventType.LeadCreated,       REL_IDS.bridgeport,'Sam Delgado','Bridgeport Freight',dt(-4,17,0),'Lead created — Prospect (event) · $42,000',{newValue:'Prospect'}),
  aud('seed-aud-52',AuditEventType.ActivityLogged,    REL_IDS.bridgeport,'Sam Delgado','Bridgeport Freight',dt(-4,17,5),'Activity logged — Meeting: "SCA Conference — intro conversation" · Positive',{interactionType:'Meeting',newValue:'Positive'}),
  aud('seed-aud-53',AuditEventType.LeadCreated,       REL_IDS.verdant,'Taylor Brooks','Verdant AgriTech',dt(-26,9,0),'Lead created — Prospect · $28,000',{newValue:'Prospect'}),
  aud('seed-aud-54',AuditEventType.LeadCreated,       REL_IDS.cascadeops,'Avery Nguyen','CascadeOps',dt(-13,9,0),'Lead created — Prospect · $32,000',{newValue:'Prospect'}),
  aud('seed-aud-55',AuditEventType.ActivityLogged,    REL_IDS.cascadeops,'Avery Nguyen','CascadeOps',dt(-13,9,0),'Activity logged — Cold Email · No Response',{interactionType:'Cold Email',newValue:'No Response'}),
];

/**
 * Loads seed data into localStorage — ONLY if it hasn't been loaded yet.
 * Never overwrites existing non-seed records. Safe to call multiple times.
 */
export function loadSeedData(): { added: number } {
  const existingRels = getRelationships();
  const existingInts = getInteractions();
  const existingAudit = ([] as AuditEvent[]).concat(
    (() => { try { return JSON.parse(localStorage.getItem('signal-app-data') || '{}').auditLog || []; } catch { return []; } })()
  );

  const existingRelIds   = new Set(existingRels.map(r => r.id));
  const existingIntIds   = new Set(existingInts.map(i => i.id));
  const existingAuditIds = new Set(existingAudit.map((e: AuditEvent) => e.id));

  const newRels   = SEED_RELATIONSHIPS.filter(r => !existingRelIds.has(r.id));
  const newInts   = SEED_INTERACTIONS.filter(i => !existingIntIds.has(i.id));
  const newAudits = SEED_AUDIT_EVENTS.filter(e => !existingAuditIds.has(e.id));

  if (newRels.length   > 0) saveRelationships([...existingRels, ...newRels]);
  if (newInts.length   > 0) saveInteractions([...existingInts, ...newInts]);
  if (newAudits.length > 0) saveAuditLog([...existingAudit, ...newAudits]
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp)));

  return { added: newRels.length };
}
