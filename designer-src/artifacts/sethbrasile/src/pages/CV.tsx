import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Mail, ExternalLink } from "lucide-react";

type Lens = "All" | "dev" | "it" | "leader";

interface Highlight {
  text: string;
  tags: Lens[];
}

interface Role {
  id: string;
  company: string;
  title: string;
  location: string;
  period: string;
  tags: Lens[];
  highlights: Highlight[];
}

const history: Role[] = [
  {
    id: "ppmc",
    company: "Prickly Pear Marketing Co (PPMC)",
    title: "Co-Founder · Solutions Engineer · Primary Developer",
    location: "Durant, OK",
    period: "Oct 2025–Present",
    tags: ["dev", "it", "leader"],
    highlights: [
      { text: "Co-owned full-service marketing agency; owns the technical side (web, SEO, automation, internal tooling), shares agency leadership.", tags: ["leader", "dev"] },
      { text: "Built the internal AI-tool governance + scheduled-agent system the partner team runs on.", tags: ["dev", "it"] },
      { text: "Built and operates the web + SEO delivery pipeline used across client engagements.", tags: ["dev"] },
      { text: "Co-owner equity, P&L, and decision authority.", tags: ["leader"] }
    ]
  },
  {
    id: "tenor",
    company: "Tenor Creative LLC",
    title: "Founder · Solutions Engineer · Primary Developer",
    location: "Durant, OK",
    period: "Sep 2024–Present",
    tags: ["dev", "leader"],
    highlights: [
      { text: "Solo shop; static sites for SMBs focused on technical SEO, performance, accessibility.", tags: ["dev"] },
      { text: "Built tooling that lets one person deliver premium static sites at a low price point.", tags: ["dev"] },
      { text: "Owns full P&L for the entity.", tags: ["leader"] }
    ]
  },
  {
    id: "betterlife",
    company: "BetterLife",
    title: "Senior Full-Stack Engineer · DevOps · Software Systems Architect",
    location: "Kihei, HI (remote)",
    period: "Mar 2023–Present",
    tags: ["dev", "it", "leader"],
    highlights: [
      { text: "Founding engineer/architect for a small-groups (\"pods\") matchmaking platform.", tags: ["dev"] },
      { text: "Designed and owned the entire v1 platform — frontend, backend, ML, databases, CI/CD.", tags: ["dev", "it"] },
      { text: "Hired and led a team of 6 (2 frontend, 1 backend, 1 senior frontend + UI/UX, 1 ML). Interviews, hiring decisions, technical direction, code review.", tags: ["leader", "dev"] },
      { text: "Built an R-based ML matchmaking system pairing users with pods.", tags: ["dev"] },
      { text: "Built the entire auth stack on Auth0 (Okta) — production SSO, MFA, full lifecycle.", tags: ["dev", "it"] },
      { text: "Led the v2 migration to cloud-native SaaS.", tags: ["it", "dev"] },
      { text: "Stack: Nuxt, Vercel, FaunaDB, Stripe, PostgreSQL (Neon), InfluxDB 2.0, Heroku, Go, Grafana, Python, R, reticulate, Hetzner, Dokku/Docker.", tags: ["dev", "it"] }
    ]
  },
  {
    id: "dkb",
    company: "DKBinnovative",
    title: "Centralized Services Automation Specialist (IT DevOps)",
    location: "Frisco, TX",
    period: "Jun 2021–Mar 2023",
    tags: ["dev", "it", "leader"],
    highlights: [
      { text: "Designed/built cybersecurity + compliance automation across enterprise Windows/Linux/Mac fleets (2,500–3,200 endpoints) in healthcare and manufacturing.", tags: ["it", "dev"] },
      { text: "Daily PowerShell dev for workstation/service-management tooling; Go tools to orchestrate and aggregate reporting.", tags: ["dev", "it"] },
      { text: "Built a POC MSP code-delivery + RMM platform in Go — cross-platform agent + server-side broker over gRPC + mutual TLS.", tags: ["dev", "it"] },
      { text: "Led PrintNightmare response across the client base — PowerShell/GPO mitigations, then eliminated traditional print servers.", tags: ["it", "leader"] },
      { text: "Migrated all delivered PowerShell to a GitHub source-of-truth model — scripts run in-memory from raw URLs, removing local-file tampering surface and forcing PR review.", tags: ["it", "dev"] },
      { text: "Compliance remediation against HIPAA / NIST / CMMC-adjacent scans.", tags: ["it"] },
      { text: "Automated distributed enterprise Windows update/upgrade management.", tags: ["it"] }
    ]
  },
  {
    id: "chickasaw-retail",
    company: "The Chickasaw Nation",
    title: "Retail Systems Analyst",
    location: "Ada, OK",
    period: "Oct 2016–Jun 2021",
    tags: ["it", "leader"],
    highlights: [
      { text: "One of two go-to experts for all retail + PCI payment systems across hundreds of devices — casinos, c-stores, gas stations, restaurants, boutique retail.", tags: ["it"] },
      { text: "Two-year PCI-DSS subject-matter expert and lead preparer for PCI audits.", tags: ["it", "leader"] },
      { text: "Designed/implemented enterprise-wide payment + POS device tracking for PCI compliance.", tags: ["it", "leader"] }
    ]
  },
  {
    id: "cfi",
    company: "Community First Investments",
    title: "Co-Founder & Operating Partner (Real Estate)",
    location: "50/50 partnership",
    period: "2021–Present",
    tags: ["leader"],
    highlights: [
      { text: "Real-estate investment partnership; full-lifecycle ownership (acquire, renovate, operate, exit).", tags: ["leader"] },
      { text: "Acquired a distressed 12-unit apartment complex; led a multi-phase to-the-studs renovation to fully renovated and fully occupied.", tags: ["leader"] },
      { text: "Hired and managed GC and subcontractors — hands-on, not a passive investor.", tags: ["leader"] }
    ]
  },
  {
    id: "dsr",
    company: "Greeting Card Collection / Deep Space Robots",
    title: "Web Developer",
    location: "Dallas/Fort Worth",
    period: "Apr 2015–Jul 2016",
    tags: ["dev"],
    highlights: [
      { text: "Frontend dev in JavaScript / Ember.js.", tags: ["dev"] },
      { text: "Built a suite of tools letting clients build customized white-labeled greeting-card sites.", tags: ["dev"] }
    ]
  },
  {
    id: "koddi",
    company: "Koddi",
    title: "Junior Web Developer",
    location: "Fort Worth, TX",
    period: "Sep 2014–Apr 2015",
    tags: ["dev"],
    highlights: [
      { text: "PHP + JavaScript, junior full-stack on a lodging/booking/travel analytics and ad-management platform.", tags: ["dev"] }
    ]
  },
  {
    id: "chickasaw-tech",
    company: "The Chickasaw Nation",
    title: "IT Client Services Technician",
    location: "Southern Region, OK",
    period: "Jun 2012–Aug 2013",
    tags: ["it"],
    highlights: [
      { text: "Remote + on-site IT support for 3,000+ users across 28 properties; frequently the lone on-site engineer.", tags: ["it"] },
      { text: "Full-stack ownership (OS, software, lifecycle) of hundreds of facility workstations.", tags: ["it"] },
      { text: "PC imaging, deployments, Cisco VOIP, AD/Exchange, SCSM ticketing.", tags: ["it"] }
    ]
  },
  {
    id: "chickasaw-floor",
    company: "The Chickasaw Nation",
    title: "Electronic Gaming Floor Supervisor",
    location: "Oklahoma",
    period: "Aug 2008–Aug 2011",
    tags: ["leader", "it"],
    highlights: [
      { text: "Managed 75+ technical-support / customer-service reps at a time on the floor of the world's largest casino.", tags: ["leader", "it"] },
      { text: "Real people-management — scheduling, performance management, hiring input, discipline.", tags: ["leader"] },
      { text: "Enforced federal Title 31 (AML reporting) and IRS withholding law daily.", tags: ["leader", "it"] }
    ]
  }
];

const skills = [
  { group: "Languages", items: [{ name: "TypeScript", tags: ["dev"] }, { name: "JavaScript", tags: ["dev"] }, { name: "PowerShell", tags: ["it"] }, { name: "Go", tags: ["dev", "it"] }, { name: "Python", tags: ["dev", "it"] }, { name: "PHP", tags: ["dev"] }, { name: "R", tags: ["dev"] }, { name: "SQL", tags: ["dev", "it"] }] },
  { group: "Frontend / Web", items: [{ name: "Nuxt 3", tags: ["dev"] }, { name: "Vue 3", tags: ["dev"] }, { name: "Ember.js", tags: ["dev"] }, { name: "React", tags: ["dev"] }, { name: "Tailwind CSS", tags: ["dev"] }, { name: "Web Audio API", tags: ["dev"] }] },
  { group: "Backend / Platform", items: [{ name: "Node/Express", tags: ["dev"] }, { name: "gRPC / mutual TLS", tags: ["dev", "it"] }, { name: "REST / GraphQL", tags: ["dev"] }, { name: "Better Auth", tags: ["dev"] }, { name: "Stripe", tags: ["dev"] }] },
  { group: "Cloud / DevOps / Infra", items: [{ name: "Docker/Compose/Dokku", tags: ["dev", "it"] }, { name: "CI/CD (GitHub Actions)", tags: ["dev", "it"] }, { name: "Cloudflare (Workers, Tunnels, DNS)", tags: ["dev", "it"] }, { name: "Microsoft Azure", tags: ["it"] }, { name: "NGINX / reverse-proxy hardening", tags: ["it"] }, { name: "Immutable infrastructure", tags: ["it"] }] },
  { group: "Enterprise IT / Sysadmin", items: [{ name: "Active Directory", tags: ["it"] }, { name: "Group Policy (GPO)", tags: ["it"] }, { name: "SCCM / SCSM", tags: ["it"] }, { name: "Intune", tags: ["it"] }, { name: "ConnectWise Automate (RMM)", tags: ["it"] }, { name: "M365 / Google Workspace admin", tags: ["it"] }, { name: "Okta / Auth0", tags: ["it", "dev"] }] },
  { group: "Security / Compliance", items: [{ name: "PCI-DSS (2-yr SME)", tags: ["it"] }, { name: "Title 31 / IRS", tags: ["it"] }, { name: "HIPAA", tags: ["it"] }, { name: "NIST / CMMC-adjacent", tags: ["it"] }, { name: "PrintNightmare response", tags: ["it"] }, { name: "Zero-trust ingress", tags: ["it"] }, { name: "IDS/IPS + split-brain DNS", tags: ["it"] }] },
  { group: "Data / ML", items: [{ name: "R + Python (production ML)", tags: ["dev"] }, { name: "reticulate", tags: ["dev"] }, { name: "Grafana", tags: ["dev", "it"] }, { name: "InfluxDB", tags: ["dev", "it"] }] },
  { group: "Leadership", items: [{ name: "Hired + led 6 engineers", tags: ["leader"] }, { name: "Managed 75+ reports", tags: ["leader"] }, { name: "Code review / mentoring", tags: ["leader", "dev"] }, { name: "Vendor management", tags: ["leader"] }, { name: "P&L ownership", tags: ["leader"] }] }
];

export default function CV() {
  const [activeLens, setActiveLens] = useState<Lens>("All");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": "Seth Brasile",
      "jobTitle": "Engineer · IT/Security · Leader",
      "description": "Full professional history of Seth Brasile across software engineering, enterprise IT, security, and technical leadership."
    }
  };

  return (
    <>
      <Helmet>
        <title>CV & Résumé — Seth Brasile | Full-Stack Engineer · IT/Security · Leader</title>
        <meta name="description" content="Professional history, skills, and experience. 12+ years across software engineering, DevOps, enterprise IT, and leadership." />
        <link rel="canonical" href="https://sethbrasile.com/cv" />
        <meta property="og:title" content="CV & Résumé — Seth Brasile | Full-Stack Engineer · IT/Security · Leader" />
        <meta property="og:description" content="Professional history, skills, and experience. 12+ years across software engineering, DevOps, enterprise IT, and leadership." />
        <meta property="og:url" content="https://sethbrasile.com/cv" />
        <meta property="og:type" content="profile" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6 tracking-tight">CV & Résumé</h1>
          
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-foreground font-medium mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
                Open to opportunities
              </p>
              <p className="text-muted-foreground text-sm">
                Available for fractional, contract, advisory, or the right full-time role.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a 
                href="mailto:seth@tenorcreative.com"
                className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-md font-medium text-sm transition-colors hover:bg-foreground/90"
              >
                <Mail size={16} /> seth@tenorcreative.com
              </a>
              {/* TODO: Replace with real PDF path when provided */}
              <a 
                href="/Seth_Brasile_Resume.pdf"
                className="inline-flex items-center gap-2 border border-border bg-card hover:bg-secondary px-4 py-2 rounded-md font-medium text-sm transition-colors"
                download
              >
                <Download size={16} /> Download (PDF)
              </a>
            </div>
          </div>

          <div className="sticky top-16 z-40 bg-background/95 backdrop-blur py-4 border-b border-border/40 mb-10 -mx-4 px-4 sm:mx-0 sm:px-0 flex overflow-x-auto no-scrollbar items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-2 shrink-0">Filter view by:</span>
            {(["All", "dev", "it", "leader"] as Lens[]).map(lens => (
              <button
                key={lens}
                onClick={() => setActiveLens(lens)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeLens === lens 
                    ? "bg-foreground text-background" 
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {lens === "dev" ? "Developer" : lens === "it" ? "IT/Security" : lens === "leader" ? "Leadership" : "Complete History"}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-12">
          <main>
            <h2 className="text-2xl font-bold font-display border-b border-border pb-4 mb-8">Work History</h2>
            
            <div className="space-y-12">
              {history.map((role) => {
                const isActiveRole = activeLens === "All" || role.tags.includes(activeLens);
                const activeHighlights = role.highlights.filter(h => activeLens === "All" || h.tags.includes(activeLens));
                
                // Skip rendering if this role doesn't match the lens at all
                if (!isActiveRole && activeHighlights.length === 0) return null;

                return (
                  <motion.div 
                    key={role.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={!isActiveRole ? "opacity-60 grayscale-[50%]" : ""}
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-bold font-display text-foreground">{role.company}</h3>
                      <div className="text-lg font-medium text-muted-foreground mb-2">{role.title}</div>
                      <div className="flex items-center gap-3 text-sm font-mono text-muted-foreground">
                        <span>{role.period}</span>
                        <span>·</span>
                        <span>{role.location}</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-3 list-disc list-outside ml-5 marker:text-muted">
                      {role.highlights.map((highlight, i) => {
                        const isActiveHighlight = activeLens === "All" || highlight.tags.includes(activeLens);
                        if (!isActiveHighlight && activeLens !== "All") return null;
                        
                        return (
                          <li key={i} className="text-muted-foreground leading-relaxed pl-1">
                            {highlight.text}
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </main>

          <aside className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold font-display border-b border-border pb-4 mb-6">Skills</h2>
              <div className="space-y-6">
                {skills.map((group) => {
                  const activeItems = group.items.filter(item => activeLens === "All" || item.tags.includes(activeLens));
                  if (activeItems.length === 0 && activeLens !== "All") return null;

                  return (
                    <div key={group.group}>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">{group.group}</h3>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map(item => {
                          const isActive = activeLens === "All" || item.tags.includes(activeLens);
                          return (
                            <span 
                              key={item.name} 
                              className={`text-sm px-2.5 py-1 rounded border transition-colors ${
                                isActive 
                                  ? "bg-secondary text-secondary-foreground border-border" 
                                  : "bg-transparent text-muted border-transparent opacity-40 hidden"
                              }`}
                            >
                              {item.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold font-display border-b border-border pb-4 mb-6">Education</h2>
              <ul className="space-y-4">
                <li>
                  <div className="font-bold">Mott Community College</div>
                  <div className="text-sm text-muted-foreground">Coursework</div>
                </li>
                <li>
                  <div className="font-bold">Lapeer East High School</div>
                  <div className="text-sm text-muted-foreground">High School Diploma (1999–2003)</div>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold font-display border-b border-border pb-4 mb-6">Certifications</h2>
              <ul className="space-y-4">
                <li>
                  <div className="font-bold">CompTIA A+</div>
                  <div className="text-sm text-muted-foreground mb-1">University of North Texas testing center</div>
                  <div className="text-xs font-mono text-muted">Feb 2015</div>
                </li>
                <li>
                  <div className="font-bold">Programming for Everybody (Python)</div>
                  <div className="text-sm text-muted-foreground mb-1">University of Michigan (Coursera)</div>
                  <div className="text-xs font-mono text-muted">Aug 2014</div>
                </li>
                <li>
                  <div className="font-bold">The Data Scientist's Toolbox</div>
                  <div className="text-sm text-muted-foreground mb-1">Johns Hopkins University (Coursera)</div>
                  <div className="text-xs font-mono text-muted">Aug 2014</div>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold font-display border-b border-border pb-4 mb-6">Writing</h2>
              <ul className="space-y-4">
                <li className="group">
                  <a href="https://bytemycache.com" target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-foreground transition-colors">
                    <span className="font-medium flex items-start gap-2 mb-1 text-foreground group-hover:text-primary">
                      "How To Run Multiple Dockerized..."
                      <ExternalLink size={14} className="mt-1 shrink-0" />
                    </span>
                    <span className="text-sm">Featured in the official Docker newsletter.</span>
                  </a>
                </li>
                <li className="group">
                  <a href="https://bytemycache.com" target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-foreground transition-colors">
                    <span className="font-medium flex items-start gap-2 mb-1 text-foreground group-hover:text-primary">
                      "Protect Your Services with an Immutable Reverse Proxy..."
                      <ExternalLink size={14} className="mt-1 shrink-0" />
                    </span>
                    <span className="text-sm">4-part technical series.</span>
                  </a>
                </li>
                <li className="group">
                  <a href="https://bytemycache.com" target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-foreground transition-colors">
                    <span className="font-medium flex items-start gap-2 mb-1 text-foreground group-hover:text-primary">
                      "Why Laravel Image Handling Still Sucks..."
                      <ExternalLink size={14} className="mt-1 shrink-0" />
                    </span>
                  </a>
                </li>
              </ul>
            </div>

          </aside>
        </div>
      </div>
    </>
  );
}
