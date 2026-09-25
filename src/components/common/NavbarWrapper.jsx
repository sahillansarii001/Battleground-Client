"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  // Hide the public navbar on admin, panel, login, and register routes
  if (
    pathname.startsWith('/panel') || 
    pathname.startsWith('/admin') ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password'
  ) {
    return null;
  }
  
  return <Navbar />;
}
