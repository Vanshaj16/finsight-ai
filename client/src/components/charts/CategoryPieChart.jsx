import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const colors = ["#8B7CFF", "#4FD1FF", "#FF7A8A", "#FFB366", "#76F7BF", "#F3F4F6"];

const CategoryPieChart = ({ data }) => (
  <div className="card-surface h-[360px] p-5 text-white">
    <div className="mb-4">
      <p className="kicker">Category Split</p>
      <h3 className="mt-2 text-2xl font-semibold text-white">Where your money goes</h3>
    </div>
    <ResponsiveContainer width="100%" height="82%">
      <PieChart>
        <Pie data={data} dataKey="total" nameKey="category" innerRadius={70} outerRadius={112} paddingAngle={4}>
          {data.map((entry, index) => (
            <Cell key={entry.category} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => `Rs ${Number(value).toLocaleString("en-IN")}`}
          contentStyle={{
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(179, 190, 235, 0.94)",
            color: "#fff",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default CategoryPieChart;
