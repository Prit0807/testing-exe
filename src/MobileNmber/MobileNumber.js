import React, { useMemo, useState } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { getApiBase } from "../utils/apiBase";

const COUNTRIES = [
  { code: "IN", name: "India (+91)" },
  { code: "US", name: "United States (+1)" },
  { code: "GB", name: "United Kingdom (+44)" },
  { code: "CA", name: "Canada (+1)" },
  { code: "AU", name: "Australia (+61)" },
  { code: "SG", name: "Singapore (+65)" },
  { code: "AE", name: "United Arab Emirates (+971)" },
];

const PLACEHOLDERS = {
  IN: "91234 56789",
  US: "(201) 555-0123",
  GB: "07400 123456",
  CA: "(204) 234-5678",
  AU: "0412 345 678",
  SG: "8123 4567",
  AE: "050 123 4567",
};

function MobileNumberPage() {
  const [country, setCountry] = useState("IN");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const phone = useMemo(() => {
    try {
      return parsePhoneNumberFromString(input, country) || null;
    } catch {
      return null;
    }
  }, [input, country]);

  const isValid = !!phone && phone.isValid();

  const handleInput = (e) => {
    const raw = e.target.value.replace(/[^\d+]/g, "");
    const cleaned = raw.startsWith("+")
      ? "+" + raw.slice(1).replace(/[+]/g, "")
      : raw.replace(/[+]/g, "");
    setInput(cleaned);
    setError("");
  };

  const handleBlur = () => {
    if (!input.trim()) {
      setError("Mobile number is required.");
      return;
    }
    if (!isValid) {
      setError("Enter a valid mobile number for the selected country.");
      return;
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    console.log('onpress ');
    
    e.preventDefault();
    if (!isValid) {
      setError("Enter a valid mobile number before submitting.");
      return;
    }
    setError("");

    try {
      // const base = (process.env.REACT_APP_API_BASE || "").replace(/\/+$/, "");
      // console.log('bbbbbbbbbb',base);
      // console.log('phone.number',phone.number);
      
      
if(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ){
  const base = getApiBase();
  const res = await fetch(`${base}/api/phone`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: phone.number }),
  });
        console.log('rrrrrrrrrrrr',res);
        
        const data = await res.json();
        console.log('data',data);
        
        if (!res.ok || !data.ok) throw new Error("Failed to save");
}else{
  const base = getApiBase();
  const res = await fetch(`${base}/phone`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: phone.number }),
  });
        console.log('rrrrrrrrrrrr',res);
        
        const data = await res.json();
        console.log('data',data);
        
        if (!res.ok || !data.success) throw new Error("Failed to save");
}


      alert(`${phone.number} is updated successfully`);
    } catch (err) {
      console.error("Failed to save number:", err);
      setError("Could not save. Check network/API.");
    }
  };

  const placeholder = PLACEHOLDERS[country] || "Enter mobile number";

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card} noValidate>
        <h2 style={styles.title}>Update mobile number</h2>

        <label style={styles.label} htmlFor="country">
          Country
        </label>
        <select
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={styles.select}
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>

        <label style={styles.label} htmlFor="phone">
          Mobile number
        </label>
        <div style={styles.inputRow}>
          <input
            id="phone"
            type="tel"
            value={input}
            onChange={handleInput}
            onBlur={handleBlur}
            placeholder={placeholder}
            autoComplete="tel"
            inputMode="tel"
            style={{
              ...styles.input,
              borderColor: error ? "#e11d48" : isValid && input ? "#16a34a" : "#e5e7eb",
            }}
          />
          {isValid && input ? <span style={styles.validBadge}>✓</span> : null}
        </div>

        {error ? <div style={styles.error}>{error}</div> : null}

        <button type="submit" disabled={!isValid} style={styles.button(isValid)} onClick={handleSubmit}>
          Update
        </button>

      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8fafc",
    padding: "clamp(12px, 3vw, 24px)",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    minWidth: "280px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "clamp(8px, 2vw, 12px)",
    padding: "clamp(16px, 4vw, 20px)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  title: {
    margin: "0 0 clamp(12px, 3vw, 16px) 0",
    fontSize: "clamp(18px, 4.5vw, 20px)",
    fontWeight: 600,
    color: "#111827",
    lineHeight: "1.3",
  },
  label: {
    display: "block",
    marginTop: "clamp(8px, 2vw, 10px)",
    marginBottom: "clamp(4px, 1.5vw, 6px)",
    fontSize: "clamp(13px, 3.5vw, 14px)",
    fontWeight: 600,
    color: "#374151",
  },
  select: {
    width: "100%",
    padding: "clamp(8px, 2.5vw, 10px) clamp(10px, 3vw, 12px)",
    borderRadius: "clamp(6px, 1.5vw, 8px)",
    border: "1px solid #e5e7eb",
    background: "#fff",
    fontSize: "clamp(14px, 4vw, 16px)",
    outline: "none",
    boxSizing: "border-box",
    WebkitAppearance: "none",
    appearance: "none",
    cursor: "pointer",
  },
  inputRow: {
    position: "relative",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: "clamp(8px, 2.5vw, 10px) clamp(10px, 3vw, 12px)",
    paddingRight: "clamp(36px, 9vw, 40px)",
    borderRadius: "clamp(6px, 1.5vw, 8px)",
    border: "1px solid #e5e7eb",
    fontSize: "clamp(16px, 4vw, 18px)",
    outline: "none",
    boxSizing: "border-box",
    WebkitAppearance: "none",
    appearance: "none",
  },
  validBadge: {
    position: "absolute",
    right: "clamp(8px, 2.5vw, 10px)",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#16a34a",
    fontSize: "clamp(16px, 4vw, 18px)",
    pointerEvents: "none",
  },
  error: {
    marginTop: "clamp(6px, 1.5vw, 8px)",
    color: "#e11d48",
    fontSize: "clamp(12px, 3vw, 13px)",
    lineHeight: "1.4",
    wordBreak: "break-word",
  },
  button: (enabled) => ({
    width: "100%",
    marginTop: "clamp(12px, 3vw, 16px)",
    padding: "clamp(10px, 2.5vw, 12px)",
    borderRadius: "clamp(6px, 1.5vw, 8px)",
    border: "none",
    background: enabled ? "#2563eb" : "#93c5fd",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: "clamp(15px, 3.5vw, 16px)",
    cursor: enabled ? "pointer" : "not-allowed",
    transition: "background 0.2s ease",
    WebkitTapHighlightColor: "transparent",
    touchAction: "manipulation",
  }),
  note: {
    marginTop: "clamp(10px, 2.5vw, 12px)",
    fontSize: "clamp(12px, 3vw, 13px)",
    color: "#374151",
    wordBreak: "break-word",
    lineHeight: "1.4",
  },
};

export default MobileNumberPage;