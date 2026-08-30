'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [pathname]);

  return <>{children}</>;
}
