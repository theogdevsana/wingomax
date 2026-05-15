import connectToDatabase from "@/lib/mongodb";
import License from "@/lib/models/License";
import { Key, Users, AlertOctagon, DollarSign } from "lucide-react";

async function getStats() {
  try {
    await connectToDatabase();
    const licenses = await License.find();

    let totalKeys = licenses.length;
    let totalUsed = 0;
    let totalBanned = 0;
    let totalRevenue = 0;

    licenses.forEach((lic) => {
      if (lic.deviceId) totalUsed++;
      if (lic.status === 'banned') totalBanned++;

      const durationMs = new Date(lic.expiresAt).getTime() - new Date(lic.createdAt).getTime();
      const days = Math.round(durationMs / (1000 * 60 * 60 * 24));
      
      let price = 0;
      if (days <= 7) price = 499;
      else if (days <= 15) price = 1499;
      else price = 1999;

      totalRevenue += price;
    });

    return { 
      status: "Connected",
      totalKeys,
      totalUsed,
      totalBanned,
      totalRevenue
    };
  } catch (error) {
    console.error(error);
    return { status: "Error connecting to DB", totalKeys: 0, totalUsed: 0, totalBanned: 0, totalRevenue: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Overview</h1>
        <p className="text-sm md:text-base text-slate-500 mt-1 font-medium">Welcome back, Admin. Real-time statistics are loaded.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Keys" value={stats.totalKeys.toString()} icon={<Key className="text-blue-600" size={24} />} />
        <StatCard title="Used Devices" value={stats.totalUsed.toString()} icon={<Users className="text-purple-600" size={24} />} />
        <StatCard title="Banned Keys" value={stats.totalBanned.toString()} icon={<AlertOctagon className="text-red-600" size={24} />} negative={stats.totalBanned > 0} />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} icon={<DollarSign className="text-green-600" size={24} />} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Additional sections can be added here */}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, negative = false }: { title: string, value: string, icon: React.ReactNode, negative?: boolean }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      </div>
      <h4 className="text-slate-500 font-medium text-xs md:text-sm">{title}</h4>
      <p className={`text-2xl md:text-3xl font-black mt-1 tracking-tight ${negative ? 'text-red-600' : 'text-slate-900'}`}>{value}</p>
    </div>
  );
}


