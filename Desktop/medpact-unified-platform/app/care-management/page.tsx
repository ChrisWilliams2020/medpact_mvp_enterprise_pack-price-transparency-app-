
"use client";
import { useState } from "react";
import { Heart, Users, FileText, Calendar } from "react-feather"; // adjust imports as needed

const samplePatients = [
	{ name: "John Doe", status: "Active", assigned: 2, plan: "Diabetes", progress: 80 },
	{ name: "Jane Smith", status: "Pending", assigned: 1, plan: "Hypertension", progress: 60 },
	// ...add more sample patients as needed
];

export default function CareManagementPage() {
	const [logo, setLogo] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
	const [aiLoading, setAiLoading] = useState(false);

	const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const reader = new FileReader();
			reader.onload = ev => setLogo(ev.target?.result as string);
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	const filtered = samplePatients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

	const fetchAiSuggestions = async () => {
		setAiLoading(true);
		setTimeout(() => {
			setAiSuggestions([
				"Assign care plans based on patient risk scores.",
				"Automate follow-up reminders for improved adherence.",
				"Escalate cases with missed follow-ups to care team.",
				"Track outcomes and analytics for each plan.",
				"Enable secure messaging for patient/provider communication.",
			]);
			setAiLoading(false);
		}, 1200);
	};

	return (
		<div className="flex">
			{/* AI Assistant Sidebar */}
			<aside className="w-72 min-h-screen bg-gray-50 border-r p-6 flex flex-col">
				<h2 className="text-lg font-bold mb-4 text-purple-700">AI Care Management Assistant</h2>
				<button
					className="mb-4 px-3 py-1 bg-purple-600 text-white rounded"
					onClick={fetchAiSuggestions}
					disabled={aiLoading}
				>
					{aiLoading ? "Loading..." : "Get Smart Suggestions"}
				</button>
				<ul className="mb-4">
					{aiSuggestions.map((s, idx) => (
						<li key={idx} className="mb-2 text-gray-700">{s}</li>
					))}
				</ul>
				<div className="text-xs text-gray-500">AI can optimize care plan assignment, reminders, and outcomes.</div>
			</aside>
			{/* Main Content */}
			<div className="flex-1 p-8">
				<h1 className="text-2xl font-bold mb-4">Care Management</h1>
				<div className="mb-4 flex items-center gap-4">
					<label className="font-semibold">Upload Drug/Product Logo:</label>
					<input type="file" accept="image/*" onChange={handleLogoUpload} />
					{logo && <img src={logo} alt="Ad Logo" className="h-12 w-12 object-contain border rounded" />}
				</div>
				<div className="mb-4">
					<button className="px-3 py-1 bg-yellow-600 text-white rounded" onClick={() => alert('Ad Clicked!')}>Review Product Ads</button>
					<span className="ml-2 text-sm text-gray-600">Ad views and clicks drive platform monetization. NIL enabled for providers.</span>
				</div>
				<div className="mb-8">
					<input
						className="border px-2 py-1 rounded mb-2"
						placeholder="Search patients..."
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{filtered.map((p, idx) => (
							<div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
								<div className="flex items-center gap-3">
									<Heart className="text-red-500" />
									<span className="font-bold text-lg">{p.name}</span>
									<span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{p.status}</span>
								</div>
								<div className="flex items-center gap-2">
									<Users className="text-green-500" />
									<span>Assigned: {p.assigned}</span>
									<FileText className="text-purple-500" />
									<span>Plan: {p.plan}</span>
									<Calendar className="text-yellow-500" />
									<span>Progress: {p.progress}%</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

		return (
			<div className="flex">
				{/* AI Assistant Sidebar */}
				<aside className="w-72 min-h-screen bg-gray-50 border-r p-6 flex flex-col">
					<h2 className="text-lg font-bold mb-4 text-purple-700">AI Care Management Assistant</h2>
					<button
						className="mb-4 px-3 py-1 bg-purple-600 text-white rounded"
						onClick={fetchAiSuggestions}
						disabled={aiLoading}
					>
						{aiLoading ? "Loading..." : "Get Smart Suggestions"}
					</button>
					<ul className="mb-4">
						{aiSuggestions.map((s, idx) => (
							<li key={idx} className="mb-2 text-gray-700">{s}</li>
						))}
					</ul>
					<div className="text-xs text-gray-500">AI can optimize care plan assignment, reminders, and outcomes.</div>
				</aside>
				{/* Main Content */}
				<div className="flex-1 p-8">
					<h1 className="text-2xl font-bold mb-4">Care Management</h1>
					<div className="mb-4 flex items-center gap-4">
						<label className="font-semibold">Upload Drug/Product Logo:</label>
						<input type="file" accept="image/*" onChange={handleLogoUpload} />
						{logo && <img src={logo} alt="Ad Logo" className="h-12 w-12 object-contain border rounded" />}
					</div>
					<div className="mb-4">
						<button className="px-3 py-1 bg-yellow-600 text-white rounded" onClick={() => alert('Ad Clicked!')}>Review Product Ads</button>
						<span className="ml-2 text-sm text-gray-600">Ad views and clicks drive platform monetization. NIL enabled for providers.</span>
					</div>
					<div className="mb-8">
						<input
							className="border px-2 py-1 rounded mb-2"
							placeholder="Search patients..."
							value={search}
							onChange={e => setSearch(e.target.value)}
						/>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{filtered.map((p, idx) => (
								<div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
									<div className="flex items-center gap-3">
										<Heart className="text-red-500" />
										<span className="font-bold text-lg">{p.name}</span>
										<span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{p.status}</span>
									</div>
									<div className="flex items-center gap-2">
										<Users className="text-green-500" />
										<span>Assigned: {p.assigned}</span>
										<FileText className="text-purple-500" />
										<span>Plan: {p.plan}</span>
										<Calendar className="text-yellow-500" />
										<span>Progress: {p.progress}%</span>
									</div>
									<div className="w-full bg-gray-200 rounded h-2 mt-2">
										<div className="bg-green-500 h-2 rounded" style={{ width: `${p.progress}%` }}></div>
									</div>
								</div>
							))}
						</div>
					</div>
					<ul className="list-disc ml-6">
						<li>Care plan assignment and follow-up scheduling</li>
						<li>Automated reminders and real-time monitoring</li>
						<li>Analytics for adherence and outcomes</li>
						<li>Secure messaging and document sharing</li>
						<li>Escalation workflows for missed follow-ups</li>
						<li>Advertising window for drug/med tech logos and product ads</li>
						<li>NIL monetization for physician/provider</li>
					</ul>
				</div>
			</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
					<Card>
						<CardHeader>
							<div className='flex items-center gap-3'>
								<div className='p-3 bg-red-100 rounded-lg'>
									<Heart className='h-6 w-6 text-red-600' />
								</div>
								<div>
									<CardTitle>Patient Protocols</CardTitle>
									<CardDescription>Standardized care pathways</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className='text-gray-600 mb-4'>Create and manage evidence-based care protocols for common conditions.</p>
							<Button>View Protocols</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className='flex items-center gap-3'>
								<div className='p-3 bg-blue-100 rounded-lg'>
									<Users className='h-6 w-6 text-blue-600' />
								</div>
								<div>
									<CardTitle>Care Team Coordination</CardTitle>
									<CardDescription>Collaborate effectively</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className='text-gray-600 mb-4'>Coordinate care across providers, nurses, and support staff.</p>
							<Button>Manage Team</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className='flex items-center gap-3'>
								<div className='p-3 bg-purple-100 rounded-lg'>
									<FileText className='h-6 w-6 text-purple-600' />
								</div>
								<div>
									<CardTitle>Clinical Documentation</CardTitle>
									<CardDescription>Efficient record keeping</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className='text-gray-600 mb-4'>Streamlined documentation tools for accurate clinical records.</p>
							<Button>View Documents</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className='flex items-center gap-3'>
								<div className='p-3 bg-green-100 rounded-lg'>
									<Calendar className='h-6 w-6 text-green-600' />
								</div>
								<div>
									<CardTitle>Follow-up Scheduling</CardTitle>
									<CardDescription>Automated reminders</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className='text-gray-600 mb-4'>Automatic scheduling and reminders for patient follow-ups.</p>
							<Button>View Schedule</Button>
						</CardContent>
					</Card>
				</div>

				<div className='mt-8'>
					<h1 className='text-2xl font-bold mb-4'>Care Management Workflow</h1>
					<input
						placeholder='Search Patient'
						value={search}
						onChange={e => setSearch(e.target.value)}
						className='mb-4 border px-2 py-1 rounded'
					/>
					<table className='min-w-full border'>
						<thead>
							<tr>
								<th className='border px-4 py-2'>Patient</th>
								<th className='border px-4 py-2'>Care Plan</th>
								<th className='border px-4 py-2'>Assigned Staff</th>
								<th className='border px-4 py-2'>Status</th>
								<th className='border px-4 py-2'>Progress</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((p, idx) => (
								<tr key={idx}>
									<td className='border px-4 py-2'>{p.name}</td>
									<td className='border px-4 py-2'>{p.plan}</td>
									<td className='border px-4 py-2'>{p.assigned}</td>
									<td className='border px-4 py-2'>{p.status}</td>
									<td className='border px-4 py-2'>
										<div className='w-full bg-gray-200 rounded h-4'>
											<div
												className='bg-green-500 h-4 rounded'
												style={{ width: `${p.progress}%` }}
											></div>
										</div>
										<span className='text-xs ml-2'>{p.progress}%</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className='mt-4'>
						<strong>Reminders:</strong>{' '}
						<span className='text-sm'>Automated reminders for overdue care plans.</span>
					</div>
				</div>
			</div>
		);
}

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
					<Card>
						<CardHeader>
							<div className='flex items-center gap-3'>
								<div className='p-3 bg-red-100 rounded-lg'>
									<Heart className='h-6 w-6 text-red-600' />
								</div>
								<div>
									<CardTitle>Patient Protocols</CardTitle>
									<CardDescription>
										Standardized care pathways
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className='text-gray-600 mb-4'>
								Create and manage evidence-based care protocols for common
								conditions.
							</p>
							<Button>View Protocols</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className='flex items-center gap-3'>
								<div className='p-3 bg-blue-100 rounded-lg'>
									<Users className='h-6 w-6 text-blue-600' />
								</div>
								<div>
									<CardTitle>Care Team Coordination</CardTitle>
									<CardDescription>
										Collaborate effectively
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className='text-gray-600 mb-4'>
								Coordinate care across providers, nurses, and support staff.
							</p>
							<Button>Manage Team</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className='flex items-center gap-3'>
								<div className='p-3 bg-purple-100 rounded-lg'>
									<FileText className='h-6 w-6 text-purple-600' />
								</div>
								<div>
									<CardTitle>Clinical Documentation</CardTitle>
									<CardDescription>
										Efficient record keeping
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className='text-gray-600 mb-4'>
								Streamlined documentation tools for accurate clinical records.
							</p>
							<Button>View Documents</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className='flex items-center gap-3'>
								<div className='p-3 bg-green-100 rounded-lg'>
									<Calendar className='h-6 w-6 text-green-600' />
								</div>
								<div>
									<CardTitle>Follow-up Scheduling</CardTitle>
									<CardDescription>
										Automated reminders
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className='text-gray-600 mb-4'>
								Automatic scheduling and reminders for patient follow-ups.
							</p>
							<Button>View Schedule</Button>
						</CardContent>
					</Card>
				</div>

				<div className='p-8'>
					<h1 className='text-2xl font-bold mb-4'>
						Care Management Workflow
					</h1>
					<input
						placeholder='Search Patient'
						value={search}
						onChange={e => setSearch(e.target.value)}
						className='mb-4 border px-2 py-1 rounded'
					/>
					<table className='min-w-full border'>
						<thead>
							<tr>
								<th className='border px-4 py-2'>Patient</th>
								<th className='border px-4 py-2'>Care Plan</th>
								<th className='border px-4 py-2'>Assigned Staff</th>
								<th className='border px-4 py-2'>Status</th>
								<th className='border px-4 py-2'>Progress</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((p, idx) => (
								<tr key={idx}>
									<td className='border px-4 py-2'>{p.name}</td>
									<td className='border px-4 py-2'>{p.plan}</td>
									<td className='border px-4 py-2'>{p.assigned}</td>
									<td className='border px-4 py-2'>{p.status}</td>
									<td className='border px-4 py-2'>
										<div className='w-full bg-gray-200 rounded h-4'>
											<div
												className='bg-green-500 h-4 rounded'
												style={{ width: `${p.progress}%` }}
											></div>
										</div>
										<span className='text-xs ml-2'>{p.progress}%</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className='mt-4'>
						<strong>Reminders:</strong>{' '}
						<span className='text-sm'>
							Automated reminders for overdue care plans.
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
