"use client";
import React, { useState } from "react";

const sampleAccounts = [
	{ platform: "Twitter", status: "Connected", followers: 1200 },
	{ platform: "LinkedIn", status: "Not Connected", followers: 0 },
];

export default function SocialMediaIntegration() {
	const [accounts, setAccounts] = useState(sampleAccounts);
	const [showScheduler, setShowScheduler] = useState(false);
	const [aiPrompt, setAiPrompt] = useState("");
	const [aiResponse, setAiResponse] = useState("");

	const handleConnect = (platform: string) => {
		// Placeholder for OAuth/social connect logic
		setAccounts((prev) =>
			prev.map((acc) =>
				acc.platform === platform ? { ...acc, status: "Connected" } : acc
			)
		);
	};

	const handleAIPrompt = async () => {
		// Placeholder for AI assistant integration
		setAiResponse("(AI) Social media strategy suggestions will appear here.");
	};

	return (
		<div className="flex min-h-screen">
			{/* Main Content */}
			<div className="flex-1 p-8">
				<h1 className="text-2xl font-bold mb-4">Social Media Integration</h1>
				<div className="mb-6">
					<h2 className="text-lg font-semibold mb-2">Linked Accounts</h2>
					<table className="w-full border mb-4">
						<thead>
							<tr className="bg-gray-100">
								<th className="p-2 text-left">Platform</th>
								<th className="p-2 text-left">Status</th>
								<th className="p-2 text-left">Followers</th>
								<th className="p-2 text-left">Action</th>
							</tr>
						</thead>
						<tbody>
							{accounts.map((acc) => (
								<tr key={acc.platform}>
									<td className="p-2">{acc.platform}</td>
									<td className="p-2">{acc.status}</td>
									<td className="p-2">{acc.followers}</td>
									<td className="p-2">
										{acc.status === "Not Connected" ? (
											<button
												className="bg-blue-500 text-white px-3 py-1 rounded"
												onClick={() => handleConnect(acc.platform)}
											>
												Connect
											</button>
										) : (
											<span className="text-green-600">Connected</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="mb-6">
					<h2 className="text-lg font-semibold mb-2">Social Analytics</h2>
					<div className="bg-gray-50 p-4 rounded shadow">
						<p>Followers (Total): {accounts.reduce((sum, acc) => sum + acc.followers, 0)}</p>
						<p>Posts Scheduled: 0</p>
						<p>Engagement Rate: --%</p>
						<button
							className="mt-2 bg-indigo-500 text-white px-3 py-1 rounded"
							onClick={() => setShowScheduler(true)}
						>
							Schedule Post
						</button>
					</div>
				</div>
				{showScheduler && (
					<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
						<div className="bg-white p-6 rounded shadow-lg w-96">
							<h3 className="text-lg font-bold mb-2">Schedule Social Post</h3>
							<textarea className="w-full border rounded p-2 mb-2" placeholder="Write your post..." />
							<input type="datetime-local" className="w-full border rounded p-2 mb-2" />
							<div className="flex justify-end gap-2">
								<button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setShowScheduler(false)}>
									Cancel
								</button>
								<button className="bg-blue-600 text-white px-3 py-1 rounded">Schedule</button>
							</div>
						</div>
					</div>
				)}
			</div>
			{/* AI Assistant Sidebar */}
			<aside className="w-80 bg-gray-100 border-l p-6 flex flex-col">
				<h2 className="text-xl font-bold mb-4">AI Social Assistant</h2>
				<textarea
					className="w-full border rounded p-2 mb-2"
					placeholder="Ask for social media strategy, post ideas, analytics..."
					value={aiPrompt}
					onChange={(e) => setAiPrompt(e.target.value)}
				/>
				<button
					className="bg-indigo-600 text-white px-3 py-1 rounded mb-2"
					onClick={handleAIPrompt}
				>
					Ask AI
				</button>
				<div className="bg-white border rounded p-2 min-h-[80px]">
					{aiResponse || <span className="text-gray-400">AI response will appear here.</span>}
				</div>
				<div className="mt-8 text-xs text-gray-500">
					<p>Connect your social accounts to enable analytics and scheduling.</p>
				</div>
			</aside>
		</div>
	);
}
