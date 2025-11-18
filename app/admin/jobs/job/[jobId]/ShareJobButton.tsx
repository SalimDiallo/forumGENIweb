'use client';

import ShareButton from '@/components/ui/ShareButton';

interface ShareJobButtonProps {
  jobSlug: string;
  jobTitle: string;
  companyName: string;
  description: string;
}

export default function ShareJobButton({
  jobSlug,
  jobTitle,
  companyName,
  description,
}: ShareJobButtonProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

  return (
    <ShareButton
      url={`${baseUrl}/careers/${jobSlug}`}
      title={`${jobTitle} - ${companyName}`}
      description={description.substring(0, 150)}
      variant="icon"
      size="lg"
      className="!bg-emerald-50 !text-emerald-700 hover:!bg-emerald-100"
    />
  );
}
