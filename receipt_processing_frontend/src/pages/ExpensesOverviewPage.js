import { useEffect, useState } from "react";
import { getExpensesOverview } from "../services/api";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import Card from "../components/Card";

function formatDateInput(date) {
  return date.toISOString().slice(0, 10);
}

export default function ExpensesOverviewPage() {
  const [from, setFrom] = useState(formatDateInput(new Date(new Date().getFullYear(), 0, 1)));
  const [to, setTo] = useState(formatDateInput(new Date()));
  const [groupBy, setGroupBy] = useState("month");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({ byCategory: [], byPeriod: [] });

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await getExpensesOverview({ from, to, groupBy });
      setData({
        byCategory: res?.byCategory || [],
        byPeriod: res?.byPeriod || [],
      });
    } catch (err) {
      setError(err?.payload?.message || err.message || "Failed to load overview");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    load();
  }

  return (
    <div className="container" style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h2>Expenses Overview</h2>
      <Card>
        <form onSubmit={onSubmit} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <label>From <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
          <label>To <input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
          <label>
            Group by
            <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
              <option value="day">Day</option>
              <option value="month">Month</option>
              <option value="quarter">Quarter</option>
              <option value="year">Year</option>
            </select>
          </label>
          <button className="theme-toggle" type="submit">Apply</button>
        </form>
      </Card>

      {loading && <Loader text="Loading analytics..." />}
      {error && <ErrorState description={error} />}

      {!loading && !error && (
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
          <Card header="By Category">
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
              {data.byCategory.map((row) => (
                <li key={row.category} style={{ display: "grid", gridTemplateColumns: "140px 1fr 80px", gap: 8, alignItems: "center" }}>
                  <span style={{ fontWeight: 600 }}>{row.category}</span>
                  <div style={{ background: "var(--border-color,#e9ecef)", borderRadius: 6, overflow: "hidden", height: 10 }}>
                    <div style={{ width: Math.min(100, row.percent || 0) + "%", background: "var(--button-bg,#007bff)", height: "100%" }} />
                  </div>
                  <span style={{ textAlign: "right" }}>${row.amount?.toFixed?.(2) ?? row.amount}</span>
                </li>
              ))}
              {!data.byCategory?.length && <div style={{ opacity: 0.7 }}>No data</div>}
            </ul>
          </Card>

          <Card header={`By ${groupBy[0].toUpperCase() + groupBy.slice(1)}`}>
            <div style={{ display: "grid", gap: 8 }}>
              {data.byPeriod.map((row) => (
                <div key={row.period} style={{ display: "grid", gridTemplateColumns: "140px 1fr 80px", gap: 8, alignItems: "center" }}>
                  <span style={{ fontWeight: 600 }}>{row.period}</span>
                  <div style={{ background: "var(--border-color,#e9ecef)", borderRadius: 6, overflow: "hidden", height: 10 }}>
                    <div style={{ width: Math.min(100, row.percent || 0) + "%", background: "var(--text-secondary,#61dafb)", height: "100%" }} />
                  </div>
                  <span style={{ textAlign: "right" }}>${row.amount?.toFixed?.(2) ?? row.amount}</span>
                </div>
              ))}
              {!data.byPeriod?.length && <div style={{ opacity: 0.7 }}>No data</div>}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
