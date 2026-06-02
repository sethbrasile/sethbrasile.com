import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";

type Lens = "All" | "dev" | "it" | "leader";

interface Project {
  id: string;
  title: string;
  url?: string;
  repo?: string;
  description: string;
  stack: string[];
  tags: ("dev" | "it" | "leader")[];
}

const projects: Project[] = [
  {
    id: "margin-check",
    title: "margin-check.com",
    url: "https://margin-check.com",
    description: "Solo SaaS; ingests Etsy CSV exports, surfaces real per-listing profit margins after all fees. Pre-launch.",
    stack: ["Next.js 16", "Cloudflare Workers", "Neon + Drizzle", "Better Auth", "Stripe", "Inngest"],
    tags: ["dev"]
  },
  {
    id: "potluck-planner",
    title: "potluck-planner.com",
    url: "https://potluck-planner.com",
    description: "Solo event-coordination SaaS; passkeys/WebAuthn, OAuth, magic links, payments, email/SMS, 10 background job handlers. Production-ready.",
    stack: ["Next.js 15", "Better Auth", "Neon + Drizzle", "Cloudflare Workers", "Stripe", "Resend", "Twilio", "Inngest"],
    tags: ["dev"]
  },
  {
    id: "idea-machine",
    title: "idea-machine",
    description: "Team RAG with a dual-database privacy boundary by design — shared topics in Postgres, private topics in local SQLite; data classification enforced at the storage layer.",
    stack: ["Python", "Postgres (Neon)", "SQLite", "trafilatura", "yt-dlp", "cryptography"],
    tags: ["dev", "it"]
  },
  {
    id: "ppmc-claude",
    title: "ppmc-claude-routines-and-schedules",
    description: "Policy-as-code AI governance for an agency — declarative routines, version-controlled CLAUDE.md set, drift detection, dev-mode guards, pre-push secret scanning.",
    stack: ["Bash", "YAML", "Claude Code", "git"],
    tags: ["it", "dev", "leader"]
  },
  {
    id: "ez-web-audio",
    title: "EZ Web Audio",
    repo: "https://github.com/sethbrasile/ez-web-audio",
    description: "Framework-agnostic Web Audio API wrapper; modern successor to ember-audio.",
    stack: ["TypeScript", "Web Audio API"],
    tags: ["dev"]
  },
  {
    id: "justice-for-us",
    title: "Justice For Us — White House SXSL (2016)",
    url: "https://techcrunch.com/2016/10/03/white-houses-sxsl-shows-what-its-like-to-be-in-the-criminal-justice-system/",
    description: "Engineering contributor on an interactive sentencing exhibit at the White House South by South Lawn.",
    stack: ["JavaScript", "Ember", "ember-audio"],
    tags: ["dev"]
  },
  {
    id: "msp-rmm",
    title: "MSP RMM Platform (DKB POC)",
    description: "Cross-platform agent (Linux/Mac/Windows) + server-side message broker over gRPC + mutual TLS. POC replacement for traditional RMM tooling.",
    stack: ["Go", "gRPC", "mTLS"],
    tags: ["it", "dev"]
  },
  {
    id: "immutable-proxy",
    title: "Immutable Reverse-Proxy Edge",
    description: "Fedora CoreOS immutable reverse proxy at the network edge, terminating SSL on the LAN side for IDS/IPS inspection. Deployed in production.",
    stack: ["Fedora CoreOS", "NGINX", "fail2ban", "Cloudflare"],
    tags: ["it"]
  }
];

export default function Work() {
  const [activeLens, setActiveLens] = useState<Lens>("All");

  const filteredProjects = projects.filter(p => 
    activeLens === "All" ? true : p.tags.includes(activeLens)
  );

  return (
    <>
      <Helmet>
        <title>Projects & Work — Seth Brasile</title>
        <meta name="description" content="Software, infrastructure, and automation projects built by Seth Brasile." />
        <link rel="canonical" href="https://sethbrasile.com/work" />
        <meta property="og:title" content="Projects & Work — Seth Brasile" />
        <meta property="og:description" content="Software, infrastructure, and automation projects built by Seth Brasile." />
        <meta property="og:url" content="https://sethbrasile.com/work" />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="Projects & Work — Seth Brasile" />
        <meta name="twitter:description" content="Software, infrastructure, and automation projects built by Seth Brasile." />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6 tracking-tight">Projects & Work</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            A selection of software builds, infrastructure deployments, and automation systems. From zero-to-one SaaS to policy-as-code governance.
          </p>
        </header>

        <div className="mb-10 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground mr-2">Lens:</span>
          {(["All", "dev", "it", "leader"] as Lens[]).map(lens => (
            <button
              key={lens}
              onClick={() => setActiveLens(lens)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeLens === lens 
                  ? "bg-foreground text-background" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {lens === "dev" ? "Developer" : lens === "it" ? "IT/Security" : lens === "leader" ? "Leadership" : "All"}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group border border-border bg-card p-6 md:p-8 rounded-xl"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold font-display flex items-center gap-3">
                      {project.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {project.repo && (
                      <a href={project.repo} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors p-2 bg-secondary rounded-full" aria-label="GitHub Repository">
                        <Github size={18} />
                      </a>
                    )}
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors p-2 bg-secondary rounded-full" aria-label="Live Site">
                        <ArrowUpRight size={18} />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  {project.description}
                </p>

                <div className="flex items-center justify-between border-t border-border pt-6">
                  <div className="flex flex-wrap gap-2 font-mono text-sm">
                    {project.stack.map(tech => (
                      <span key={tech} className="bg-secondary/50 px-2.5 py-1 rounded text-secondary-foreground border border-border/50">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
