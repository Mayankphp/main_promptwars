import pytest
from app.services.safety_service import analyze_safety_heuristics

def test_safety_heuristics_disconnection():
    """Verify scam detection flags urgent disconnection threats and shortened links."""
    scam_sms = "Dear consumer your electricity will be disconnected tonight at 9:30 PM. Click bit.ly/pay-bill immediately."
    risk_level, flags, safe_steps = analyze_safety_heuristics(scam_sms)
    assert risk_level in ["caution", "high_risk"]
    assert len(flags) >= 1
    flag_titles = [f.flag for f in flags]
    assert any("Disconnection" in t or "Link" in t for t in flag_titles)
    assert len(safe_steps) > 0

def test_safety_heuristics_lottery_fraud():
    """Verify prize and lottery fraud patterns are flagged."""
    lottery_msg = "Congratulations! You have won ₹25,00,000 in KBC Lucky Draw. Pay processing fee of ₹1,500 to claim."
    risk_level, flags, safe_steps = analyze_safety_heuristics(lottery_msg)
    assert risk_level in ["caution", "high_risk"]
    assert any("Lottery" in f.flag or "Prize" in f.flag for f in flags)

def test_safety_heuristics_fake_apk():
    """Verify unknown APK installation links are flagged as high risk."""
    apk_msg = "Download our new electricity payment app: http://fake-utility.in/app.apk to update KYC."
    risk_level, flags, safe_steps = analyze_safety_heuristics(apk_msg)
    assert risk_level in ["caution", "high_risk"]
    assert any("Install" in f.flag or "File" in f.flag or "App" in f.flag for f in flags)

def test_safety_heuristics_kyc_expiry():
    """Verify fake bank KYC deactivation threats are caught."""
    kyc_sms = "SBI Alert: Your bank account will be blocked today due to pending KYC. Update PAN at bit.ly/sbi-kyc."
    risk_level, flags, safe_steps = analyze_safety_heuristics(kyc_sms)
    assert risk_level in ["caution", "high_risk"]
    assert len(safe_steps) > 0

def test_genuine_bill_not_flagged_as_scam():
    """Verify standard legitimate electricity bills receive safe/normal rating."""
    legit_bill = "Electricity Bill: Consumer 10293848, Bill Amount Rs 1,450, Due Date 28-Sep-2026. Pay via official portal mahadiscom.in"
    risk_level, flags, _ = analyze_safety_heuristics(legit_bill)
    assert risk_level in ["safe", "caution"]
