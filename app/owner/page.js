import Topbar from '../components/Topbar'
import { connectDB } from '../lib/connectDB'
import User from '../models/User'

export default async function OwnerDashboard() {
  await connectDB();
  let userCount = 0;
  let users = [];
  try {
    userCount = await User.countDocuments();
    users = await User.find({}, { username: 1, fullname: 1, email: 1, _id: 0 }).limit(10).lean();
  } catch (e) {
    userCount = 0;
    users = [];
  }

  return (
    <>
      <Topbar heading={"Owner Dashboard"} />

      <section className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl bg-white p-6">
          <p className="text-sm text-gray-600 mb-2">Total Users</p>
          <p className="text-4xl font-bold text-black">{userCount}</p>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6">
        <h2 className="text-2xl font-semibold text-black mb-4">Recent Users</h2>
        {users.length === 0 ? (
          <p className="text-gray-600">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#eee]">
                  <th className="py-3 px-2 text-gray-600 font-medium">Username</th>
                  <th className="py-3 px-2 text-gray-600 font-medium">Full name</th>
                  <th className="py-3 px-2 text-gray-600 font-medium">Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={idx} className="border-b border-[#eee] last:border-0">
                    <td className="py-3 px-2 text-black">{u.username}</td>
                    <td className="py-3 px-2 text-black">{u.fullname}</td>
                    <td className="py-3 px-2 text-black">{u.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}
