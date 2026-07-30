import { useCallback, useState } from "react";
import {
  OpenID4VPVerification,
  getSameOriginVerifyUrl,
  type AppError,
  type VerificationResults,
} from "./sdk";
import { faydaPidPd } from "./pd";

/** Platform RP DID from FaydaPass onboarding. */
const CLIENT_ID = "did:web:verify.pass.fayda.et:v1:verify";

export default function App() {
  const [step, setStep] = useState<"idle" | "done" | "error">("idle");
  const [results, setResults] = useState<VerificationResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState(0);

  const reset = useCallback(() => {
    setStep("idle");
    setResults(null);
    setError(null);
    setSession((n) => n + 1);
  }, []);

  return (
    <div className="page">
      <header className="header">
        <span className="logo">Mock Verifier Portal</span>
        <span className="badge">Partner demo</span>
      </header>

      <main className="card">
        <h1>Verify your identity</h1>
        <p className="subtitle">
          This is how a partner app integrates{" "}
          <code>@faydapass/react-verify-sdk</code>. Scan the QR with your
          FaydaPass wallet to share <strong>FaydaCrendential</strong>.
        </p>

        {step === "idle" && (
          <div className="verify-box" key={session}>
            <OpenID4VPVerification
              verifyServiceUrl={getSameOriginVerifyUrl()}
              clientId={CLIENT_ID}
              presentationDefinition={faydaPidPd}
              summariseResults={false}
              vpVerificationRequest={{ includeClaims: false }}
              qrCodeStyles={{
                size: 220,
                level: "M",
                fgColor: "#0f3d2e",
              }}
              triggerElement={
                <button type="button" className="primary">
                  Show verification QR
                </button>
              }
              onVPProcessed={(r) => {
                setResults(r);
                setError(null);
                setStep("done");
              }}
              onQrCodeExpired={() => {
                setError("QR expired. Generate a new one.");
                setStep("error"); 
              }}
              onError={(e: AppError) => {
                setError(
                  e.errorMessage || e.errorCode || "Verification failed"
                );
                setStep("error");
              }}
            />
          </div>
        )}

        {step === "error" && error && (
          <div className="result error">
            <p>{error}</p>
            <button type="button" className="primary" onClick={reset}>
              Try again
            </button>
          </div>
        )}

        {step === "done" && results && (
          <div className="result success">
            <h2>Verified</h2>
            <p className="ok">Wallet submitted credentials successfully.</p>
            <pre>{JSON.stringify(results, null, 2)}</pre>
            <button type="button" className="secondary" onClick={reset}>
              Verify again
            </button>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>
          <strong>Onboard these origins</strong> on the FaydaPass Verify partner
          client:
        </p>
        <ul>
          <li>
            <code>http://localhost:5180</code>
          </li>
          <li>
            <code>http://127.0.0.1:5180</code>
          </li>
        </ul>
        <p className="muted">
          Proxy: <code>/v2/verify</code> · clientId:{" "}
          <code>{CLIENT_ID}</code>
        </p>
      </footer>
    </div>
  );
}
