import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const MonthlyLineChart = ({ data }) => (
  <div className="card-surface h-[360px] p-5 text-white">
    <div className="mb-4">
      <p className="kicker">Monthly Trend</p>
      <h3 className="mt-2 text-2xl font-semibold text-white">Spending momentum</h3>
    </div>
    <ResponsiveContainer width="100%" height="82%">
      <LineChart data={data}>
        <CartesianGrid stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="4 4" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "rgba(255,255,255,0.56)", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "rgba(255,255,255,0.56)", fontSize: 12 }} />
        <Tooltip
          formatter={(value) => `Rs ${Number(value).toLocaleString("en-IN")}`}
          contentStyle={{
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(8, 10, 18, 0.94)",
            color: "#fff",
          }}
        />
        <Line type="monotone" dataKey="total" stroke="#7C87FF" strokeWidth={3.2} dot={{ r: 4, fill: "#fff" }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default MonthlyLineChart;
