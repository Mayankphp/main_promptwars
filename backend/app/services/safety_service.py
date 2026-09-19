import re
from typing import List, Tuple, Dict, Any
from app.schemas.analysis import RedFlag

# Known fraud signals commonly targeting senior citizens
SCAM_PATTERNS = [
    {
        "id": "disconnection_threat",
        "pattern": re.compile(r"(?i)(electricity|power|bill|line|connection)\s*(will be|is)\s*(cut|disconnected|terminated|interrupted)\s*(tonight|today|by|at)", re.I),
        "flag": "Urgent Threat of Service Disconnection",
        "why_risky": "Genuine electricity boards never threaten immediate disconnection via SMS without written advance notice. Scammers use panic to force quick payments to personal UPI numbers.",
        "severity": "high",
        "safe_action": "Do NOT call the phone number in the SMS. Check your physical electricity bill or call the official government electricity helpline (e.g. 1912 in India)."
    },
    {
        "id": "fake_kyc_pan",
        "pattern": re.compile(r"(?i)(kyc|pan|aadhaar|debit card|netbanking)\s*(blocked|suspended|deactivated|expire|pending|update)", re.I),
        "flag": "Urgent Bank Account / KYC Suspension Claim",
        "why_risky": "Banks will never suspend your account immediately via SMS link. Scammers create fake login pages to steal your user ID and password.",
        "severity": "high",
        "safe_action": "Never click web links in SMS messages. Visit your local bank branch in person or use only the official bank app installed from the verified App Store."
    },
    {
        "id": "otp_request",
        "pattern": re.compile(r"(?i)(share|send|provide|tell|verify)\s*(your)?\s*(otp|one time password|pin|cvv|code)", re.I),
        "flag": "Request to Share OTP or PIN",
        "why_risky": "NO legitimate bank, government department, or company will EVER ask you to share your OTP or PIN over phone or message.",
        "severity": "high",
        "safe_action": "NEVER share your OTP with anyone, even if they claim to be a bank manager, police officer, or telecom executive."
    },
    {
        "id": "lottery_prize",
        "pattern": re.compile(r"(?i)(lottery|won|cashback|prize|reward|congratulations|kbc|lucky draw)\s*(worth|of)?\s*(rs|inr|₹|\$|\d)", re.I),
        "flag": "Unsolicited Prize or Lottery Claim",
        "why_risky": "If you did not buy a ticket or enter a contest, you cannot win. Fraudsters ask for an 'advance processing fee' or tax payment and steal your money.",
        "severity": "high",
        "safe_action": "Delete the message immediately. Real lotteries do not ask for advance fees."
    },
    {
        "id": "apk_remote_access",
        "pattern": re.compile(r"(?i)(install|download|apk|anydesk|teamviewer|quicksupport|rustdesk)", re.I),
        "flag": "Request to Install File or Screen Sharing App",
        "why_risky": "Installing unknown APK files or screen-sharing tools gives fraudsters complete control over your mobile phone and your banking apps.",
        "severity": "high",
        "safe_action": "Never install unknown apps or APK files suggested by strangers. If unsure, ask a trusted family member first."
    },
    {
        "id": "suspicious_links",
        "pattern": re.compile(r"(https?://)?(bit\.ly|tinyurl\.com|t\.co|wa\.me|is\.gd|goo\.gl|[\w\-]+\.(xyz|top|site|club|live|info|cc))", re.I),
        "flag": "Suspicious Shortened or Unofficial Web Link",
        "why_risky": "Shortened or non-standard website links disguise fake phishing sites designed to look like real government or bank websites.",
        "severity": "high",
        "safe_action": "Do not click any shortened or unfamiliar links. Always type official website addresses manually."
    }
]

def analyze_safety_heuristics(text: str) -> Tuple[str, List[RedFlag], List[str]]:
    """
    Evaluate text against high-confidence fraud heuristics.
    Returns (risk_level, red_flags, safe_next_steps).
    """
    flags: List[RedFlag] = []
    safe_steps: List[str] = []

    for rule in SCAM_PATTERNS:
        if rule["pattern"].search(text):
            flags.append(RedFlag(
                flag=rule["flag"],
                why_risky=rule["why_risky"],
                severity=rule["severity"]
            ))
            safe_steps.append(rule["safe_action"])

    if len(flags) >= 2 or any(f.severity == "high" for f in flags):
        risk_level = "high_risk"
    elif len(flags) == 1:
        risk_level = "caution"
    else:
        risk_level = "safe"

    # Always ensure at least default safe steps
    if not safe_steps:
        safe_steps = [
            "Verify with the official sender through their published customer support number.",
            "If in doubt, show this to a trusted family member before taking action.",
            "Remember: Never share OTPs, passwords, or bank details with anyone."
        ]

    return risk_level, flags, safe_steps
