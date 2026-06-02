import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Terminal, Server, Code2, Cpu } from "lucide-react";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Seth Brasile",
    "jobTitle": "Engineer · IT/Security · Builder",
    "address": { "@type": "PostalAddress", "addressLocality": "Durant", "addressRegion": "OK" },
    "email": "seth@tenorcreative.com",
    "url": "https://sethbrasile.com",
    "sameAs": ["https://github.com/sethbrasile","https://youtube.com/@byteMyCache","https://www.linkedin.com/in/sethbrasile-43a315a0","https://bytemycache.com","https://pricklypearmarketing.co"],
    "knowsAbout": ["TypeScript","JavaScript","Go","Python","PowerShell","Full-Stack Development","DevOps","PCI-DSS","Cybersecurity","Automation","SaaS","Web Audio API","Cloudflare Workers","Drizzle ORM","Enterprise IT"],
    "worksFor": { "@type": "Organization", "name": "Prickly Pear Marketing Co", "url": "https://pricklypearmarketing.co" }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <>
      <Helmet>
        <title>Seth Brasile — Engineer, Builder, IT/Security | Durant, OK</title>
        <meta name="description" content="Engineer, DevOps, and IT/Security operator. Building software, securing infrastructure, and co-owning businesses. 12+ years experience." />
        <link rel="canonical" href="https://sethbrasile.com/" />
        <meta property="og:title" content="Seth Brasile — Engineer, Builder, IT/Security | Durant, OK" />
        <meta property="og:description" content="Engineer, DevOps, and IT/Security operator. Building software, securing infrastructure, and co-owning businesses. 12+ years experience." />
        <meta property="og:url" content="https://sethbrasile.com/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Seth Brasile — Engineer, Builder, IT/Security | Durant, OK" />
        <meta name="twitter:description" content="Engineer, DevOps, and IT/Security operator. Building software, securing infrastructure, and co-owning businesses. 12+ years experience." />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <motion.article 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-3xl"
      >
        <motion.section variants={itemVariants} className="mb-20 pt-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Seth builds <span className="text-muted-foreground">&</span> operates.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-10 max-w-2xl">
            I'm a software engineer who also spent the better part of a decade running enterprise
            IT and security. So I write the code, own the infrastructure it runs on, and answer
            the on-call line when it breaks at 2am — usually for systems I built myself. Most
            teams split that across three people. The fact that it's one person is the whole point.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="https://pricklypearmarketing.co" 
              className="inline-flex items-center justify-center bg-foreground text-background px-6 py-4 rounded-md font-medium transition-transform hover:-translate-y-1"
            >
              Marketing or SEO? → Prickly Pear Marketing Co
            </a>
            <Link 
              href="/contact"
              className="inline-flex items-center justify-center border border-border bg-card px-6 py-4 rounded-md font-medium transition-transform hover:-translate-y-1"
            >
              Need something built or automated? → Work with Seth directly
            </Link>
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="mb-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-border py-10">
          <div>
            <div className="font-mono text-3xl font-bold mb-1">12+</div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Years Exp</div>
          </div>
          <div>
            <div className="font-mono text-3xl font-bold mb-1">75+</div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Direct Reports</div>
          </div>
          <div>
            <div className="font-mono text-3xl font-bold mb-1">3.2k</div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Endpoints Managed</div>
          </div>
          <div>
            <div className="font-mono text-3xl font-bold mb-1">4</div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Regulated Ind.</div>
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold font-display">Featured Projects</h2>
            <Link href="/work" className="text-sm font-medium flex items-center gap-1 hover:text-primary transition-colors">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid gap-6">
            <div className="group border border-border bg-card rounded-lg p-6 transition-all hover:border-foreground/50">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">potluck-planner.com</h3>
                <a href="https://potluck-planner.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                  <ArrowRight size={20} className="-rotate-45" />
                </a>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Solo event-coordination SaaS; passkeys/WebAuthn, OAuth, magic links, payments, email/SMS, 10 background job handlers. Production-ready.
              </p>
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                <span className="bg-secondary px-2 py-1 rounded">Next.js 15</span>
                <span className="bg-secondary px-2 py-1 rounded">Better Auth</span>
                <span className="bg-secondary px-2 py-1 rounded">Neon+Drizzle</span>
                <span className="bg-secondary px-2 py-1 rounded">Stripe</span>
                <span className="bg-secondary px-2 py-1 rounded">Inngest</span>
              </div>
            </div>

            <div className="group border border-border bg-card rounded-lg p-6 transition-all hover:border-foreground/50">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">margin-check.com</h3>
                <a href="https://margin-check.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                  <ArrowRight size={20} className="-rotate-45" />
                </a>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Solo SaaS; ingests Etsy CSV exports, surfaces real per-listing profit margins after all fees. Pre-launch.
              </p>
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                <span className="bg-secondary px-2 py-1 rounded">Next.js 16</span>
                <span className="bg-secondary px-2 py-1 rounded">CF Workers</span>
                <span className="bg-secondary px-2 py-1 rounded">Neon+Drizzle</span>
                <span className="bg-secondary px-2 py-1 rounded">Stripe</span>
              </div>
            </div>

            <div className="group border border-border bg-card rounded-lg p-6 transition-all hover:border-foreground/50">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">ppmc-claude-routines-and-schedules</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Policy-as-code AI governance for an agency — declarative routines, version-controlled CLAUDE.md set, drift detection, dev-mode guards, pre-push secret scanning.
              </p>
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                <span className="bg-secondary px-2 py-1 rounded">Bash</span>
                <span className="bg-secondary px-2 py-1 rounded">YAML</span>
                <span className="bg-secondary px-2 py-1 rounded">Claude Code</span>
                <span className="bg-secondary px-2 py-1 rounded">Git</span>
              </div>
            </div>
            
            <div className="group border border-border bg-card rounded-lg p-6 transition-all hover:border-foreground/50">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Immutable Reverse-Proxy Edge</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Fedora CoreOS immutable reverse proxy at the network edge, terminating SSL on the LAN side for IDS/IPS inspection. Deployed in production.
              </p>
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                <span className="bg-secondary px-2 py-1 rounded">Fedora CoreOS</span>
                <span className="bg-secondary px-2 py-1 rounded">NGINX</span>
                <span className="bg-secondary px-2 py-1 rounded">fail2ban</span>
                <span className="bg-secondary px-2 py-1 rounded">Cloudflare</span>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="mb-20 bg-secondary/50 p-8 rounded-lg border border-border">
          <h2 className="text-xl font-bold mb-4 font-display">About Seth</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
            <p>
              I've been building software since 2013, and running enterprise IT and security for
              most of the years around it — twelve-plus years across casinos, healthcare,
              manufacturing, and government. The kind of regulated places where "it works on my
              machine" gets you a compliance finding.
            </p>
            <p>
              The short version: I built BetterLife's entire platform from zero — frontend,
              backend, ML, databases, CI/CD — and hired and led the team of six that ran it. It
              turned profitable in its first year. Before that I spent two years as a PCI-DSS
              subject-matter expert, led the PrintNightmare response across a regulated client
              base, and built security and compliance automation across roughly three thousand
              endpoints. Today I ship production SaaS solo on a modern edge stack, and I co-own
              a marketing agency.
            </p>
            <p>
              What ties it together: I codify, version, review, and secure the things most shops
              still do by hand. I'll tell you straight when something was a proof-of-concept and
              when it was production. I treat my own homelab like production — incident reports
              and all. And I write the kind of code I'd want to inherit.
            </p>
            <p>
              If you found your way here, you probably already know some of this. So tell me what
              you're trying to build, or fix.
            </p>
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="border-t border-border pt-10">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="text-muted-foreground" size={20} />
            <h2 className="text-lg font-bold font-display">Beyond the Keyboard</h2>
          </div>
          <div className="text-muted-foreground space-y-3">
            <p>
              When I'm not shipping code: I run a homelab I treat like production — yes, I write
              incident reports for outages that only affect me. I cook on camera over at{" "}
              <a href="https://bytemycache.com" target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">byteMyCache</a>.
              I build things out of wood, play guitar, and occasionally build the guitar. And I
              co-own a real-estate partnership, because apparently three businesses wasn't enough.
            </p>
            <p>Same instinct every time: take it apart, understand it, make it work better.</p>
          </div>
        </motion.section>

      </motion.article>
    </>
  );
}
