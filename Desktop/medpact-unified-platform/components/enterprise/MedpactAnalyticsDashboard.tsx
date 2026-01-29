'use client';

import { useState, useEffect } from 'react';

const stages = [
	{
		title: 'Contract Analysis',
		description:
			'AI-powered analysis of payer contracts, identification of pricing gaps and service line optimization, realistic simulation with progress feedback.',
	},
	{
		title: 'Market Benchmarking',
		description:
			'Integration with Federal Reserve and regional economic data, competitive pricing strategies and market analysis, benchmarking against industry standards.',
	},
	{
		title: 'Payer Negotiations',
		description:
			'Automated, data-driven negotiation algorithms, real-time market intelligence and proposal generation, intelligent workflow for maximizing contract value.',
	},
	{
		title: 'Revenue Maximization',
		description:
			'Dynamic pricing optimization and predictive analytics, identification of new revenue opportunities, competitive positioning and reimbursement maximization.',
	},
	{
		title: 'Continuous Optimization',
		description:
			'Ongoing performance monitoring with machine learning, strategic adjustments based on live analytics, ensures sustained revenue growth and operational efficiency.',
	},
];

const integrationFeatures = [
	'FHIR-compliant healthcare data exchange',
	'EHR/EMR system connectivity',
	'Payer system and financial reporting integration',
	'Real-time data sync and analytics',
];

const integrationHub = [
	'Visual dashboard for connecting to EHR, Billing, Analytics, Patient Portal, Pharmacy, Compliance, Lab, and Marketplace systems',
	'Status indicators for each integration (connected, pending, etc.)',
	'Quick Actions for common provider data tasks',
	'Secure, HIPAA-compliant data handling',
];

const securityCompliance = [
	'HIPAA, SOC2, and GDPR compliance',
	'Biometric authentication and deidentified analytics',
	'End-to-end encryption for all provider data',
];

export default function MedpactAnalyticsDashboard() {
	const [show, setShow] = useState(false);
	const [activeStage, setActiveStage] = useState<number | null>(null);
	const [contracts, setContracts] = useState<any[]>([]);

	useEffect(() => {
		if (show) {
			fetch('/api/contracts')
				.then((res) => res.json())
				.then(setContracts);
		}
	}, [show]);

	return (
		<div className="bg-white rounded-lg shadow p-6">
			<h2 className="text-xl font-semibold mb-4">Medpact Analytics Dashboard</h2>
			<p className="mb-6">Analytics features coming soon.</p>
			<button
				className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
				onClick={() => setShow((v) => !v)}
			>
				{show ? 'Hide Contracts' : 'Contracts'}
			</button>
			{show && (
				<div className="mt-8">
					<h3 className="text-lg font-bold mb-4">🏥 Advanced Price Transparency Application</h3>
					<div className="mb-8">
						<h4 className="text-md font-semibold mb-2">📊 5-Stage Revenue Optimization Process</h4>
						<ol className="list-decimal ml-6 space-y-4">
							{stages.map((stage, idx) => (
								<li key={stage.title}>
									<button
										className={`text-blue-700 underline font-semibold focus:outline-none ${
											activeStage === idx ? 'text-blue-900' : ''
										}`}
										onClick={() => setActiveStage(activeStage === idx ? null : idx)}
									>
										{stage.title}
									</button>
									{activeStage === idx && (
										<div className="mt-2 ml-2 p-3 bg-blue-50 rounded border border-blue-100 text-sm">
											{stage.description}
											<div className="mt-2">
												<span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
													Progress: Simulated
												</span>
											</div>
										</div>
									)}
								</li>
							))}
						</ol>
						<div className="mt-6">
							<h5 className="font-semibold mb-2">Key Features:</h5>
							<ul className="list-disc ml-6 text-sm">
								<li>Sequential or individual stage activation</li>
								<li>Live progress bars and notifications</li>
								<li>Exportable reports and executive dashboards</li>
								<li>Realistic timing and simulation for each stage</li>
							</ul>
						</div>
					</div>
					<div className="mb-8">
						<h4 className="text-md font-semibold mb-2">🔗 Provider Data Integration Functionality</h4>
						<ul className="list-disc ml-6 text-sm mb-2">
							{integrationFeatures.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
						<div className="mt-4">
							<h5 className="font-semibold mb-2">Integration Hub:</h5>
							<ul className="list-disc ml-6 text-sm">
								{integrationHub.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</div>
						<div className="mt-4">
							<h5 className="font-semibold mb-2">Security & Compliance:</h5>
							<ul className="list-disc ml-6 text-sm">
								{securityCompliance.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</div>
					</div>
					<div className="mt-8 p-6 bg-gray-50 border rounded">
						<h3 className="text-lg font-bold mb-2">Contracts Optimization</h3>
						<p>
							This is a scaffold for contracts optimization features and integration. Each stage above can be expanded
							with real data, progress bars, and interactive analytics as your application evolves.
						</p>
						<div className="mt-4">
							<h4 className="font-semibold mb-2">Sample Contracts</h4>
							<ul className="list-disc ml-6">
								{contracts.map((contract) => (
									<li key={contract.id} className="flex items-center gap-2">
										<span className="font-semibold">{contract.name}</span> — {contract.status} — {contract.value}
										<button
											className="ml-2 px-2 py-1 text-xs bg-yellow-100 rounded hover:bg-yellow-200"
											onClick={async () => {
												const nextStatus =
													contract.status === 'Pending'
														? 'Active'
														: contract.status === 'Active'
														? 'Complete'
														: 'Complete';
												await fetch('/api/contracts', {
													method: 'PUT',
													headers: { 'Content-Type': 'application/json' },
													body: JSON.stringify({ ...contract, status: nextStatus }),
												});
												fetch('/api/contracts')
													.then((res) => res.json())
													.then(setContracts);
											}}
										>
											Advance
										</button>
										<button
											className="ml-2 px-2 py-1 text-xs bg-red-100 rounded hover:bg-red-200"
											onClick={async () => {
												await fetch('/api/contracts', {
													method: 'DELETE',
													headers: { 'Content-Type': 'application/json' },
													body: JSON.stringify({ id: contract.id }),
												});
												fetch('/api/contracts')
													.then((res) => res.json())
													.then(setContracts);
											}}
										>
											Delete
										</button>
										<button
											className="ml-2 px-2 py-1 text-xs bg-blue-100 rounded hover:bg-blue-200"
											onClick={async () => {
												const newName = prompt('Edit contract name:', contract.name);
												if (!newName) return;
												await fetch('/api/contracts', {
													method: 'PUT',
													headers: { 'Content-Type': 'application/json' },
													body: JSON.stringify({ ...contract, name: newName }),
												});
												fetch('/api/contracts')
													.then((res) => res.json())
													.then(setContracts);
											}}
										>
											Edit
										</button>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}