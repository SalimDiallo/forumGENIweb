"use client";
import Header from '@/components/Header';
import type { Metadata } from 'next';
import { usePathname } from 'next/navigation';



export default function SectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
            <Header />
            <div className={`${pathname !=="/" ? "py-18" : ""}`}>
                {children}
          </div>
    </>
    
  );
}