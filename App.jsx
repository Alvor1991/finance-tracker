import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://zfjfewxqgwdpfhhxeazb.supabase.co",
  "sb_publishable_P4YiP6SjMYnz9McCZfc_pg_ZEBBw99w"
);

const expenseCategories = ["Rent", "Bins + WiFi", "Phone", "Apple Dental", "Apple Gym", "Apple Bus"];
const months = ["May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March", "April"];
const year1Months = ["May", "June", "July", "August", "September", "October", "November", "December"];
const year2Months = ["January", "February", "March", "April"];
const savingsCategories = ["Pension", "House", "Investing", "Emergency", "Holiday"];

const historicalSavings = {
  Pension: 26000,
  House: 19700,
  Investing: 1400,
  Emergency: 0,
  Holiday: 1000,
};

const thStyle = { backgroundColor: "#f8fafc", padding: "6px 8px", whiteSpace: "nowrap" };
const inputStyle = { width: "65px", textAlign: "right", border: "1px solid #e2e8f0", borderRadius: "4px", padding: "2px 4px" };

function ExpenseTable({ title, monthSet, expensesData, handleChange }) {
  const calculateCategoryTotal = (category) =>
    monthSet.reduce((sum, month) => sum + parseFloat(expensesData[month][category] || 0), 0);

  const calculateMonthTotal = (month) =>
    Object.values(expensesData[month]).reduce((sum, val) => sum + parseFloat(val || 0), 0);

  return (
    <>
      <h3 style={{ marginBottom: "8px" }}>{title}</h3>
      <div style={{ overflowX: "auto" }}>
        <table border="1" cellPadding="5" style={{ textAlign: "center", marginBottom: "30px", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Category</th>
              {monthSet.map((m) => <th key={m} style={thStyle}>{m}</th>)}
              <th style={thStyle}>Total</th>
            </tr>
          </thead>
          <tbody>
            {expenseCategories.map((cat) => (
              <tr key={cat}>
                <td style={{ fontWeight: 500, textAlign: "left", padding: "5px 10px", whiteSpace: "nowrap" }}>{cat}</td>
                {monthSet.map((month) => (
                  <td key={month}>
                    <input
                      type="text"
                      value={expensesData[month][cat]}
                      onChange={(e) => handleChange(month, cat, e.target.value, "expenses")}
                      style={inputStyle}
                    />
                  </td>
                ))}
                <td style={{ fontWeight: 600 }}>€{calculateCategoryTotal(cat).toFixed(0)}</td>
              </tr>
            ))}
            <tr style={{ fontWeight: "bold", backgroundColor: "#f0f9ff" }}>
              <td style={{ textAlign: "left", padding: "5px 10px" }}>Monthly Total</td>
              {monthSet.map((month) => (
                <td key={month}>€{calculateMonthTotal(month).toFixed(0)}</td>
              ))}
              <td>€{expenseCategories.reduce((sum, cat) => sum + calculateCategoryTotal(cat), 0).toFixed(0)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function SavingsTable({ title, monthSet, savingsData, handleChange }) {
  const calculateMonthTotal = (month) =>
    Object.values(savingsData[month]).reduce((sum, val) => sum + parseFloat(val || 0), 0);

  return (
    <>
      <h3 style={{ marginBottom: "8px" }}>{title}</h3>
      <div style={{ overflowX: "auto" }}>
        <table border="1" cellPadding="5" style={{ textAlign: "center", marginBottom: "30px", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Month</th>
              {savingsCategories.map((c) => <th key={c} style={thStyle}>{c}</th>)}
              <th style={thStyle}>Total</th>
            </tr>
          </thead>
          <tbody>
            {monthSet.map((month) => (
              <tr key={month}>
                <td style={{ fontWeight: 500, textAlign: "left", padding: "5px 10px" }}>{month}</td>
                {savingsCategories.map((cat) => (
                  <td key={cat}>
                    <input
                      type="text"
                      value={savingsData[month][cat]}
                      onChange={(e) => handleChange(month, cat, e.target.value, "savings")}
                      style={{ ...inputStyle, width: "80px" }}
                    />
                  </td>
                ))}
                <td style={{ fontWeight: 600 }}>€{calculateMonthTotal(month).toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function App() {
  const emptyExpenses = months.reduce((acc, month) => {
    acc[month] = expenseCategories.reduce((c, cat) => { c[cat] = ""; return c; }, {});
    return acc;
  }, {});

  const emptySavings = months.reduce((acc, month) => {
    acc[month] = savingsCategories.reduce((c, cat) => { c[cat] = ""; return c; }, {});
    return acc;
  }, {});

  const [expensesData, setExpensesData] = useState(emptyExpenses);
  const [savingsData, setSavingsData] = useState(emptySavings);
  const [status, setStatus] = useState("loading");

  const expensesRef = useRef(expensesData);
  const savingsRef = useRef(savingsData);
  const debounceTimer = useRef(null);

  useEffect(() => { expensesRef.current = expensesData; }, [expensesData]);
  useEffect(() => { savingsRef.current = savingsData; }, [savingsData]);

  useEffect(() => {
    const loadData = async () => {
      const { data, error } = await supabase
        .from("finance_data")
        .select("data")
        .eq("id", "tracker")
        .single();

      if (error) {
        console.error("Error loading data:", error);
        setStatus("error");
        return;
      }

      if (data?.data?.expenses && Object.keys(data.data.expenses).length > 0) {
        setExpensesData({ ...emptyExpenses, ...data.data.expenses });
      }
      if (data?.data?.savings && Object.keys(data.data.savings).length > 0) {
        setSavingsData({ ...emptySavings, ...data.data.savings });
      }
      setStatus("saved");
    };

    loadData();
  }, []);

  const saveData = useCallback(async (newExpenses, newSavings) => {
    const { error } = await supabase
      .from("finance_data")
      .upsert({ id: "tracker", data: { expenses: newExpenses, savings: newSavings }, updated_at: new Date() });

    if (error) {
      console.error("Error saving:", error);
      setStatus("error");
    } else {
      setStatus("saved");
    }
  }, []);

  const debouncedSave = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      saveData(expensesRef.current, savingsRef.current);
    }, 800);
  }, [saveData]);

  const handleChange = (month, category, value, type) => {
    if (/^\d*\.?\d*$/.test(value)) {
      if (type === "expenses") {
        const updated = { ...expensesData, [month]: { ...expensesData[month], [category]: value } };
        setExpensesData(updated);
      } else {
        const updated = { ...savingsData, [month]: { ...savingsData[month], [category]: value } };
        setSavingsData(updated);
      }
      setStatus("saving");
      debouncedSave();
    }
  };

  const calculateGrandTotal = (category) => {
    const contributions = months.reduce((sum, month) => sum + parseFloat(savingsData[month][category] || 0), 0);
    const multiplier = category === "Pension" ? 2 : 1;
    return historicalSavings[category] + contributions * multiplier;
  };

  const statusColor = status === "saved" ? "#22c55e" : status === "saving" ? "#f59e0b" : status === "error" ? "#ef4444" : "#94a3b8";
  const statusText = status === "saved" ? "✓ Saved" : status === "saving" ? "Saving..." : status === "error" ? "⚠ Error saving" : "Loading...";

  return (
    <div style={{ padding: "20px", maxWidth: "960px", margin: "auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <h1 style={{ margin: 0 }}>Monthly Finance Tracker 💰</h1>
        <span style={{ fontSize: "13px", color: statusColor, fontWeight: 500 }}>{statusText}</span>
      </div>

      <h2>Expenses</h2>
      <ExpenseTable title="2025 (May – December)" monthSet={year1Months} expensesData={expensesData} handleChange={handleChange} />
      <ExpenseTable title="2026 (January – April)" monthSet={year2Months} expensesData={expensesData} handleChange={handleChange} />

      <h2>Savings</h2>
      <SavingsTable title="2025 (May – December)" monthSet={year1Months} savingsData={savingsData} handleChange={handleChange} />
      <SavingsTable title="2026 (January – April)" monthSet={year2Months} savingsData={savingsData} handleChange={handleChange} />

      <h3>Grand Totals</h3>
      <div style={{ overflowX: "auto" }}>
        <table border="1" cellPadding="5" style={{ textAlign: "center", marginBottom: "30px", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {savingsCategories.map((c) => <th key={c} style={thStyle}>{c}</th>)}
              <th style={thStyle}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ fontWeight: "bold", backgroundColor: "#f0f9ff" }}>
              {savingsCategories.map((cat) => (
                <td key={cat}>€{calculateGrandTotal(cat).toLocaleString()}</td>
              ))}
              <td>€{savingsCategories.reduce((sum, cat) => sum + calculateGrandTotal(cat), 0).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;

