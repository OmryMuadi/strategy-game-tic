import { useNavigate } from 'react-router';

export function HomeButton({ label }: { label: string }) {
  const navigate = useNavigate();

  return (
    <button className="secondary home-button" type="button" onClick={() => navigate('/')}>
      {label}
    </button>
  );
}
