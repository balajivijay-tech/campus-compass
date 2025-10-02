import { SalaryBenchmarkingTool } from '@/components/intelligence/SalaryBenchmarkingTool';
import { EmployerDirectory } from '@/components/intelligence/EmployerDirectory';

export default function Intelligence() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Intelligence Hub</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-1">
          <SalaryBenchmarkingTool />
        </div>
        <div className="lg:col-span-1">
          <EmployerDirectory />
        </div>
      </div>
    </div>
  );
}