import CandidateRegistrationsChart from '@/components/CandidateRegistrationsChart';

export default function CRMCandidateRegistrationsPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Candidate Registrations</h1>
        <p className="text-slate-500 mt-1">View daily candidate registration statistics.</p>
      </div>
      
      <CandidateRegistrationsChart />
    </div>
  );
}
