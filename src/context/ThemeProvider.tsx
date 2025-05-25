'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextThemeProvider enableSystem={true} attribute="class" defaultTheme="system">
			{children}
		</NextThemeProvider>
	);
}
