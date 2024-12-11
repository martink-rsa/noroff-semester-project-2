export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      <p className="mt-4 text-xl">Loading dashboard...</p>
    </div>
  );
}
