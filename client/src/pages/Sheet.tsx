import { useParams } from 'react-router-dom';

const Sheet: React.FC = () => {
  const { publisher, sheet } = useParams<{ publisher: string; sheet: string }>();

  return (
    <div>
      <h1>Sheet Page</h1>
      <p>Username: {publisher}</p>
      <p>Sheet Name: {sheet}</p>
    </div>
  );
}

export default Sheet;