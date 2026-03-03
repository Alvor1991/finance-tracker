import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://zfjfewxqgwdpfhhxeazb.supabase.co",
  "sb_publishable_P4YiP6SjMYnz9McCZfc_pg_ZEBBw99w"
);

const expenseCategories = ["Rent", "Bins + WiFi", "Gas + Electric", "Phone", "Apple Dental", "Apple Gym", "Apple Bus", "Apple Food", "Car Insurance", "Car Service", "Motor Tax"];
const savingsCategories = ["Pension", "House", "Emergency", "Holiday"];
const investmentCategories = ["S&P500", "Apple Stock"];
const allGrandTotalCategories = ["Pension", "House", "Investing", "Emergency", "Holiday"];

const expenseYear0Months = ["Jan24", "Feb24", "Mar24", "Apr24", "May24", "Jun24", "Jul24", "Aug24", "Sep24", "Oct24", "Nov24", "Dec24"];
const expenseYear1Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const expenseYear2Months = ["eJan26", "eFeb26", "eMar26", "eApr26"];
const expenseMonths = [...expenseYear0Months, ...expenseYear1Months, ...expenseYear2Months];

const savingsYear1Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const savingsYear2Months = ["sJan26", "sFeb26", "sMar26", "sApr26"];
const savingsMonths = [...savingsYear1Months, ...savingsYear2Months];

const investYear1Months = ["iFeb", "iMar", "iApr", "iMay", "iJun", "iJul", "iAug", "iSep", "iOct", "iNov", "iDec"];
const investYear2Months = ["iJan", "iFeb", "iMar", "iApr", "iMay", "iJun", "iJul", "iAug", "iSep", "iOct", "iNov", "iDec"];
const investYear3Months = ["iJan26", "iFeb26", "iMar26", "iApr26"];
const investMonths = [...investYear1Months, ...investYear2Months, ...investYear3Months];

const monthLabel = (key) => {
  const map = {
    Jan24: "Jan", Feb24: "Feb", Mar24: "Mar", Apr24: "Apr",
    May24: "May", Jun24: "Jun", Jul24: "Jul", Aug24: "Aug",
    Sep24: "Sep", Oct24: "Oct", Nov24: "Nov", Dec24: "Dec",
    eJan26: "Jan", eFeb26: "Feb", eMar26: "Mar", eApr26: "Apr",
    sJan26: "Jan", sFeb26: "Feb", sMar26: "Mar", sApr26: "Apr",
    iJan: "Jan", iFeb: "Feb", iMar: "Mar", iApr: "Apr",
    iMay: "May", iJun: "Jun", iJul: "Jul", iAug: "Aug",
    iSep: "Sep", iOct: "Oct", iNov: "Nov", iDec: "Dec",
    iJan26: "Jan", iFeb26: "Feb", iMar26: "Mar", iApr26: "Apr",
  };
  return map[key] || key;
};

const historicalSavings = {
  Pension: 22292,
  House: 0,
  Emergency: 0,
  Holiday: 0,
};

const thStyle = { backgroundColor: "#f8fafc", padding: "6px 8px", whiteSpace: "nowrap", minWidth: "80px" };
const inputStyle = { width: "65px", textAlign: "right", border: "1px solid #e2e8f0", borderRadius: "4px", padding: "2px 4px" };

function ExpenseTable({ title, monthSet, expensesData, handleChange }) {
  const [open, setOpen] = useState(true);

  const calculateCategoryTotal = (category) =>
    monthSet.reduce((sum, month) => sum + parseFloat(expensesData[month][category] || 0), 0);

  const calculateMonthTotal = (month) =>
    Object.values(expensesData[month]).reduce((sum, val) => sum + parseFloat(val || 0), 0);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <span onClick={() => setOpen(!open)} style={{ cursor: "pointer", fontSize: "18px", color: "#94a3b8", userSelect: "none" }}>
          {open ? "⌃" : "⌄"}
        </span>
      </div>
      {open && (
        <div style={{ overflowX: "auto" }}>
          <table border="1" cellPadding="5" style={{ textAlign: "center", marginBottom: "30px", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Category</th>
                {monthSet.map((m) => <th key={m} style={thStyle}>{monthLabel(m)}</th>)}
                <th style={thStyle}>Total</th>
              </tr>
            </thead>
            <tbody>
              {expenseCategories.map((cat) => (
                <tr key={cat}>
                  <td style={{ fontWeight: 500, textAlign: "left", padding: "5px 10px", whiteSpace: "nowrap" }}>{cat}</td>
                  {monthSet.map((month) => (
                    <td key={month}>
                      <input type="text" value={expensesData[month][cat]} onChange={(e) => handleChange(month, cat, e.target.value, "expenses")} style={inputStyle} />
                    </td>
                  ))}
                  <td style={{ fontWeight: 600 }}>€{calculateCategoryTotal(cat).toFixed(0)}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: "bold", backgroundColor: "#f0f9ff" }}>
                <td style={{ textAlign: "left", padding: "5px 10px" }}>Total</td>
                {monthSet.map((month) => (
                  <td key={month}>€{calculateMonthTotal(month).toFixed(0)}</td>
                ))}
                <td>€{expenseCategories.reduce((sum, cat) => sum + calculateCategoryTotal(cat), 0).toFixed(0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function SavingsTable({ title, monthSet, savingsData, handleChange }) {
  const [open, setOpen] = useState(true);

  const calculateMonthTotal = (month) =>
    Object.values(savingsData[month]).reduce((sum, val) => sum + parseFloat(val || 0), 0);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <span onClick={() => setOpen(!open)} style={{ cursor: "pointer", fontSize: "18px", color: "#94a3b8", userSelect: "none" }}>
          {open ? "⌃" : "⌄"}
        </span>
      </div>
      {open && (
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
                  <td style={{ fontWeight: 500, textAlign: "left", padding: "5px 10px" }}>{monthLabel(month)}</td>
                  {savingsCategories.map((cat) => (
                    <td key={cat}>
                      <input type="text" value={savingsData[month][cat]} onChange={(e) => handleChange(month, cat, e.target.value, "savings")} style={{ ...inputStyle, width: "80px" }} />
                    </td>
                  ))}
                  <td style={{ fontWeight: 600 }}>€{calculateMonthTotal(month).toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function InvestmentsTable({ title, monthSet, investmentsData, handleChange }) {
  const [open, setOpen] = useState(true);

  const calculateMonthTotal = (month) =>
    Object.values(investmentsData[month]).reduce((sum, val) => sum + parseFloat(val || 0), 0);

  const calculateCategoryTotal = (cat) =>
    monthSet.reduce((sum, month) => sum + parseFloat(investmentsData[month][cat] || 0), 0);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <span onClick={() => setOpen(!open)} style={{ cursor: "pointer", fontSize: "18px", color: "#94a3b8", userSelect: "none" }}>
          {open ? "⌃" : "⌄"}
        </span>
      </div>
      {open && (
        <div style={{ overflowX: "auto" }}>
          <table border="1" cellPadding="5" style={{ textAlign: "center", marginBottom: "30px", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Month</th>
                {investmentCategories.map((c) => <th key={c} style={thStyle}>{c}</th>)}
                <th style={thStyle}>Total</th>
              </tr>
            </thead>
            <tbody>
              {monthSet.map((month) => (
                <tr key={month}>
                  <td style={{ fontWeight: 500, textAlign: "left", padding: "5px 10px" }}>{monthLabel(month)}</td>
                  {investmentCategories.map((cat) => (
                    <td key={cat}>
                      <input type="text" value={investmentsData[month][cat]} onChange={(e) => handleChange(month, cat, e.target.value)} style={{ ...inputStyle, width: "80px" }} />
                    </td>
                  ))}
                  <td style={{ fontWeight: 600 }}>€{calculateMonthTotal(month).toFixed(0)}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: "bold", backgroundColor: "#f0f9ff" }}>
                <td style={{ textAlign: "left", padding: "5px 10px" }}>Total</td>
                {investmentCategories.map((cat) => (
                  <td key={cat}>€{calculateCategoryTotal(cat).toFixed(0)}</td>
                ))}
                <td>€{investmentCategories.reduce((sum, cat) => sum + calculateCategoryTotal(cat), 0).toFixed(0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function App() {
  const emptyExpenses = expenseMonths.reduce((acc, month) => {
    acc[month] = expenseCategories.reduce((c, cat) => { c[cat] = ""; return c; }, {});
    return acc;
  }, {});

  const emptySavings = savingsMonths.reduce((acc, month) => {
    acc[month] = savingsCategories.reduce((c, cat) => { c[cat] = ""; return c; }, {});
    return acc;
  }, {});

  const emptyInvestments = investMonths.reduce((acc, month) => {
    acc[month] = investmentCategories.reduce((c, cat) => { c[cat] = ""; return c; }, {});
    return acc;
  }, {});

  const [expensesData, setExpensesData] = useState(emptyExpenses);
  const [savingsData, setSavingsData] = useState(emptySavings);
  const [investmentsData, setInvestmentsData] = useState(emptyInvestments);
  const [status, setStatus] = useState("loading");

  const expensesRef = useRef(expensesData);
  const savingsRef = useRef(savingsData);
  const investmentsRef = useRef(investmentsData);
  const debounceTimer = useRef(null);

  useEffect(() => { expensesRef.current = expensesData; }, [expensesData]);
  useEffect(() => { savingsRef.current = savingsData; }, [savingsData]);
  useEffect(() => { investmentsRef.current = investmentsData; }, [investmentsData]);

  useEffect(() => {
    const loadData = async () => {
      const { data, error } = await supabase
        .from("finance_data")
        .select("data")
        .eq("id", "tracker")
        .single();

      if (error) { console.error("Error loading data:", error); setStatus("error"); return; }

      if (data?.data?.expenses && Object.keys(data.data.expenses).length > 0)
        setExpensesData({ ...emptyExpenses, ...data.data.expenses });
      if (data?.data?.savings && Object.keys(data.data.savings).length > 0)
        setSavingsData({ ...emptySavings, ...data.data.savings });
      if (data?.data?.investments && Object.keys(data.data.investments).length > 0)
        setInvestmentsData({ ...emptyInvestments, ...data.data.investments });

      setStatus("saved");
    };
    loadData();
  }, []);

  const saveData = useCallback(async (newExpenses, newSavings, newInvestments) => {
    const { error } = await supabase
      .from("finance_data")
      .upsert({ id: "tracker", data: { expenses: newExpenses, savings: newSavings, investments: newInvestments }, updated_at: new Date() });
    if (error) { console.error("Error saving:", error); setStatus("error"); }
    else setStatus("saved");
  }, []);

  const debouncedSave = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      saveData(expensesRef.current, savingsRef.current, investmentsRef.current);
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

  const handleInvestmentChange = (month, category, value) => {
    if (/^\d*\.?\d*$/.test(value)) {
      const updated = { ...investmentsData, [month]: { ...investmentsData[month], [category]: value } };
      setInvestmentsData(updated);
      setStatus("saving");
      debouncedSave();
    }
  };

  const calculateGrandTotal = (category) => {
    if (category === "Investing") {
      return investMonths.reduce((sum, month) =>
        sum + investmentCategories.reduce((s, cat) => s + parseFloat(investmentsData[month][cat] || 0), 0), 0
      );
    }
    const contributions = savingsMonths.reduce((sum, month) => sum + parseFloat(savingsData[month][category] || 0), 0);
    const multiplier = category === "Pension" ? 2 : 1;
    return historicalSavings[category] + contributions * multiplier;
  };

  const grandTotal = allGrandTotalCategories.reduce((sum, cat) => sum + calculateGrandTotal(cat), 0);

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "auto", fontFamily: "sans-serif" }}>
      <h1 style={{ margin: "0 0 20px 0" }}>Ryan's Finance Tracker 💰</h1>

      <h2>Expenses</h2>
      <ExpenseTable title="2024 (Jan – Dec)" monthSet={expenseYear0Months} expensesData={expensesData} handleChange={handleChange} />
      <ExpenseTable title="2025 (Jan – Dec)" monthSet={expenseYear1Months} expensesData={expensesData} handleChange={handleChange} />
      <ExpenseTable title="2026 (Jan – Apr)" monthSet={expenseYear2Months} expensesData={expensesData} handleChange={handleChange} />

      <h2>Savings</h2>
      <div style={{ display: "flex", gap: "40px", alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 400px", minWidth: 0 }}>
          <SavingsTable title="2025 (Jan – Dec)" monthSet={savingsYear1Months} savingsData={savingsData} handleChange={handleChange} />
          <SavingsTable title="2026 (Jan – Apr)" monthSet={savingsYear2Months} savingsData={savingsData} handleChange={handleChange} />
        </div>
        <div style={{ flex: "0 0 auto" }}>
          <h3 style={{ marginTop: 0 }}>Grand Totals</h3>
          <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {allGrandTotalCategories.map((c) => <th key={c} style={thStyle}>{c}</th>)}
                <th style={thStyle}>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ fontWeight: "bold", backgroundColor: "#f0f9ff" }}>
                {allGrandTotalCategories.map((cat) => (
                  <td key={cat} style={{ padding: "8px 10px", textAlign: "center" }}>
                    €{calculateGrandTotal(cat).toLocaleString()}
                  </td>
                ))}
                <td style={{ padding: "8px 10px", textAlign: "center" }}>€{grandTotal.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>Investments</h2>
      <InvestmentsTable title="2024 (Jan – Dec)" monthSet={investYear1Months} investmentsData={investmentsData} handleChange={handleInvestmentChange} />
      <InvestmentsTable title="2025 (Jan – Dec)" monthSet={investYear2Months} investmentsData={investmentsData} handleChange={handleInvestmentChange} />
      <InvestmentsTable title="2026 (Jan – Apr)" monthSet={investYear3Months} investmentsData={investmentsData} handleChange={handleInvestmentChange} />
    </div>
  );
}

export default App;