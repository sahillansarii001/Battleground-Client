import Link from "next/link";
import { Shield, Lock, FileText, ArrowLeft, CheckCircle2 } from "lucide-react";
import Footer from "@/components/common/Footer";

export const metadata = {
  title: "Privacy Policy | BATTLEGROUNDS Esports Portal",
  description: "Official Privacy Policy and Google API User Data Policy Compliance for Battlegrounds Mobile India Tournament Management Platform",
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
              Data Governance & Compliance Directives
            </span>
          </div>
          <h1 className="font-rajdhani text-5xl md:text-6xl font-bold text-white mb-4 uppercase tracking-tight">
            Privacy <span className="text-[#FF6A00]">Policy</span>
          </h1>
          <p className="font-inter text-[#B8C0C2] max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Effective Date: November 4, 2026. This comprehensive Privacy Policy governs data protection, participant privacy, and Google API Services User Data compliance for the BATTLEGROUNDS Esports Management Platform.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-[#111518]/90 backdrop-blur-md border border-white/10 p-8 md:p-12 hud-border shadow-2xl space-y-10 font-inter text-[#B8C0C2] text-sm md:text-base leading-relaxed">
          
          {/* Section 1 */}
          <section>
            <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-3">
              <span className="w-2 h-6 bg-[#FF6A00] inline-block"></span>
              1. Introduction & Operational Scope
            </h2>
            <p className="mb-3">
              The <strong>BATTLEGROUNDS Esports Tournament Management Platform</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), operating via <code>https://battleground.nexcoreinstitute.org</code>, provides competitive tournament organization, automated match bracket scheduling, custom match room credential distribution, scoring calculations, and player leaderboard rankings for Battlegrounds Mobile India (BGMI).
            </p>
            <p>
              We prioritize transparency and the safeguarding of all user, team, and participant information. This Privacy Policy details the exact types of data we collect, how it is stored, how it is used, and our stringent compliance with international data privacy standards and Google API policies.
            </p>
          </section>

          {/* Section 2 - Google API Compliance (Mandatory for Google Verification) */}
          <section className="bg-[#FF6A00]/5 border border-[#FF6A00]/30 p-6 md:p-8 hud-border">
            <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-[#FF6A00]" />
              2. Google API Services User Data Policy & Limited Use Disclosure
            </h2>
            <p className="mb-4 text-white font-medium">
              Our application uses Google APIs exclusively to transmit automated transactional emails to registered tournament participants (such as registration OTPs, temporary squad access keys, password reset links, and match room notifications).
            </p>
            <div className="bg-black/50 border-l-4 border-[#FF6A00] p-4 mb-4 text-white font-mono text-xs md:text-sm">
              &quot;BATTLEGROUNDS&apos; use and transfer to any other app of information received from Google APIs will adhere to the{' '}
              <a 
                href="https://developers.google.com/terms/api-services-user-data-policy" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#FF6A00] underline font-bold"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.&quot;
            </div>
            <ul className="space-y-3 pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#39B54A] shrink-0 mt-0.5" />
                <span><strong>No Human Readership:</strong> No human administrator or third party reads, monitors, or accesses any user inbox or email correspondence.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#39B54A] shrink-0 mt-0.5" />
                <span><strong>No Advertising or Monetization:</strong> Google Workspace and Gmail API data is never transferred or sold to advertising brokers, data aggregators, or information resellers.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#39B54A] shrink-0 mt-0.5" />
                <span><strong>No AI/ML Training:</strong> Data obtained via Google APIs is never used to train machine learning models, artificial intelligence, or large language models (LLMs).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#39B54A] shrink-0 mt-0.5" />
                <span><strong>Strict Scope Limitation:</strong> The application only utilizes the Gmail API send scope to dispatch outbound system messages initiated by administrative actions or participant verification triggers.</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-3">
              <span className="w-2 h-6 bg-[#FF6A00] inline-block"></span>
              3. Information We Collect
            </h2>
            <p className="mb-4">
              To operate fair, verified, and competitive tournaments, we collect necessary tournament-related identification data:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong className="text-white">Squad Data:</strong> Squad name, logo insignia, registration type (SOLO, DUO, SQUAD), and assigned slots.</li>
              <li><strong className="text-white">Operator Data:</strong> Real legal name, in-game name (IGN), BGMI 10-digit Character ID, and team tactical role (e.g., IGL, Assaulter, Sniper, Support).</li>
              <li><strong className="text-white">Contact & Authentication:</strong> Email address for tournament correspondence, one-time security codes (OTP), and salted bcrypt-encrypted system passwords.</li>
              <li><strong className="text-white">Match & Telemetry Data:</strong> Kill counts, placement rankings, match room participation, and anti-cheat verification logs.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-3">
              <span className="w-2 h-6 bg-[#FF6A00] inline-block"></span>
              4. How We Use Participant Information
            </h2>
            <p className="mb-4">Your information is strictly processed for legitimate tournament operational purposes:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Verifying squad eligibility and enforcing strict duplicate registration rules.</li>
              <li>Dispatching secure temporary login credentials, OTP authentication, and custom match room details (Room ID and Password).</li>
              <li>Calculating leaderboard points, placements, and publishing official tournament statistics.</li>
              <li>Conducting integrity checks, investigating fair-play violations, and preventing unauthorized account sharing.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-3">
              <span className="w-2 h-6 bg-[#FF6A00] inline-block"></span>
              5. Data Disclosure & Third Parties
            </h2>
            <p>
              We do <strong>not</strong> sell, rent, or monetize your personal information to third-party advertisers. Information is only shared with authorized infrastructure providers necessary to power the portal (such as Google Cloud / SMTP servers for transactional notification emails and Cloudinary for hosting squad insignias).
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-3">
              <span className="w-2 h-6 bg-[#FF6A00] inline-block"></span>
              6. Data Security & Storage Architecture
            </h2>
            <p className="mb-3">
              We enforce multi-tiered defense protocols including industry-standard bcrypt hashing for passwords, JSON Web Tokens (JWT) for session management, and encrypted HTTPS/TLS communication.
            </p>
            <p>
              User databases are hosted in isolated MongoDB Atlas clusters protected by IP whitelisting and enterprise firewalls.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-3">
              <span className="w-2 h-6 bg-[#FF6A00] inline-block"></span>
              7. Participant Rights & Data Deletion Directives
            </h2>
            <p className="mb-4">
              All registered users retain full rights over their personal data in accordance with applicable data protection regulations:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 mb-4">
              <li><strong>Right of Access & Rectification:</strong> You can view and update your squad operators, IGNs, and comms emails via the team settings portal.</li>
              <li><strong>Right to Erasure (Data Deletion):</strong> You may request the permanent deletion of your squad profile, player records, and authentication tokens at any time.</li>
              <li><strong>Revoking Google Access:</strong> If you authorized Google credentials with this application, you can revoke access at any time via <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer" className="text-[#FF6A00] underline font-bold">Google Account Security Permissions</a>.</li>
            </ul>
            <p>
              To request complete data deletion, email our administrative team at <strong className="text-white">sahilansari9967747153@gmail.com</strong> with the subject line <em>&quot;DATA PURGE REQUEST&quot;</em>. All records will be expunged within 48 business hours.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-white/10 pt-8">
            <h2 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-wider mb-3">
              Official Contact & Administration
            </h2>
            <p className="mb-2">
              For any questions regarding this Privacy Policy or tournament data governance, contact:
            </p>
            <p className="font-orbitron text-xs text-[#FF6A00]">
              Email: sahilansari9967747153@gmail.com
            </p>
            <p className="text-xs text-[#888] mt-2">
              Operating URL: https://battleground.nexcoreinstitute.org
            </p>
          </section>

        </div>
      </div>
      <Footer />
    </div>
  );
}
