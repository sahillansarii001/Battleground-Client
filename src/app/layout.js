import { Inter, Rajdhani, Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import NavbarWrapper from "@/components/common/NavbarWrapper";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const rajdhani = Rajdhani({ weight: ['400', '500', '600', '700'], subsets: ["latin"], variable: '--font-rajdhani' });
const orbitron = Orbitron({ weight: ['400', '500', '700', '900'], subsets: ["latin"], variable: '--font-orbitron' });
const space = Space_Grotesk({ subsets: ["latin"], variable: '--font-space' });

export const metadata = {
  title: "BATTLEGROUNDS | Official Tournament Portal",
  description: "Premium BGMI Esports Tournament Management Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${rajdhani.variable} ${orbitron.variable} ${space.variable} font-sans bg-[#080A0C] text-white min-h-screen flex flex-col antialiased selection:bg-[#FF6A00]/30 selection:text-[#FF6A00] overflow-x-hidden`}>
        
        {/* Global Gaming Background Effects */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#FF6A00]/5 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#39B54A]/5 rounded-full blur-[150px]"></div>
        </div>

        <AuthProvider>
          <div className="relative z-10 flex flex-col flex-1">
            <NavbarWrapper />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
