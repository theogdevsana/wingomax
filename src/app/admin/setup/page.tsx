import Admin from "@/lib/models/Admin";
import connectToDatabase from "@/lib/mongodb";
import SetupForm from "./SetupForm";

export default async function AdminSetup() {
  await connectToDatabase();
  const admins = await Admin.find({}, 'username createdAt').sort({ createdAt: -1 });

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F5F5F7] p-4 lg:p-8">
      {/* Abstract Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Side: Setup Form */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <SetupForm />
        </div>

        {/* Right Side: List of Admins */}
        <div className="w-full lg:w-1/2 bg-white/80 backdrop-blur-xl border border-white/50 p-8 rounded-[2rem] shadow-2xl h-[500px] flex flex-col">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Existing Admins</h2>
          <p className="text-slate-500 font-medium mb-6">List of all created admin accounts.</p>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {admins.length > 0 ? (
              admins.map((admin, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold">
                      {admin.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="block font-bold text-slate-700">{admin.username}</span>
                      <span className="block text-xs text-slate-500">Joined: {new Date(admin.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 font-medium">
                No admins found. Create the first one!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
