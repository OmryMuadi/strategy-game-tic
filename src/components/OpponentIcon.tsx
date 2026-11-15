export function OpponentIcon({ solo }: { solo: boolean }) {
  return <span className="opponent-icon" data-kind={solo ? 'bot' : 'players'} aria-hidden="true" />;
}
