# Strategic Knowledge Base: Systems Thinking

Knowledge frameworks extracted from books by the knowledge-etl pipeline.

<knowledge_base source="test-book" version="1.0">
  <metadata>
    <title>Test Book</title>
    <author>Test Author</author>
    <domain>systems-thinking</domain>
    <extracted>2026-03-01</extracted>
  </metadata>
  <frameworks>
    <framework name="Systems Thinking" type="explicit">
      <description>A way of thinking</description>
    </framework>
  </frameworks>
  <decision_heuristics>
    <heuristic>When complexity rises simplify the model</heuristic>
  </decision_heuristics>
  <anti_patterns>
    <anti_pattern>
      <mistake>Ignoring feedback delays</mistake>
      <why_wrong>Creates oscillation</why_wrong>
    </anti_pattern>
  </anti_patterns>
  <trigger_questions>
    <trigger>
      <question>What feedback loops exist in this system?</question>
      <purpose>Structure discovery</purpose>
    </trigger>
  </trigger_questions>
</knowledge_base>

<knowledge_base source="test-book-2" version="1.0">
  <metadata>
    <title>Test Book</title>
    <author>Test Author</author>
    <domain>systems-thinking</domain>
    <extracted>2026-03-01</extracted>
  </metadata>
</knowledge_base>

<knowledge_base source="thinking-in-systems" version="1.0">
  <metadata>
    <title>Thinking in Systems</title>
    <author>Donella H. Meadows</author>
    <domain>systems-thinking</domain>
    <extracted>2026-03-11</extracted>
  </metadata>
  <frameworks>
    <framework name="Elements-Interconnections-Purpose (EIP) System Definition" type="explicit">
      <description>A system must consist of exactly three components: elements (the visible, tangible parts), interconnections (the relationships and information flows holding elements together), and a function or purpose (the goal the system serves). The three interact, but purpose is typically the least obvious and most determinative of behavior. This framework is the entry point for all systems analysis — it determines whether a situation is a system and where behavioral leverage lies.</description>
      <components>
        <component>Elements: visible, tangible, countable parts of the system — most observable, least impactful lever</component>
        <component>Interconnections: information flows, rules, and relationships linking elements — medium observability, medium leverage</component>
        <component>Function/Purpose: the goal or behavior the system produces, deduced from observation not stated intent — least visible, highest leverage</component>
      </components>
    </framework>
    <framework name="Stock-and-Flow Dynamics Model" type="explicit">
      <description>Systems are understood through stocks (accumulated quantities measurable at any moment) and flows (rates of change that fill or drain stocks over time). The level of a stock at any moment is the memory of all historical flows, and behavior over time is determined by the relationship between inflows and outflows. Stocks change only as fast as their flows allow, creating inherent momentum and delay in all systemic change.</description>
      <components>
        <component>Stock: an accumulation (physical or informational) measurable at a given moment in time</component>
        <component>Inflow: a rate that increases the stock over time</component>
        <component>Outflow: a rate that decreases the stock over time</component>
        <component>Dynamic equilibrium: the state when inflows equal outflows — stock level is stable but not static</component>
      </components>
    </framework>
    <framework name="Balancing Feedback Loop (Goal-Seeking Structure)" type="explicit">
      <description>A feedback loop in which a stock's deviation from a goal triggers corrective action to restore the stock toward that goal. It is self-correcting and stability-seeking, opposing whatever direction of change is imposed on the system. It is simultaneously a source of stability and a source of resistance to change. The goal embedded in the loop must be set to compensate for any simultaneous draining or filling processes, or the loop will systematically miss its target.</description>
      <components>
        <component>Goal: the desired state for the stock</component>
        <component>Monitoring/signal: detection of discrepancy between actual and desired state</component>
        <component>Corrective action: adjustment of inflow or outflow to close the discrepancy</component>
        <component>Goal calibration: the goal must account for simultaneous drain or fill processes to avoid systematic undershoot or overshoot</component>
      </components>
    </framework>
    <framework name="Reinforcing Feedback Loop (Self-Multiplying Structure)" type="explicit">
      <description>A feedback loop in which a stock's growth (or decline) generates conditions that accelerate further growth (or decline) in the same direction. It produces exponential behavior — virtuous cycles or vicious circles — and will ultimately destroy itself or be constrained by a balancing loop. Exponential growth is routinely underestimated; the doubling-time shortcut (70 ÷ growth rate %) provides a rapid calibration tool.</description>
      <components>
        <component>Stock with capacity to reproduce or grow as a fraction of itself</component>
        <component>Gain rate: the fraction by which the stock amplifies each cycle</component>
        <component>Runaway direction: upward growth (virtuous circle) or collapse (vicious circle)</component>
        <component>Doubling time: 70 ÷ growth rate (%) — the time for an exponentially growing stock to double in size</component>
      </components>
    </framework>
    <framework name="Structure-Before-Blame Diagnostic" type="implicit">
      <description>A two-step reframing protocol that consistently redirects causal attribution from external actors or events to internal system structure. Every persistent problem is treated as evidence of a structural source within the system, not an external cause. Step 1: resist naming a person, event, or outside force as the cause. Step 2: identify which stock, flow, or feedback loop within the system generates the behavior.</description>
      <components>
        <component>Step 1 — Resist external attribution: suspend the impulse to name a person, event, or outside force as the cause</component>
        <component>Step 2 — Locate structural source: identify which stock, flow, feedback loop, or purpose within the system generates the observed behavior</component>
      </components>
    </framework>
    <framework name="Purpose-Primacy Hierarchy" type="implicit">
      <description>A leverage-prioritization framework that ranks the three EIP system components in reverse order of their impact on behavior. Elements are most visible but least determinative; purpose is least visible but most determinative. When intervening in a system, look last at elements and first at purpose and interconnections.</description>
      <components>
        <component>Lowest leverage: elements (most visible, most often changed, least impactful unless they alter relationships or purpose)</component>
        <component>Medium leverage: interconnections (information flows, rules, relationships — restructuring these changes behavior significantly)</component>
        <component>Highest leverage: purpose/function (least visible, most determinative of all downstream behavior)</component>
      </components>
    </framework>
    <framework name="Inflow-Outflow Symmetry Principle" type="implicit">
      <description>A corrective decision framework addressing the systematic human bias toward inflow manipulation. The same change in stock level can be achieved by manipulating either inflows OR outflows, but human cognition systematically neglects outflows. Before defaulting to increasing inputs, always evaluate whether reducing outflows achieves the same result more cheaply or efficiently.</description>
      <components>
        <component>Inflow lever: increasing the rate of input to raise stock level (the cognitively default solution)</component>
        <component>Outflow lever: decreasing the rate of drain to raise stock level (systematically overlooked, often more efficient)</component>
      </components>
    </framework>
  </frameworks>
  <decision_heuristics>
    <heuristic>WHEN observing a persistent behavior pattern over time → DO search for a feedback loop generating that consistent pattern BECAUSE if a behavior persists, there is a mechanism — a feedback loop — maintaining it</heuristic>
    <heuristic>WHEN trying to determine a system's purpose → DO observe its actual behavior over time rather than reading its stated mission or goals BECAUSE purposes are deduced from behavior, not from rhetoric</heuristic>
    <heuristic>WHEN a stock is large relative to its flows → DO expect slow response to any intervention and design policy with correspondingly extended time horizons BECAUSE stocks take time to change, acting as delays, lags, buffers, and sources of momentum</heuristic>
    <heuristic>WHEN a reinforcing loop is dominant → DO use the doubling-time shortcut (70 ÷ growth rate %) to anticipate how quickly the system will reach critical scale BECAUSE exponential growth is routinely and dangerously underestimated by linear intuition</heuristic>
    <heuristic>WHEN a balancing loop is failing to reach its target → DO check whether the loop's goal has been set high enough to compensate for simultaneous draining or filling processes affecting the stock BECAUSE a balancing loop must offset all concurrent flows, not just the directly managed one</heuristic>
    <heuristic>WHEN a feedback loop delivers information about a stock → DO recognize that this signal can only shape future behavior, not retroactively correct the behavior that generated the current state BECAUSE information in a feedback loop operates with inherent delay and can never be instantaneous</heuristic>
    <heuristic>WHEN facing a shortage or deficit in any stock → DO evaluate reducing outflows as an equivalent alternative to increasing inflows BEFORE committing to input-based solutions BECAUSE outflow reduction achieves identical stock-level outcomes and is systematically underweighted by human cognition</heuristic>
  </decision_heuristics>
  <anti_patterns>
    <anti_pattern>
      <mistake>Attributing system behavior to external actors, events, or forces rather than to the system's internal structure</mistake>
      <why_wrong>The same external event applied to a different system produces different results; therefore the system's structure — not the external event — is the true source of behavior. Blaming external causes permanently blocks structural diagnosis and condemns the analyst to repeat the same failed interventions.</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Changing the elements (people, components, personnel) of a system while leaving interconnections and purpose intact, and expecting significant behavioral change</mistake>
      <why_wrong>Elements are the least impactful lever in a system. A system generally goes on being itself even with complete substitution of elements as long as interconnections and purposes remain intact. Swapping people without changing the rules or goals changes nothing structural.</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Focusing only on inflows when trying to increase a stock, ignoring the equivalent power of reducing outflows</mistake>
      <why_wrong>Human cognition systematically underweights outflows, leading to expensive input-based solutions when cheaper outflow-reduction alternatives exist and produce identical stock-level outcomes.</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Underestimating the momentum of large stocks and expecting rapid change from interventions</mistake>
      <why_wrong>Stocks change only as fast as their flows allow; large stocks with slow flows will resist even forceful interventions for extended periods. Impatience leads to premature policy abandonment or policy reversal before structural change has had time to manifest.</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Looking for a single external technical fix, new person, or policy lever to solve persistent systemic problems (hunger, poverty, environmental degradation, conflict)</mistake>
      <why_wrong>Problems rooted in internal system structure will persist regardless of external fixes because the structural source continues to generate the behavior. The fix addresses a symptom while leaving the generating mechanism intact.</why_wrong>
    </anti_pattern>
  </anti_patterns>
  <trigger_questions>
    <trigger>
      <question>Instead of asking who is to blame — ask: What is the system?</question>
      <purpose>The foundational reframe of systems thinking: redirects causal analysis from individual actors to structural sources of behavior. Makes systems analysis actionable by locating the correct unit of intervention.</purpose>
    </trigger>
    <trigger>
      <question>Am I looking at a system or just a collection of unrelated parts? Can I identify distinct parts? Do the parts affect each other? Do the parts together produce an effect different from each part alone? Does this behavior persist across varying circumstances?</question>
      <purpose>Diagnostic entry point: determines whether a situation warrants systems analysis by confirming genuine systemic interdependence before applying any system tools. Prevents over-application of systems framing to non-systemic situations.</purpose>
    </trigger>
    <trigger>
      <question>If A causes B, is it possible that B also causes A?</question>
      <purpose>Reveals hidden feedback loops; shifts thinking from linear cause-effect chains to circular causality, which is the foundational cognitive move of systems analysis. Transforms diagnosis from 'who pushed whom' to 'what loop are we in?'</purpose>
    </trigger>
    <trigger>
      <question>What is the actual behavior of this system over time — and what does that behavior (not the stated mission) reveal about its true purpose?</question>
      <purpose>Strips away rhetoric and stated goals to expose the purpose actually being served by the system's structure. Since purpose is the highest-leverage intervention point, correctly identifying it is prerequisite to effective change.</purpose>
    </trigger>
    <trigger>
      <question>Can I think of any human decision that is made without any feedback about the level of the stock it influences?</question>
      <purpose>Pedagogical probe that trains the practitioner to see feedback loops as ubiquitous and unavoidable. Makes visible how thoroughly all decisions are embedded in system structure, and how feedback is the normal condition — not the exception.</purpose>
    </trigger>
  </trigger_questions>
</knowledge_base>