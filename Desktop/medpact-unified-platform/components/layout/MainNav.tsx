import React from "react";

const MainNav = () => {
	return (
		<nav className="bg-white border-b px-4 py-2 flex items-center justify-between">
			<div className="font-bold text-lg">MedPact</div>
			<div className="space-x-4">
				<a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
				<a href="/care-management" className="text-gray-700 hover:text-blue-600">Care</a>
				<a href="/analytics" className="text-gray-700 hover:text-blue-600">Analytics</a>
				<a href="/settings" className="text-gray-700 hover:text-blue-600">Settings</a>
			</div>
		</nav>
	);
};

export { MainNav };
