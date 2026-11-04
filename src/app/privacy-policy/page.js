import Link from "next/link";
import { Shield, Lock, FileText, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | BATTLEGROUNDS Esports Portal",
  description: "Official Privacy Policy for Battlegrounds Mobile India Tournament Management Platform",
};

export default function PrivacyPolicy() {
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
            <Lock className="w-4 h-4 text-[#FF6A00]" />
            <span className="font-orbitron text-[11px] font-bold text-[#FF6A00] tracking-widest uppercase">
              Data Security & Governance
            </span>
          </div>
          <h1 className="font-rajdhani text-5xl md:text-6xl font-bold text-white mb-4 uppercase tracking-tight">
            Privacy <span className="text-[#FF6A00]">Policy</span>
          </h1>
          <p className="font-inter text-[#B8C0C2] max-w-xl mx-auto text-sm md:text-base">
            Last Updated: November 2026. Official privacy directives outlining how participant data is gathered, protected, and utilized within the tournament system.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-[#111518]/90 backdrop-blur-md border border-white/10 p-8 md:p-12 hud-border shadow-2xl space-y-10 font-inter text-[#B8C0C2] text-sm md:text-base leading-relaxed">
          
          <section>
            <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-3">
              <span className="w-2 h-6 bg-[#FF6A00] inline-block"></span>
              1. Overview
            </h2>
            <p>
              This Privacy Policy applies to the <strong>BATTLEGROUNDS Esports Tournament Management Portal</strong>. We are committed to safeguarding the privacy and personal data of all registered teams, operators, and administrators participating in our BGMI tournaments. By accessing or registering on our platform, you consent to the data collection and usage practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-3">
              <span className="w-2 h-6 bg-[#FF6A00] inline-block"></span>
              2. Information We Collect
            </h2>
            <p className="mb-4">
              To operate fair, verified, and competitive tournaments, we collect necessary tournament-related identification data:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong className="text-white">Squad Data:</strong> Squad name, logo insignia, registration type (SOLO, DUO, SQUAD), and assigned slots.</li>
              <li><strong className="text-white">Operator Data:</strong> Real legal name, in-game name (IGN), BGMI 10-digit Character ID, and team tactical role (e.g., IGL, Assaulter, Sniper, Support).</li>
              <li><strong className="text-white">Contact & Authentication:</strong> Email address for tournament correspondence, one-time security codes (OTP), and encrypted system passwords.</li>
              <li><strong className="text-white">Match & Telemetry Data:</strong> Kill counts, placement rankings, match room participation, and anti-cheat verification logs.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-3">
              <span className="w-2 h-6 bg-[#FF6A00] inline-block"></span>
              3. Purpose of Data Processing
            </h2>
            <p className="mb-4">Your information is strictly processed for the following tournament operational purposes:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Verifying squad eligibility and enforcing strict duplicate registration rules.</li>
              <li>Dispatching secure temporary login credentials, OTP authentication, and custom match room details (Room ID and Password).</li>
              <li>Calculating leaderboard points, placements, and publishing official tournament statistics.</li>
              <li>Conducting integrity checks, investigating fair-play violations, and preventing unauthorized account sharing.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-3">
              <span className="w-2 h-6 bg-[#FF6A00] inline-block"></span>
              4. Data Disclosure & Third Parties
            </h2>
            <p>
              We do <strong>not</strong> sell, rent, or monetize your personal information to third-party advertisers. Information is only shared with authorized infrastructure providers necessary to power the portal (such as Google Cloud / SMTP servers for transactional notification emails and Cloudinary for hosting squad insignias).
            </p>
          </section>

          <section>
            <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-3">
              <span className="w-2 h-6 bg-[#FF6A00] inline-block"></span>
              5. Security Protocols
            </h2>
            <p>
              We enforce multi-tiered defense protocols including industry-standard bcrypt hashing for passwords, JSON Web Tokens (JWT) for session management, and encrypted HTTPS/TLS communication. While we strive to maintain fortress-level security, no transmission over the Internet is 100% impenetrable.
            </p>
          </section>

          <section>
            <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-3">
              <span className="w-2 h-6 bg-[#FF6A00] inline-block"></span>
              6. Participant Rights & Data Deletion
            </h2>
            <p>
              You have the right to review, update, or request the deletion of your squad or player record upon completion of tournament obligations. If you wish to purge your profile or revoke access, you can reach out directly through official administrative channels.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-wider mb-3">
              Contact & Inquiries
            </h2>
            <p>
              For privacy inquiries, tournament data deletion requests, or technical support, please contact the High Command administration at:
            </p>
            <p className="mt-2 font-orbitron text-xs text-[#FF6A00]">
              sahilansari9967747153@gmail.com
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
