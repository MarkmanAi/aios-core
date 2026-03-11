# Strategic Knowledge Base: Org Design

Knowledge frameworks extracted from books by the knowledge-etl pipeline.

<knowledge_base source="team-topologies" version="1.0">
  <metadata>
    <title>Team Topologies: Organizing Business and Technology Teams for Fast Flow</title>
    <author>Matthew Skelton &amp; Manuel Pais</author>
    <domain>org-design</domain>
    <extracted>2026-03-11</extracted>
  </metadata>
</knowledge_base>

<knowledge_base source="team-topologies" version="1.0">
  <metadata>
    <title>Team Topologies: Organizing Business and Technology Teams for Fast Flow</title>
    <author>Matthew Skelton &amp; Manuel Pais</author>
    <domain>org-design</domain>
    <extracted>2026-03-11</extracted>
  </metadata>
  <frameworks>
    <framework name="Conway's Law + Reverse Conway Maneuver (Unified)" type="explicit">
      <description>Conway's Law (1968) states that organizations are constrained to produce system designs that mirror their internal communication structures — a deterministic 'homomorphic force' that operates whether or not it is acknowledged. The Reverse Conway Maneuver is the strategic inversion: leaders first define the desired software architecture, then deliberately redesign team communication structures to match it, allowing the homomorphic force to produce the desired architecture naturally. Together, these form a bidirectional analytical framework: (1) given current team communication paths, predict the architecture that will emerge; (2) given a desired architecture, derive the team structure required to produce it.</description>
      <components>
        <component>Communication structures of the organization (real, not org-chart-stated)</component>
        <component>Resulting software architecture (mirrors communication structures)</component>
        <component>Homomorphic force (self-similar pull that makes system shape converge with team shape)</component>
        <component>Forward direction: given teams → predict architecture</component>
        <component>Reverse direction: given desired architecture → derive required team structure</component>
        <component>Selective communication optimization: tune communication deliberately, not maximize it</component>
      </components>
    </framework>
    <framework name="Team Topologies Operating Model (Four Types + Three Modes)" type="explicit">
      <description>The book's core prescriptive framework: four fundamental team types combined with three interaction modes, applied with awareness of Conway's Law and cognitive load. Stream-aligned teams are primary; enabling, platform, and complicated-subsystem teams exist to reduce burden on stream-aligned teams. All three interaction modes govern how these teams relate to each other at any given moment.</description>
      <components>
        <component>Stream-aligned team: aligned to a single valuable stream of work, empowered to deliver end-to-end without hand-offs</component>
        <component>Enabling team: specialists who help stream-aligned teams acquire missing capabilities for a bounded period</component>
        <component>Complicated-subsystem team: specialists managing parts of the system requiring deep expertise that exceeds stream-aligned team cognitive load</component>
        <component>Platform team: provides internal services via self-service APIs and tools to reduce cognitive load on stream-aligned teams</component>
        <component>Collaboration mode: two teams work closely together; boundaries blur; best for discovery and novel technology</component>
        <component>X-as-a-Service mode: one team consumes or provides something with minimal interaction; best for predictable delivery</component>
        <component>Facilitating mode: one team helps another learn, adopt new approaches, or clear impediments</component>
        <component>Primary Interaction Mode Map: stream-aligned uses Collaboration + X-as-a-Service (typical), Facilitating (occasional); enabling uses Facilitating (typical); complicated-subsystem and platform use X-as-a-Service (typical)</component>
      </components>
    </framework>
    <framework name="Three-Type Cognitive Load Taxonomy (Sweller)" type="explicit">
      <description>A classification of cognitive load into three types used as an action framework: minimize intrinsic load through training and tooling, eliminate extraneous load through automation, and preserve cognitive space for germane load where value is created.</description>
      <components>
        <component>Intrinsic cognitive load: fundamental task knowledge (minimize via training, tooling, good technology choices)</component>
        <component>Extraneous cognitive load: environmental overhead unrelated to value (eliminate via automation)</component>
        <component>Germane cognitive load: domain-specific value-add thinking (protect and maximize)</component>
      </components>
    </framework>
    <framework name="Dunbar-Based Team Scaling" type="explicit">
      <description>A nested, concentric model for sizing teams and organizational groupings based on anthropological limits of human trust and recognition. When a grouping exceeds its tier's limit, a new semi-independent unit must be formed. Governs team size, team-of-teams size, divisional size, and software architecture simultaneously.</description>
      <components>
        <component>~5 people: limit of close personal relationships and working memory</component>
        <component>~15 people: limit of deep trust (single team ceiling in high-trust orgs)</component>
        <component>~50 people: limit of mutual trust (tribe/family ceiling)</component>
        <component>~150 people: limit of remembered capabilities (division ceiling)</component>
        <component>~500–1500 people: outer organizational limits with 3x multiplier pattern</component>
      </components>
    </framework>
    <framework name="Team API" type="explicit">
      <description>An explicit, multi-dimensional specification of how a team presents itself to other teams — extending the software API metaphor to encompass code artifacts, documentation, communication norms, working practices, and roadmap visibility. Teams must actively design, advertise, test, and evolve their API.</description>
      <components>
        <component>Code: runtime endpoints, libraries, clients, UI produced by the team</component>
        <component>Versioning: how the team communicates breaking changes (e.g., SemVer)</component>
        <component>Wiki and documentation: especially how-to guides</component>
        <component>Practices and principles: preferred ways of working</component>
        <component>Communication: approach to remote tools and channels</component>
        <component>Work information: current work, upcoming priorities, roadmap</component>
      </components>
    </framework>
    <framework name="Fracture Plane Typology" type="explicit">
      <description>A seven-category taxonomy of natural seams in software systems along which monoliths can be cleanly split. Each fracture plane represents a distinct organizing principle for assigning software responsibility to teams. Planes should be combined rather than applied in isolation. The primary validity test for any plane: Does the resulting architecture support more autonomous teams with reduced cognitive load?</description>
      <components>
        <component>Business Domain Bounded Context: align to internally consistent business domain areas using DDD</component>
        <component>Regulatory Compliance: split off subsystems within specific regulatory scope (e.g., PCI DSS)</component>
        <component>Change Cadence: separate parts that need to change at different frequencies</component>
        <component>Team Location: split to match natural communication constraints of geographically distributed teams</component>
        <component>Risk: separate subsystems with clearly different risk profiles</component>
        <component>Performance Isolation: split off subsystems subject to extreme scaling demands</component>
        <component>Technology: separate only when stacks are so disparate that cognitive load and context switching become untenable (use sparingly)</component>
        <component>User Personas: split off subsystems used by distinct, separable user groups</component>
      </components>
    </framework>
    <framework name="Hidden Monolith Taxonomy" type="explicit">
      <description>A six-category typology of distinct ways monolithic coupling manifests in software delivery systems. Architectural decoupling at the code level is insufficient if coupling persists at the database, build, release, model, thinking, or workplace level.</description>
      <components>
        <component>Application Monolith: single large application with many dependencies deployed as a unit</component>
        <component>Joined-at-the-Database Monolith: separate applications all coupled to the same database schema</component>
        <component>Monolithic Build: one gigantic CI build covering the entire codebase</component>
        <component>Monolithic (Coupled) Release: independently buildable components bundled into a single release</component>
        <component>Monolithic Model: single domain language forced across many different bounded contexts</component>
        <component>Monolithic Thinking: one-size-fits-all standardization of technology across all teams</component>
        <component>Monolithic Workplace: single office layout pattern that prevents team-appropriate collaboration modes</component>
      </components>
    </framework>
    <framework name="DevOps Topologies Pattern Catalog" type="explicit">
      <description>An online catalog of team design and interaction patterns and anti-patterns for technology teams. Encodes two key ideas: no universal topology fits all contexts, and several topologies are known to be actively detrimental. Primary value is initiating structured conversations about team responsibilities, interfaces, and collaboration.</description>
      <components>
        <component>Pattern catalog: named topology configurations that work in specific contexts</component>
        <component>Anti-pattern catalog: configurations known to be detrimental to DevOps success</component>
        <component>Context-dependency principle: suitability depends on organization size, maturity, and goals</component>
        <component>Evolutionary trajectory: topologies should be planned across stages, not selected once</component>
      </components>
    </framework>
    <framework name="Spotify Tribe/Squad/Chapter/Guild Model" type="explicit">
      <description>An organizational topology in which small autonomous cross-functional squads own a long-term mission, squads working on related areas are grouped into tribes, skill-sharing across squads happens through chapters, and voluntary cross-tribe knowledge sharing happens through guilds. Authors present as valid pattern while warning against cargo-cult adoption.</description>
      <components>
        <component>Squad: small autonomous cross-functional team with long-term mission</component>
        <component>Tribe: affinity grouping of squads working on similar areas</component>
        <component>Chapter: same-skill grouping across squads within a tribe, includes line management</component>
        <component>Guild: voluntary cross-tribe community of practice for diffuse knowledge sharing</component>
      </components>
    </framework>
    <framework name="SRE Interaction Model" type="explicit">
      <description>A dynamic four-stage relationship between an SRE team and an application development team that changes based on application scale, reliability, and error budget adherence. Uses SLOs and error budgets to mediate the speed/reliability tradeoff. Explicitly optional and scale-dependent.</description>
      <components>
        <component>Stage 1: Application team alone builds and runs in production (pre-scale)</component>
        <component>Stage 2: SRE provides guidance to application team as scale increases</component>
        <component>Stage 3: SRE takes full operational involvement with error budget governance</component>
        <component>Stage 4: Application team resumes operational responsibility if reliability degrades or scale drops</component>
      </components>
    </framework>
    <framework name="Pflaeging's Three Organizational Structures" type="explicit">
      <description>Every organization simultaneously contains three distinct structures: the formal org chart (for compliance), the informal influence network (social relationships), and the value creation structure (how work actually gets done). Org-chart-only thinking is insufficient.</description>
      <components>
        <component>Formal structure: the org chart — facilitates compliance</component>
        <component>Informal structure: the realm of influence between individuals</component>
        <component>Value creation structure: how work actually gets done based on inter-personal and inter-team reputation</component>
      </components>
    </framework>
    <framework name="Stanford's Five Rules of Organization Design" type="explicit">
      <description>Naomi Stanford's five heuristics for when and how to redesign an organization, used by the authors as a readiness and timing checklist.</description>
      <components>
        <component>Design when there is a compelling reason</component>
        <component>Develop options for deciding on a design</component>
        <component>Choose the right time to design</component>
        <component>Look for clues that things are out of alignment</component>
        <component>Stay alert to the future</component>
      </components>
    </framework>
    <framework name="Collaboration-to-X-as-a-Service Transition Model" type="explicit">
      <description>A staged evolution model for team interaction: teams begin with close collaboration during discovery phases, reduce collaboration as understanding solidifies, and finally settle into X-as-a-Service once the service boundary is stable and predictable delivery is the priority. Interaction mode is determined by the maturity of the problem space.</description>
      <components>
        <component>Stage 1 — Close Collaboration: high cognitive overhead, rapid discovery, blurred boundaries</component>
        <component>Stage 2 — Limited Collaboration: boundary refinement, decreasing uncertainty</component>
        <component>Stage 3 — X-as-a-Service: clean API, predictable delivery, minimal interaction overhead</component>
      </components>
    </framework>
    <framework name="Organizational Sensing Model" type="explicit">
      <description>A cybernetic model that frames the organization as a living organism whose teams function as sensory organs. Well-defined, stable communication pathways between teams enable high-fidelity detection of environmental signals. Operations is reframed as input to design, not output of design.</description>
      <components>
        <component>Sensory teams: stream-aligned, platform, enabling teams as specialized sense organs</component>
        <component>Communication pathways: stable, well-defined inter-team interactions as neural channels</component>
        <component>Environmental signals: live system telemetry, operational data, customer feedback</component>
        <component>Self-steering response: adjusting team interaction patterns based on sensed signals</component>
        <component>Operations-as-input inversion: operations provides high-fidelity feedback into development decisions</component>
      </components>
    </framework>
    <framework name="Platform Wrapper Pattern" type="explicit">
      <description>A structural pattern for organizations where multiple high-level business streams depend on many heterogeneous lower-level services or APIs. A thin 'platform wrapper' provides a consistent developer experience over disparate lower-level services.</description>
      <components>
        <component>Thin outer platform: consistent correlation IDs, health-check endpoints, test harnesses, SLOs, diagnostic APIs</component>
        <component>Stream-side telemetry wrapper: lightweight wrapper for logging, metrics, dashboarding</component>
        <component>Rich telemetry: stream-aligned teams track flow and resource usage of the platform</component>
      </components>
    </framework>
    <framework name="Promise Theory (inter-team application)" type="explicit">
      <description>A framework for structuring inter-team relationships as voluntary promises rather than commands or enforceable contracts. Applied to semantic versioning and more broadly to define behavioral norms teams can rely on from each other.</description>
      <components>
        <component>Promises: voluntary, team-owned commitments (e.g., SemVer compatibility)</component>
        <component>Commands/contracts: imposed obligations — the inferior alternative</component>
      </components>
    </framework>
    <framework name="Team-Scoped Software Architecture Good Practices" type="explicit">
      <description>Four properties that software architecture must have to enable team-scoped flow. Framed specifically as architectural preconditions for Conway's Law to work in the organization's favor.</description>
      <components>
        <component>Loose coupling: components do not hold strong dependencies on other components</component>
        <component>High cohesion: components have clearly bounded responsibilities with strongly related internal elements</component>
        <component>Clear and appropriate version compatibility</component>
        <component>Clear and appropriate cross-team testing</component>
      </components>
    </framework>
    <framework name="[IMPLICIT] Static Structure vs. Adaptive/Sensing Organization" type="implicit">
      <description>A recurring evaluative framework: any proposed organizational design is assessed on whether it is static (problematic) or adaptive (desirable). Static structures fossilize, become outdated, and cannot sense or respond to change. Adaptive structures continuously evolve with technological and organizational maturity.</description>
      <components>
        <component>Static structures: org charts, matrix management, periodic re-orgs — capture reality at a moment in time, become outdated immediately</component>
        <component>Adaptive/sensing structures: dynamic team designs that evolve with maturity, detect environmental signals, and self-correct</component>
      </components>
    </framework>
    <framework name="[IMPLICIT] Context-Maturity-Scale Topology Gate" type="implicit">
      <description>A three-variable prerequisite checklist applied before endorsing any topology: (1) technical and cultural maturity, (2) organization/software scale, (3) engineering discipline. Every topology is validated or invalidated by running it through these filters before adoption.</description>
      <components>
        <component>Technical and cultural maturity: does the team have the practices required for this model?</component>
        <component>Organization/software scale: is the size sufficient to justify this model's overhead?</component>
        <component>Engineering discipline: is there enough process rigor to prevent the model from degrading into its anti-pattern?</component>
      </components>
    </framework>
    <framework name="[IMPLICIT] Common-to-Fundamental Team Conversion Protocol" type="implicit">
      <description>A consistent reasoning pattern applied to any existing team: classify it against the four fundamental topologies, then either dissolve it, convert it, or justify retaining it based on the cognitive load argument. Functions as an organizational refactoring protocol.</description>
      <components>
        <component>Step 1 — Classify: which fundamental topology is this team closest to?</component>
        <component>Step 2 — Evaluate: does the team's current behavior match expected behaviors of that topology?</component>
        <component>Step 3 — Convert or dissolve: adopt the purpose and interaction behaviors of the corresponding fundamental topology, or redistribute responsibilities to stream-aligned teams</component>
      </components>
    </framework>
    <framework name="[IMPLICIT] Interaction Friction as Boundary Misalignment Detector" type="implicit">
      <description>A continuous sensing framework: observed interaction patterns are compared against expected patterns for the declared interaction mode, and mismatches reveal design defects — wrong boundaries, missing capabilities, or incorrect interaction modes.</description>
      <components>
        <component>Expected interaction pattern: derived from designated topology and mode</component>
        <component>Observed interaction pattern: actual communication volume and nature</component>
        <component>Mismatch diagnosis: excessive communication in X-as-a-Service → boundary or API problem; absent communication in Collaboration → capability or motivation problem</component>
      </components>
    </framework>
    <framework name="[IMPLICIT] Consumer-Provider Relationship as Structural Template" type="implicit">
      <description>All inter-team relationships are framed as a consumer-provider dynamic. Every non-stream-aligned team is evaluated by whether it successfully serves stream-aligned teams as internal customers. Functions as both a design principle and quality test.</description>
      <components>
        <component>Provider responsibility: treat service as a product with UX, versioning, and product management</component>
        <component>Consumer sovereignty: the consuming team's ability to self-serve determines provider team success</component>
        <component>Value measurement: provider team value is measured by value delivered to consuming teams</component>
      </components>
    </framework>
    <framework name="[IMPLICIT] Discovery-to-Execution Interaction Progression" type="implicit">
      <description>A two-stage decision rule applied repeatedly: first identify whether work is in a discovery phase or execution phase, then select the appropriate interaction mode. Discovery demands collaboration; predictable delivery demands X-as-a-Service.</description>
      <components>
        <component>Discovery phase: high uncertainty, new technology, need for rapid learning → use Collaboration mode</component>
        <component>Execution phase: established practices, need for predictable delivery → use X-as-a-Service mode</component>
      </components>
    </framework>
    <framework name="[IMPLICIT] Flow-Interruption as Anti-Pattern Detector" type="implicit">
      <description>Flow preservation is the master criterion against which all team designs are tested. Whenever a topology creates a hard dependency, a handoff, a wait time, or a bottleneck in the delivery path, it is identified as an anti-pattern regardless of how logical the structure appears on paper.</description>
      <components>
        <component>Flow preservation test: does the topology allow changes to move from concept to production without blocking handoffs?</component>
        <component>Hard dependency detection: does any team sit in the critical path of another team's delivery?</component>
        <component>Feedback loop integrity: does the topology allow operational signals to reach the teams building the software?</component>
      </components>
    </framework>
    <framework name="[IMPLICIT] Operations-as-Input Inversion" type="implicit">
      <description>Conventional flow treats operations as downstream of design. The authors invert this: operations is upstream sensory input that must flow back into development to enable course correction. This reframes operations teams as high-fidelity sensors generating inputs, not cost centers executing outputs.</description>
      <components>
        <component>Conventional model: design → build → operate (operations as output)</component>
        <component>Inverted model: operate → sense → design (operations as input to development)</component>
        <component>Staffing implication: experienced engineers in operations, not junior staff</component>
      </components>
    </framework>
  </frameworks>
  <decision_heuristics>
    <heuristic>WHEN assigning software responsibilities to a team → DO explicitly consider and limit cognitive load BECAUSE teams given more responsibility than their cognitive capacity can bear stop functioning as high-performing units</heuristic>
    <heuristic>WHEN making team structure decisions in a software organization → DO include technical experts in those decisions BECAUSE organization design and software design are two sides of the same coin, and non-technical decision-makers will inadvertently constrain the solution search space</heuristic>
    <heuristic>WHEN a team adopts new technology (e.g., cloud, infrastructure-as-code) → DO also examine downstream approval and release processes BECAUSE local speed improvements are negated by systemic bottlenecks elsewhere in the delivery chain</heuristic>
    <heuristic>WHEN two teams logically should not need to communicate based on software architecture design but ARE communicating → DO investigate the cause (bad API, unsuitable platform, missing component) BECAUSE unexpected communication signals an architectural or boundary problem</heuristic>
    <heuristic>WHEN selecting tools for teams → DO use shared tools for teams that must collaborate and separate tools (or separate instances) for teams with distinct responsibility boundaries BECAUSE tool choices drive communication patterns, and communication patterns drive architecture</heuristic>
    <heuristic>WHEN a large team regularly deals with two separate areas of the system AND different members work on different parts → DO split the team into two smaller teams BECAUSE each part needs focused ownership; but if the whole team works on both parts by design, keep them together</heuristic>
    <heuristic>WHEN software parts that logically should be separate are housed in the same version-control repository → DO use fracture plane patterns to split the software BECAUSE co-located code forces unnecessary inter-team communication regardless of logical boundaries</heuristic>
    <heuristic>WHEN groupings within an organization exceed Dunbar's tier limits (50, 150, 500) → DO split into a new semi-independent unit BECAUSE trust and predictable behavioral dynamics break down above these thresholds</heuristic>
    <heuristic>WHEN a team is responsible for a complex domain → DO NOT assign any additional domains BECAUSE solving complex problems requires uninterrupted focus and simpler tasks will always take priority, causing further delays on the most business-critical work</heuristic>
    <heuristic>WHEN a single team is covering two complicated domains → DO split into two teams of ~5 by recruiting BECAUSE the team will functionally behave as two subteams with the overhead of everyone expected to know both domains</heuristic>
    <heuristic>WHEN rewarding performance → DO reward the whole team rather than individuals BECAUSE individual performance incentives drive poor results and damage team-first behavior</heuristic>
    <heuristic>WHEN considering team cognitive capacity → DO use the team's own qualitative self-assessment as a primary gauge BECAUSE no accurate quantitative formula exists and team members' felt sense of overload is the most reliable early signal</heuristic>
    <heuristic>WHEN designing team structures → DO ask 'Given our skills, constraints, cultural and engineering maturity, desired software architecture, and business goals, which team topology will help us deliver results faster and safer?' BEFORE assigning team shapes BECAUSE topology effectiveness is entirely context-dependent</heuristic>
    <heuristic>WHEN a feature team cannot deliver to production without waiting on other teams → DO NOT call it a feature team BECAUSE self-sufficiency is a prerequisite for the pattern to deliver value</heuristic>
    <heuristic>WHEN an organization lacks engineering maturity → DO use specialized teams with close collaboration to minimize wait times RATHER THAN jumping to autonomous end-to-end product teams BECAUSE autonomous teams require mature engineering practices to sustain delivery pace</heuristic>
    <heuristic>WHEN the number of inter-team dependencies increases unchecked → DO redesign team boundaries BECAUSE unchecked dependency growth signals that team design or work assignment is wrong</heuristic>
    <heuristic>WHEN a cloud team is formed → DO ensure application teams can self-provision infrastructure RATHER THAN having the cloud team execute provisioning BECAUSE a cloud team that mimics traditional infrastructure behavior creates the same bottlenecks as before</heuristic>
    <heuristic>WHEN assessing the ratio of team types → ENSURE stream-aligned teams represent between 6:1 and 9:1 of all teams BECAUSE successful organizations consistently report this ratio as indicative of effective flow</heuristic>
    <heuristic>WHEN an enabling team has completed its mission with a stream-aligned team → STOP the engagement BECAUSE a permanent dependency on an enabling team signals the enabling team has failed its purpose</heuristic>
    <heuristic>WHEN deciding whether to create a complicated-subsystem team → DO so only when the subsystem requires mostly specialized knowledge, NOT when it is merely shared across multiple systems BECAUSE the decision must be driven by cognitive load, not reuse opportunity</heuristic>
    <heuristic>WHEN building a platform → AIM for the thinnest viable platform and resist feature expansion BECAUSE software developers will naturally build larger platforms than needed without strong product management input</heuristic>
    <heuristic>WHEN a complicated-subsystem team is in early exploration → USE high collaboration with stream-aligned teams; WHEN the subsystem has stabilized → REDUCE interaction and focus on the interface BECAUSE the appropriate interaction mode changes with the maturity stage of the subsystem</heuristic>
    <heuristic>WHEN an architecture team exists → CONVERT it to a part-time enabling team BECAUSE many architectural decisions should be taken by implementing teams rather than delegated to a separate authority</heuristic>
    <heuristic>WHEN proposing a software boundary → DO apply the litmus test ('Could we, as a team, effectively consume or provide this subsystem as a service?') BECAUSE a subsystem that cannot be cleanly consumed as a service indicates the boundary is not truly team-scoped</heuristic>
    <heuristic>WHEN a domain is too large for one team → DO split the domain into subdomains and assign each to a single team BECAUSE splitting responsibility for one domain across multiple teams produces distributed monolith dynamics rather than true autonomy</heuristic>
    <heuristic>WHEN considering a technology-based fracture plane → DO first investigate whether alternative approaches could increase pace of change in the older tech BECAUSE technology-driven splits typically introduce more constraints and reduce flow rather than improving it</heuristic>
    <heuristic>WHEN multiple fracture planes are available → DO combine them BECAUSE a combination produces more truly independent subsystems than any single plane alone</heuristic>
    <heuristic>WHEN two teams are in collaboration mode AND the service boundary needs to be established → DO use temporary collaboration to discover viable X-as-a-Service boundaries BECAUSE lightweight collaboration at service boundaries makes services more suitable for consuming teams</heuristic>
    <heuristic>WHEN two teams need to collaborate closely → DO limit collaboration to at most one other team simultaneously BECAUSE cognitive overhead of collaboration is high and should not be multiplied across multiple simultaneous partnerships</heuristic>
    <heuristic>WHEN undertaking a Reverse Conway Maneuver → DO use temporary explicit collaboration modes between teams building the software AND one or more enabling teams in facilitating mode BECAUSE problems with new responsibility boundaries can be quickly identified and adjusted before too much is built</heuristic>
    <heuristic>WHEN two teams are in collaboration mode but the other team is not engaging → DO diagnose whether the non-engaging team understands the value of collaboration, has sufficient skills, or whether a different team is better suited BECAUSE absence of expected inter-team communication signals a problem</heuristic>
    <heuristic>WHEN two teams need to collaborate → DO ensure there is high value gained from working together BECAUSE the cognitive load overhead of collaboration is high and must be justified by tangible discovery or capability-building outcomes</heuristic>
    <heuristic>WHEN a team's delivery cadence is slowing and WIP keeps accumulating → DO investigate whether hard dependencies on external functional teams have been introduced BECAUSE functional silos reduce team autonomy and cause queuing delays</heuristic>
    <heuristic>WHEN deciding between separate new-service and BAU teams → DO keep them as one side-by-side team BECAUSE separation prevents operational feedback from reaching development, breaks the cybernetic loop, and allows architectural choices without experiencing their consequences</heuristic>
    <heuristic>WHEN staffing an IT operations service desk → DO assign experienced engineers rather than junior staff BECAUSE high-fidelity operational sensing requires the ability to recognize, triage, and accurately communicate problems back to development teams</heuristic>
    <heuristic>WHEN a new technology or team boundary needs to be adopted → DO use temporary deliberate collaboration between the two teams for a defined period BECAUSE this produces a step change in capability and allows both teams to discover and define effective API boundaries before separating into X-as-a-Service mode</heuristic>
    <heuristic>WHEN two teams need physical separation to enforce an API boundary → DO move them to different parts of the office or different floors BECAUSE physical distance reduces communication bandwidth, reinforcing architectural separation</heuristic>
  </decision_heuristics>
  <anti_patterns>
    <anti_pattern>
      <mistake>Treating the org chart as a faithful representation of how work gets done and how teams interact</mistake>
      <why_wrong>The org chart is always out of sync with reality — people communicate laterally outside reported lines to get work done, and decisions based on it optimize only for part of the organization while ignoring upstream and downstream effects</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Treating teams as collections of interchangeable individuals who will succeed if they follow the right process and use the right tools</mistake>
      <why_wrong>This view ignores the sociotechnical nature of software delivery; people and technology must be treated as a single ecosystem, and teams have emergent properties and cognitive limits that individuals do not</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Relying on a single, static organizational structure (e.g., org chart or matrix management) as the permanent operating model</mistake>
      <why_wrong>Static structures become outdated as business and technology domains evolve; they break established communication patterns and split teams that are just beginning to perform, and they cannot sense or respond to changing conditions</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Prioritizing tooling and technology adoption in a transformation while haphazardly addressing cultural and organizational changes</mistake>
      <why_wrong>The organizational model is what limits the ability to reap benefits from Agile, Lean, and DevOps; without addressing team structure and interaction, technology adoption produces sub-optimal results</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Copying another organization's team model (e.g., the Spotify model) without understanding the underlying purpose, culture, and trajectory</mistake>
      <why_wrong>Team structures are context-dependent snapshots, not universal formulas; what works for one organization at one point in time will not transfer mechanically to another context — even Spotify themselves described their model as 'a journey in progress, not a journey completed'</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Naively creating many different component teams based on a surface reading of Conway's Law</mistake>
      <why_wrong>Component teams optimized for Conway's Law in name but not in practice create coordination overhead without the flow benefits; stream-aligned teams are preferred for fast flow, and component teams should only exist for genuinely complex subsystems requiring specialist knowledge</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Repeated organizational reorganizations driven by management convenience or headcount reduction, ignoring Conway's Law</mistake>
      <why_wrong>Such reorganizations destroy established communication paths and team dynamics without regard for the architectural consequences, actively degrading the organization's ability to build and operate software effectively</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Expecting everyone to communicate with everyone (many-to-many communication culture: 'everyone should see every message in the chat,' 'everyone needs to attend the massive standup')</mistake>
      <why_wrong>Many-to-many communication patterns, via Conway's Law, produce monolithic, tangled, highly coupled software systems that do not support fast flow</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Selecting a single unified tool for the entire organization without considering team inter-relationships</mistake>
      <why_wrong>Tool choice directly shapes communication patterns; forcing a single tool on teams with distinct responsibility boundaries drives unintended collaboration and architectural coupling between those teams</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Having a special 'production only' tool with restricted access that interacts with or measures the software being built</mistake>
      <why_wrong>Restricted tool access creates a communication gap between teams with access and teams without, which per Conway's Law will manifest as an architectural gap or coupling problem in the software</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Designing software architecture in isolation as a standalone concept, then expecting any group of teams to implement it</mistake>
      <why_wrong>The gap between architecture and team structures will cause the architecture to be overridden by the homomorphic force of Conway's Law; the actual team communication paths will determine the real architecture regardless of the blueprint</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Assigning work to individuals rather than teams</mistake>
      <why_wrong>The team is the fundamental unit of delivery; individual assignment undermines the team dynamics, shared ownership, and cognitive distribution that make teams outperform collections of individuals</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Allowing a team member with an individualistic, non-collaborative orientation to remain on the team without intervention</mistake>
      <why_wrong>Such 'team toxic' individuals actively destroy teamwork; research shows collectively-oriented team members outperform egocentric ones, and the damage from a toxic member can destroy the entire team</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Downplaying domain complexity to justify assigning more domains to a single team</mistake>
      <why_wrong>It leads directly to team failure; actual cognitive overload builds up, stress increases, and morale weakens regardless of how the complexity was characterized during planning</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Measuring software cognitive load using technical metrics like lines of code, number of modules, classes, or methods</mistake>
      <why_wrong>These proxies are misleading because programming language verbosity varies, abstractions reduce code size without reducing complexity, and what matters is domain complexity—not code volume</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Treating engineering practices (continuous delivery, test-first development, operability) as optional or secondary to organizational design changes</mistake>
      <why_wrong>Without foundational engineering practices, all investment in team-first organizational design will be undermined; they are prerequisite, not complementary</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Using open-plan offices under the assumption that physical colocation automatically increases useful collaboration</mistake>
      <why_wrong>Field research shows open-plan offices actually decrease face-to-face interaction by ~70% and increase electronic interaction; what is needed is colocation of purpose, not just bodies</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Disbanding high-performing teams after project completion and reassigning members</mistake>
      <why_wrong>Teams take weeks to months to form and reach high performance; disbanding destroys this accumulated team capability, forcing the organization to pay the full forming/storming cost again with each new project</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Allowing multiple teams to change the same system or subsystem without clear single ownership</mistake>
      <why_wrong>Without single-team ownership, no one owns the resulting changes or technical debt; with clear single-team ownership, the team can make short-term fixes knowing they will clean them up, because they own the longer-term consequence</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Adopting the Spotify model by copying its structural labels (squads, tribes, chapters, guilds) without understanding the underlying culture, dynamics, or evolutionary trajectory</mistake>
      <why_wrong>The Spotify model was a snapshot of a journey in progress, not a completed formula; copying the form without the substance strips it of the contextual prerequisites that made it work</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Creating a dedicated 'DevOps team' as a permanent, execution-focused function</mistake>
      <why_wrong>Without a clear mission and expiration date, the DevOps team becomes yet another silo, hoarding tooling and automation knowledge rather than distributing it; application teams develop a hard dependency on the DevOps team rather than self-sufficient delivery capabilities</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Designing team structures reactively (ad hoc) in response to immediate needs without considering broader organizational context</mistake>
      <why_wrong>Ad hoc designs optimize for temporary or narrow problems rather than building adaptive capacity; they ignore technical maturity, organization size, scale, engineering discipline, and inter-team dependencies</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Rebranding a traditional infrastructure team as a 'cloud team' without changing its operating model</mistake>
      <why_wrong>If the cloud team simply mimics current infrastructure behaviors and processes, it forfeits the speed and scalability benefits of the cloud and recreates the same bottlenecks</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Creating product teams without building a compatible self-service support system first</mistake>
      <why_wrong>Without easy-to-consume self-service capabilities for infrastructure, environments, and deployment, product teams still depend on functional teams as hard dependencies, increasing wait times and negating the autonomy the product team model promises</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Allowing a feature team to work across codebases without high engineering maturity</mistake>
      <why_wrong>Without engineering discipline, feature teams take shortcuts (skipping test automation, not leaving code better than they found it), degrading shared codebases and eroding trust between teams over time</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Creating teams organized around a single functional expertise (QA, DBA, UX, architecture) that sit in the flow of change</mistake>
      <why_wrong>Functional silos prevent fast flow by forcing hand-offs between teams; they also prevent the natural drive toward simpler solutions that cross-functional teams create</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Allowing multiple teams to change the same system or subsystem (shared ownership)</mistake>
      <why_wrong>Without single-team ownership, no one is accountable for changes or the resulting technical debt; continuity of care is lost</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Building an enabling team without a clear mission, expiration date, or plan for making itself obsolete</mistake>
      <why_wrong>Without a defined endpoint, enabling teams cross the thin line into becoming another knowledge silo, hoarding expertise rather than transferring it</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Enabling teams becoming 'ivory towers' that dictate technical choices to other teams</mistake>
      <why_wrong>The enabling team's purpose is to increase autonomy of stream-aligned teams; dictating choices does the opposite</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Creating a component team (shared subsystem team) based on a perceived opportunity to reuse a component across multiple systems</mistake>
      <why_wrong>The decision to create a specialized team must be driven by cognitive load requirements, not reuse opportunities; reuse-driven component teams multiply dependencies without the justification of genuine specialist knowledge requirements</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Running a platform team without product management discipline and developer experience focus</mistake>
      <why_wrong>Without product management input, platforms grow larger than needed; without DevEx focus, adoption fails and the platform hinders rather than helps consuming teams</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Using a single cross-service support team to handle all production incidents across all systems</mistake>
      <why_wrong>A monolithic support team creates a Conway's Law effect of 'monolithization' in production environments, destroys stream independence, and prevents learning from flowing back to development teams</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Splitting a monolith without first identifying all the forms of coupling present (not just the application layer)</mistake>
      <why_wrong>Monolithic coupling can persist at the database, build, release, model, thinking, and workplace layers even after the application is decomposed; addressing only one layer produces a false sense of decoupling</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Creating a distributed monolith by splitting the application architecture without achieving true team and service independence</mistake>
      <why_wrong>When services are split architecturally but teams still depend on each other for almost all changes, the result is a distributed monolith: all the operational complexity of microservices with none of the autonomy benefits</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Using technology boundaries as the default (or only) basis for splitting teams and software</mistake>
      <why_wrong>Technology-driven splits (e.g., front end / back end / DBA) introduce constraints and reduce flow because the resulting teams are less autonomous, with product dependencies remaining while each team has less end-to-end visibility</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Downplaying the complexity of a domain in order to assign more domains to a single team</mistake>
      <why_wrong>If the team doing the work still feels overwhelmed, the boundary is wrong regardless of how the complexity was characterized; downplaying leads to overloaded teams, stress, poor results, and failure</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Assuming that adopting microservices automatically eliminates monolithic coupling</mistake>
      <why_wrong>If teams still wait to do end-to-end testing of combinations of services before releasing, the deployment coupling of a monolith persists regardless of the architectural decomposition</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Enforcing a single domain language (monolithic model) across many different bounded contexts as the system grows</mistake>
      <why_wrong>While it may make sense for small organizations, imposing a single model inadvertently constrains architecture and implementation and removes the semantic precision needed for larger, multi-team systems</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Using collaboration mode for extended periods when what is actually needed is a clear, well-defined interface between two teams</mistake>
      <why_wrong>Extended collaboration blurs responsibility boundaries. Conway's law means the resulting software architecture will also be blended and unclear, making it harder to achieve the modular, independent systems desired</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Allowing everyone to communicate with everyone (all-to-all communication patterns via open chat or massive standups)</mistake>
      <why_wrong>Per Conway's law, many-to-many communication drives monolithic, tangled, highly coupled, interdependent systems that do not support fast flow. More communication is not necessarily a good thing</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Treating a dedicated architecture team as the mechanism for discovering and enforcing system design</mistake>
      <why_wrong>A dedicated architecture team is an anti-pattern; it is more effective for a small group of architects to discover, adjust, and reshape interactions between teams — functioning as designers of team APIs — rather than imposing designs</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Relying on X-as-a-Service when the service boundary is poorly drawn or the providing team lacks good service-management discipline</mistake>
      <why_wrong>X-as-a-Service only works when the boundary is correct and the service is well-managed; a bad boundary or poor DevEx in the providing team creates a bottleneck that actually reduces flow rather than enabling it</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Maintaining separate teams for 'new stuff' and business-as-usual (BAU) maintenance</mistake>
      <why_wrong>Separating new-service and BAU teams breaks the feedback loop from operations to development. The new-service team can make poor architectural choices with no incentive to care, since only the BAU team suffers. Learning between the two groups is blocked, and the organization loses its ability to self-steer.</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Assigning lower-cost or junior staff to maintenance/operations work to reduce costs</mistake>
      <why_wrong>The author characterizes this as false economy. Maintenance and operational work is a primary source of high-fidelity feedback into development. Staffing it with less experienced people degrades the quality of that signal, ultimately reducing IT agility and business outcomes.</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Allowing ongoing collaboration between two teams without justifying its value</mistake>
      <why_wrong>Collaboration carries a high cognitive overhead. Unjustified or habitual collaboration can mask underlying deficiencies in platforms or capabilities that should be addressed structurally, rather than papered over with ongoing inter-team communication.</why_wrong>
    </anti_pattern>
    <anti_pattern>
      <mistake>Treating technology change (e.g., adopting Kubernetes) as a goal in itself rather than as a means to organizational change</mistake>
      <why_wrong>The authors argue through the uSwitch case study that the technology choice should serve the organizational design goal, not the other way around. Adopting a platform technology without a clear organizational change objective fails to deliver the intended benefits.</why_wrong>
    </anti_pattern>
  </anti_patterns>
  <trigger_questions>
    <trigger>
      <question>Is there a better design that is not available to us because of our organization?</question>
      <purpose>Forces recognition that the current team communication structure is actively constraining the solution search space for software architecture — not all architectures are reachable from all organizational structures</purpose>
    </trigger>
    <trigger>
      <question>Do you feel like you're effective and able to respond in a timely fashion to the work you are asked to do?</question>
      <purpose>A quick, non-judgmental gauge of whether a team's cognitive load has been exceeded; a clearly negative answer signals the need to examine and reduce the team's domain responsibilities</purpose>
    </trigger>
    <trigger>
      <question>Given our skills, constraints, cultural and engineering maturity, desired software architecture, and business goals, which team topology will help us deliver results faster and safer?</question>
      <purpose>Anchors team design decisions in organizational context rather than copying patterns blindly; forces explicit evaluation of maturity, architecture needs, and goals before selecting a team structure</purpose>
    </trigger>
    <trigger>
      <question>How can we reduce or avoid handovers between teams in the main flow of change?</question>
      <purpose>Directs attention to the structural sources of delay and friction in delivery — handovers are a key indicator that team boundaries are misaligned with the flow of work</purpose>
    </trigger>
    <trigger>
      <question>Is there a better design that is not available to us because of our organization?</question>
      <purpose>Forces examination of whether current team communication structures are blocking superior architectural solutions; surfaces the hidden constraint Conway's Law imposes on the solution search space</purpose>
    </trigger>
    <trigger>
      <question>Does the structure minimize the number of communication paths between teams? Does the structure encourage teams to communicate who wouldn't otherwise do so?</question>
      <purpose>Assesses the health of inter-team communication design; unexpected communication between teams that logically shouldn't need to interact signals misaligned boundaries or missing architectural components</purpose>
    </trigger>
    <trigger>
      <question>If two teams logically shouldn't need to communicate but are doing so, why? Is the API not good enough? Is the platform not suitable? Is a component missing?</question>
      <purpose>Diagnoses the root cause when actual team communication patterns diverge from expected patterns, treating unexpected communication as an architectural signal rather than a social phenomenon</purpose>
    </trigger>
    <trigger>
      <question>Do we want teams to collaborate, or do we need a clear responsibility boundary between them? (Applied to tool selection)</question>
      <purpose>Forces an explicit decision about the nature of the relationship between two teams before tools are selected, preventing tool choice from accidentally driving unintended communication patterns</purpose>
    </trigger>
    <trigger>
      <question>Do you feel like you're effective and able to respond in a timely fashion to the work you are asked to do?</question>
      <purpose>A non-judgmental, qualitative team self-assessment of cognitive load. A clearly negative answer signals the team is overloaded and that domain responsibilities or team size need adjustment.</purpose>
    </trigger>
    <trigger>
      <question>Will other teams find it easy and straightforward to interact with us, or will it be difficult and confusing?</question>
      <purpose>Forces a team to evaluate its Team API from the consumer's perspective rather than the producer's, revealing gaps in documentation, onboarding, communication clarity, and interface design.</purpose>
    </trigger>
    <trigger>
      <question>Do those served grow as persons? Do they, while being served, become healthier, wiser, freer, more autonomous?</question>
      <purpose>Greenleaf's servant-leadership diagnostic, cited to evaluate whether an enabling team is genuinely building capability in the teams it helps or creating dependency. A 'no' answer signals the enabling relationship is extractive rather than empowering.</purpose>
    </trigger>
    <trigger>
      <question>Is the current domain classification (simple/complicated/complex) accurately reflecting how the responsible team actually experiences it?</question>
      <purpose>Guards against managerial misclassification of domain complexity. If teams still feel overwhelmed after a seemingly reasonable domain allocation, the classification—not the team—should be re-examined.</purpose>
    </trigger>
    <trigger>
      <question>Could we, as a team, effectively consume or provide this subsystem as a service?</question>
      <purpose>A litmus test for validating software fracture plane placement. If a proposed subsystem boundary passes this test, it is a viable candidate for team ownership; if not, the boundary needs adjustment.</purpose>
    </trigger>
    <trigger>
      <question>Given our skills, constraints, cultural and engineering maturity, desired software architecture, and business goals, which team topology will help us deliver results faster and safer?</question>
      <purpose>Forces intentional topology selection by surfacing the contextual variables that determine fit, preventing reactive or cargo-cult organizational design</purpose>
    </trigger>
    <trigger>
      <question>How can we reduce or avoid handovers between teams in the main flow of change? Where should the boundaries be in the software system in order to preserve system viability and encourage rapid flow?</question>
      <purpose>Directs attention to handoff elimination as the primary design criterion, ensuring boundaries are drawn around flow rather than around technical specialisms or org-chart convenience</purpose>
    </trigger>
    <trigger>
      <question>Does the structure minimize the number of communication paths between teams? Does the structure encourage teams to communicate who wouldn't otherwise do so?</question>
      <purpose>Diagnoses whether a proposed team structure is generating appropriate vs. inappropriate communication patterns; unexpected inter-team communication signals a misaligned boundary or missing capability</purpose>
    </trigger>
    <trigger>
      <question>Is a given inter-team dependency on a squad within the same tribe (acceptable) or in a different tribe (potentially a warning that team design or work assignment is wrong)?</question>
      <purpose>Provides a fast triage test for dependency health: cross-tribe dependencies are a signal that either team design or work allocation needs to be revisited before the dependency compounds</purpose>
    </trigger>
    <trigger>
      <question>Do those served grow as persons? Do they, while being served, become healthier, wiser, freer, more autonomous?</question>
      <purpose>Diagnostic test for whether an enabling team is genuinely increasing the autonomy and capability of stream-aligned teams, or merely creating dependency; if the answer is no, the enabling team is failing its mission</purpose>
    </trigger>
    <trigger>
      <question>Is the stream-aligned team effective and able to respond in a timely fashion to the work it is asked to do?</question>
      <purpose>Quick cognitive load assessment; a clearly negative answer signals that team responsibilities exceed cognitive capacity and organizational intervention is required</purpose>
    </trigger>
    <trigger>
      <question>Could we, as a team, effectively consume or provide this subsystem as a service?</question>
      <purpose>Litmus test for whether a software subsystem boundary is correctly drawn; a 'yes' answer confirms the subsystem is a viable candidate for split-off and single-team ownership</purpose>
    </trigger>
    <trigger>
      <question>Is this the most effective pattern for an architecture team, or is one needed at all?</question>
      <purpose>Forces organizations to challenge the default assumption that a dedicated architecture team is necessary; the answer should lead to either dissolving the team or restructuring it as a part-time enabling function</purpose>
    </trigger>
    <trigger>
      <question>Could we, as a team, effectively consume or provide this subsystem as a service?</question>
      <purpose>Tests whether a proposed software boundary is truly team-scoped and independently evolvable; a 'yes' answer confirms the subsystem is a viable candidate for splitting off and assigning to a single owning team</purpose>
    </trigger>
    <trigger>
      <question>Does the resulting architecture support more autonomous teams (less dependent teams) with reduced cognitive load (less disparate responsibilities)?</question>
      <purpose>The primary litmus test for any proposed fracture plane; if the answer is no, the proposed split is not valid regardless of its technical elegance</purpose>
    </trigger>
    <trigger>
      <question>How independent is each domain really — and what happens when you play through scenarios of cross-domain changes on a whiteboard before splitting?</question>
      <purpose>Forces explicit validation of assumed independence before committing to a boundary; the Poppulo case study used this to avoid Conway's law anti-patterns by discovering where coupling actually resided</purpose>
    </trigger>
    <trigger>
      <question>What kind of interaction should we have with this other team? Should we be collaborating closely? Should we be expecting or providing a service? Or should we be expecting or providing facilitation?</question>
      <purpose>Forces teams to make their interaction mode explicit and deliberate; reveals whether the current interaction is the right one for the type of work being done, and whether Conway's law implications have been considered</purpose>
    </trigger>
    <trigger>
      <question>Is the component boundary in the right place? Is the component API well specified? Is the component easy enough to use? Does the providing team have a missing capability such as UX or DevEx?</question>
      <purpose>Diagnoses the root cause when a team is spending excessive time interacting with a team that should be providing something as a service; identifies whether the problem is boundary design, API quality, or team capability gaps</purpose>
    </trigger>
    <trigger>
      <question>Do they understand the value of adopting the collaboration mode at this point? Do they have enough skills to undertake this collaboration, or is another team better suited? Is the boundary that the teams are trying to bridge too ambitious?</question>
      <purpose>Diagnoses why expected collaboration is not occurring; reveals whether the problem is understanding, capability, or an overambitious boundary definition</purpose>
    </trigger>
    <trigger>
      <question>Are we alert for the white space between roles — gaps that nobody feels responsible for?</question>
      <purpose>Identifies ownership vacuums that emerge at team boundaries and are invisible in both collaboration and X-as-a-Service modes; prompts proactive gap-scanning rather than waiting for failures to surface</purpose>
    </trigger>
    <trigger>
      <question>Is the close collaboration between these two teams still effective, or should we move toward an X-as-a-Service model?</question>
      <purpose>Forces a periodic reassessment of whether an active collaboration interaction is still producing discovery value commensurate with its cognitive cost, or whether the boundary is now stable enough to shift to a lower-overhead service relationship</purpose>
    </trigger>
    <trigger>
      <question>Should we still be building thing X in house, or should we be renting it from an external provider?</question>
      <purpose>Prompts the organization to sense whether the internal investment in a capability is still justified given evolving external market options, preventing unnecessary maintenance of capabilities that have become commodities</purpose>
    </trigger>
    <trigger>
      <question>Are the promises between these two teams still valid and achievable, and what needs to change to make them more realistic?</question>
      <purpose>Uses promise theory as a lens to assess whether declared team interaction contracts remain feasible given current team capabilities and constraints, surfacing hidden dependency failures before they cause delivery problems</purpose>
    </trigger>
    <trigger>
      <question>Do we need to change team-interaction modes to enhance how the organization is working?</question>
      <purpose>The primary organizational sensing trigger question: prompts leaders to treat team interaction friction or smoothness as a signal about structural fit rather than as purely interpersonal dynamics</purpose>
    </trigger>
    <trigger>
      <question>Is the flow of work for this team as smooth as it could be, and what hampers flow?</question>
      <purpose>A routine diagnostic for stream-aligned teams to surface bottlenecks, blocked dependencies, or cognitive overload before they compound into delivery failures</purpose>
    </trigger>
  </trigger_questions>
</knowledge_base>