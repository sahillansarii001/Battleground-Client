import Link from "next/link";
import { Shield, FileCheck, ArrowLeft } from "lucide-react";
import Footer from "@/components/common/Footer";

export const metadata = {
  title: "Terms of Service | BATTLEGROUNDS Esports Portal",
  description:
    "Official Terms and Conditions for Battlegrounds Mobile India Tournament Management Platform",
};

export default function TermsOfService() {
  return (
    <div className="flex-1 py-32 bg-[#080A0C] relative z-10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-[#FF6A00]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation back */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-orbitron text-xs text-[#B8C0C2] hover:text-[#FF6A00] uppercase tracking-widest transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Base
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FF6A00]/10 border border-[#FF6A00]/30 px-4 py-1 mb-6">
            <FileCheck className="w-4 h-4 text-[#FF6A00]" />
            <span className="font-orbitron text-[11px] font-bold text-[#FF6A00] tracking-widest uppercase">
              Tournament Directives
            </span>
          </div>
          <h1 className="font-rajdhani text-5xl md:text-6xl font-bold text-white mb-4 uppercase tracking-tight">
            Terms of <span className="text-[#FF6A00]">Service</span>
          </h1>
          <p className="font-inter text-[#B8C0C2] max-w-xl mx-auto text-sm md:text-base">
            Last Updated: November 2026. Legally binding operational terms
            governing tournament registration, operator conduct, scoring
            regulations, and platform usage.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-[#111518]/90 backdrop-blur-md border border-white/10 p-8 md:p-12 hud-border shadow-2xl space-y-10 font-inter text-[#B8C0C2] text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-3">
              <span className="w-2 h-6 bg-[#FF6A00] inline-block"></span>
              1. Acceptance of Directives
            </h2>
            <p>
              By accessing, registering a squad, or entering any tournament room
              managed by the <strong>BATTLEGROUNDS Tournament Portal</strong>,
              all team leaders, managers, and players acknowledge that they have
              read, understood, and agreed to be bound unconditionally by these
              Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-3">
              <span className="w-2 h-6 bg-[#FF6A00] inline-block"></span>
              2. Eligibility & Fair Play Directives
            </h2>
            <p className="mb-4">
              All participants must maintain high standards of sportsmanship and
              competitive integrity:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <strong className="text-white">Anti-Cheat Enforcement:</strong>{" "}
                Use of modified APKs, scripts, wallhacks, aimbots, config files,
                or any third-party software granting unfair advantage is
                strictly forbidden and punishable by instant lifetime bans.
              </li>
              <li>
                <strong className="text-white">Device Restrictions:</strong>{" "}
                Matches must be played on standard handheld iOS or Android
                mobile devices. Emulators (e.g. Gameloop, BlueStacks), triggers,
                iPad tablets (unless explicitly permitted by tournament rules),
                and external peripherals are prohibited.
              </li>
              <li>
                <strong className="text-white">Account Sharing:</strong> Ringing
                (playing on another player's account) or entering a lobby
                without registered character IDs results in automatic squad
                disqualification.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-3">
              <span className="w-2 h-6 bg-[#FF6A00] inline-block"></span>
              3. Registration, Credentials & Approvals
            </h2>
            <p>
              Squads must register with accurate operator details and unique
              10-digit BGMI Character IDs. Submission of fraudulent, duplicate,
              or impersonated operator information will lead to rejection.
              Temporary access codes issued to squad leads must be guarded
              carefully; users are fully responsible for all activity conducted
              under their credentials.
            </p>
          </section>

          <section>
            <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-3">
              <span className="w-2 h-6 bg-[#FF6A00] inline-block"></span>
              4. Match Administration & High Command Authority
            </h2>
            <p>
              Tournament administrators reserve absolute authority in
              interpreting tournament rules, resolving disputes, determining
              rematches in the event of server collapse, and certifying final
              score calculations. Decisions made by the official tournament
              administration are final and binding.
            </p>
          </section>

          <section>
            <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-3">
              <span className="w-2 h-6 bg-[#FF6A00] inline-block"></span>
              5. Intellectual Property & Disclaimer
            </h2>
            <p>
              Battlegrounds Mobile India (BGMI) and its related assets, logos,
              and trademarks are the intellectual property of{" "}
              <strong>KRAFTON, Inc.</strong> This tournament portal is an
              independent competitive esports management platform organized for
              gaming communities and is not formally affiliated with, endorsed
              by, or sponsored by KRAFTON, Inc.
            </p>
          </section>

          <section>
            <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-3">
              <span className="w-2 h-6 bg-[#FF6A00] inline-block"></span>
              6. Limitation of Liability
            </h2>
            <p>
              The platform administrators are not liable for in-game technical
              anomalies, Krafton server downtime, local device crashes, network
              latency/ping drops, or unauthorized access resulting from
              participant negligence.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-wider mb-3">
              Official Administration Contact
            </h2>
            <p>
              For grievances, rule clarification, or match disputes, submit an
              official inquiry to:
            </p>
            <p className="mt-2 font-orbitron text-xs text-[#FF6A00]">
              sahillansarii001@gmail.com
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
