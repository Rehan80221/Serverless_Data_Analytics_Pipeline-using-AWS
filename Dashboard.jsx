import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Dashboard() {
  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState(true);
  const [showLineChart, setShowLineChart] = useState(false);
  const [showBarChart, setShowBarChart] = useState(false);

  useEffect(() => {
    axios.get('https://bg35vkefal.execute-api.us-east-1.amazonaws.com/dev/get-data')
      .then(res => {
        const parsed = JSON.parse(res.data.body);
        setData(parsed);
      })
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  if (!Array.isArray(data)) return <div className="p-6 text-red-600">Loading or Invalid Data</div>;

  const stackedData = Array.from(
    data.reduce((acc, cur) => {
      const key = cur.country;
      if (!acc.has(key)) acc.set(key, { country: key });
      acc.get(key)[cur.source] = (acc.get(key)[cur.source] || 0) + 1;
      return acc;
    }, new Map()).values()
  );

  const handleTableClick = (item) => {
    console.log("Row clicked:", item);
  };

  const handleLineClick = (data, index) => {
    console.log("Line point clicked:", data);
  };

  const handleBarClick = (data, index) => {
    console.log("Bar clicked:", data);
  };

  return (
    <div className="p-6 font-sans bg-gray-50 min-h-screen">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-800 underline mb-6">📊 Real-Time Dashboard</h1>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setShowTable(prev => !prev)}
            className={`px-4 py-2 rounded text-white font-medium transition ${
              showTable ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {showTable ? 'Hide Table' : 'Show Table'}
          </button>

          <button
            onClick={() => setShowLineChart(prev => !prev)}
            className={`px-4 py-2 rounded text-white font-medium transition ${
              showLineChart ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {showLineChart ? 'Hide Line Chart' : 'Show Line Chart'}
          </button>

          <button
            onClick={() => setShowBarChart(prev => !prev)}
            className={`px-4 py-2 rounded text-white font-medium transition ${
              showBarChart ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {showBarChart ? 'Hide Bar Chart' : 'Show Bar Chart'}
          </button>
        </div>
      </header>

      {showTable && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">📄 Raw Data Table</h2>
          <div className="overflow-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Country</th>
                  <th className="border p-2">Source</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleTableClick(item)}
                  >
                    <td className="border p-2">{item.id}</td>
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2">{item.country}</td>
                    <td className="border p-2">{item.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {showLineChart && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">📈 Line Chart - Entries Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="id"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                onClick={handleLineClick}
              />
            </LineChart>
          </ResponsiveContainer>
        </section>
      )}

      {showBarChart && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">📊 Stacked Bar Chart - Source by Country</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stackedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip />
              <Legend />
              {[...new Set(data.map(d => d.source))].map(source => (
                <Bar
                  key={source}
                  dataKey={source}
                  stackId="a"
                  fill={COLORS[Math.floor(Math.random() * COLORS.length)]}
                  onClick={handleBarClick}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}
    </div>
  );
}

export default Dashboard;
