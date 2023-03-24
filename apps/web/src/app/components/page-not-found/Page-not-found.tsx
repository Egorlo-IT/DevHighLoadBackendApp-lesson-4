import { Container } from 'react-bootstrap';
import img404 from '../../../assets/image/404.jpg';
import './Page-not-found.scss';

export default function PageNotFound() {
  return (
    <main className="main">
      <Container className="text-center">
        <img style={{ maxWidth: '100%' }} src={img404} alt="Error404" />
      </Container>
    </main>
  );
}
