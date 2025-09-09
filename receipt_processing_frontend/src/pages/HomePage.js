import Card from "../components/Card";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="container" style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <h2>Receipt & Expense Management</h2>
      <p style={{ opacity: 0.8, marginTop: -6 }}>Upload, process, search, and track expenses from your receipts and invoices.</p>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", marginTop: 12 }}>
        <Card header="Upload a Receipt">
          <p>Start by uploading a photo or PDF of your receipt. Our OCR will extract vendor, date, and totals.</p>
          <Link to="/upload" className="App-link">Go to Upload →</Link>
        </Card>
        <Card header="Monitor Processing">
          <p>Track OCR/processing status in real-time and troubleshoot any failures.</p>
          <Link to="/status" className="App-link">View Status →</Link>
        </Card>
        <Card header="Search Documents">
          <p>Search across vendors, dates, totals, and categories. Edit and manage documents.</p>
          <Link to="/documents" className="App-link">Open Documents →</Link>
        </Card>
        <Card header="Expenses Overview">
          <p>See totals by category and time period to understand spending patterns.</p>
          <Link to="/overview" className="App-link">Explore Overview →</Link>
        </Card>
        <Card header="Admin & Stats">
          <p>Platform metrics for monitoring and operations.</p>
          <Link to="/admin" className="App-link">Admin Dashboard →</Link>
        </Card>
      </div>
    </div>
  );
}
