import React, { useState, useEffect } from "react";
import "./PasswordStrengthChecker.css";

const PasswordStrengthChecker = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [score, setScore] = useState(0);
  const [strength, setStrength] = useState({
    level: "",
    class: "",
    width: "0%",
  });
  const [criteria, setCriteria] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    numbers: false,
    symbols: false,
    noCommon: false,
  });
  const [suggestions, setSuggestions] = useState([]);

  const commonPasswords = [
    "password", "123456", "123456789", "qwerty", "abc123",
    "password123", "admin", "letmein", "welcome", "monkey",
    "1234567890", "dragon", "master", "login", "passw0rd",
    "football", "baseball", "superman"
  ];

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let generated = "";
    for (let i = 0; i < 15; i++) {
      generated += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(generated);
  };

  useEffect(() => {
    checkPasswordStrength(password);
  }, [password]);

  const checkPasswordStrength = (pwd) => {
    if (!pwd) {
      setStrength({
        level: "",
        class: "",
        width: "0%",
      });
      setScore(0);
      setCriteria({
        length: false,
        lowercase: false,
        uppercase: false,
        numbers: false,
        symbols: false,
        noCommon: false,
      });
      setSuggestions([]);
      return;
    }

    const newCriteria = {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      numbers: /\d/.test(pwd),
      symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
      noCommon: pwd && !commonPasswords.includes(pwd.toLowerCase()),
    };
    setCriteria(newCriteria);

    let newScore = 0;
    Object.values(newCriteria).forEach(met => {
      if (met) newScore += 10;
    });

    // Updated length bonuses:
    if (pwd.length >= 10) newScore += 10;
    if (pwd.length >= 15) newScore += 15;

    const uniqueChars = new Set(pwd).size;
    if (uniqueChars >= 8) newScore += 5;
    if (uniqueChars >= 12) newScore += 5;

    if (/(.)\1{2,}/.test(pwd)) newScore -= 10;
    if (/123|abc|qwe/i.test(pwd)) newScore -= 15;

    newScore = Math.max(0, Math.min(100, newScore));
    setScore(newScore);

    const strengthLevels = [
      { min: 0, max: 20, level: "Very Weak", class: "very-weak", width: "15%" },
      { min: 20, max: 40, level: "Weak", class: "weak", width: "30%" },
      { min: 40, max: 60, level: "Fair", class: "fair", width: "50%" },
      { min: 60, max: 80, level: "Good", class: "good", width: "70%" },
      { min: 80, max: 95, level: "Strong", class: "strong", width: "85%" },
      { min: 95, max: 101, level: "Very Strong", class: "very-strong", width: "100%" },
    ];
    const current = strengthLevels.find(s => newScore < s.max);
    setStrength(current || strengthLevels[0]);

    const newSuggestions = [];
    if (!newCriteria.length) newSuggestions.push("Use at least 8 characters");
    if (!newCriteria.lowercase) newSuggestions.push("Add lowercase letters");
    if (!newCriteria.uppercase) newSuggestions.push("Add uppercase letters");
    if (!newCriteria.numbers) newSuggestions.push("Include numbers");
    if (!newCriteria.symbols) newSuggestions.push("Add special characters (!@#$%...)");
    if (!newCriteria.noCommon) newSuggestions.push("Avoid common passwords");
    if (pwd.length < 12) newSuggestions.push("Consider using 10+ characters for better security");
    if (/(.)\1{2,}/.test(pwd)) newSuggestions.push("Avoid repeating characters");
    if (/123|abc|qwe/i.test(pwd)) newSuggestions.push("Avoid sequential patterns");

    setSuggestions(newSuggestions);
  };

  return (
    <div className="password-checker-container">
      <h1>🔐 Password Strength Checker</h1>

      <div className="input-group">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handleChange}
          placeholder="Enter your password..."
        />
        <button className="toggle-btn" onClick={toggleShowPassword}>
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

      <button className="generate-button" onClick={generatePassword}>
        🎲 Generate Strong Password
      </button>

      <div className="strength-meter">
        <div className="strength-bar">
          <div
            className={`strength-fill ${strength.class}`}
            style={{ width: strength.width }}
          />
        </div>
        <div className={`strength-label ${strength.class}`}>{strength.level}</div>
      </div>

      <div className="criteria">
        {Object.entries(criteria).map(([key, met]) => (
          <div key={key} className={`criterion ${met ? "met" : ""}`}>
            <span className="criterion-icon">{met ? "✅" : "❌"}</span>
            <span>
              {{
                length: "At least 8 characters long",
                lowercase: "Contains lowercase letters",
                uppercase: "Contains uppercase letters",
                numbers: "Contains numbers",
                symbols: "Contains special characters (!@#$%...)",
                noCommon: "Not a common password",
              }[key]}
            </span>
          </div>
        ))}
      </div>

      <div className="score-section">
        <div className="score">{score}</div>
        <div>Security Score</div>
      </div>

      {suggestions.length > 0 && (
        <div className="suggestions">
          <h3>💡 Suggestions to improve your password:</h3>
          <ul>
            {suggestions.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthChecker;
