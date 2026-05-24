import SetupGate from "./SetupGate";
import SetupPageContent from "./SetupPageContent";

export default function AdminSetup() {
  return (
    <SetupGate>
      <SetupPageContent />
    </SetupGate>
  );
}
