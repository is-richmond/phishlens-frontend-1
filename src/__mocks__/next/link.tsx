/**
 * Mock: next/link
 *
 * Renders a plain <a> tag for testing.
 */

import React from "react";

interface LinkProps {
	href: string;
	children: React.ReactNode;
	className?: string;
	[key: string]: unknown;
}

function MockLink({ href, children, ...rest }: LinkProps) {
	return (
		<a href={href} {...rest}>
			{children}
		</a>
	);
}

export default MockLink;
