import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="footer text-center text-lg-start bg-light text-muted pt-1 mt-5">
      <section className="text-start">
        <Container className="mt-5">
          <Row className="mt-3">
            <Col className="col-12 col-md-5 col-lg-4 col-xl-5 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Обо мне</h6>
              <p>
                Меня зовут Егор Коробейников.
                <br />Я работаю в сфере кибербезопасности, увлекаюсь
                программированием и занимаюсь web разработкой. Сейчас заканчиваю
                факультет Fullstack JavaScript в GeekBrains. Работаю с
                фреймворками Angular, Vue, React. Знаю HTML&CSS, JavaScript,
                TypeScript, C/С++ (основы), Node.js, Webpack, Gulp, Parcel, ORM,
                Linux, Git. Изучаю Nest.js, Electron.js, ReactNative.
                <br />
                Буду рад сотрудничеству!
              </p>
            </Col>
            <Col className="col-12 col-md-3 col-lg-3 col-xl-3 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Мои проекты</h6>
              <p>
                <a
                  href="https://fund-dm.ru"
                  target="_blank"
                  className="text-reset"
                >
                  Благотворительный Фонд «Друзья Милосердия»
                </a>
              </p>
              <p>
                <a
                  href="https://obshee-delo72.ru"
                  target="_blank"
                  className="text-reset"
                >
                  ЦОД ТО «Общее дело»
                </a>
              </p>
              <p>
                <a
                  href="https://miloserdie-72.ru"
                  target="_blank"
                  className="text-reset"
                >
                  ПРО «Общество Милосердия»
                </a>
              </p>
              <p>
                <a
                  href="https://odnodum.ru"
                  target="_blank"
                  className="text-reset"
                >
                  ОДНОДУМ.RU
                </a>
              </p>
            </Col>
            <Col className="col-12 col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Мои контакты</h6>
              <p>
                <i className="fas fa-home me-2"></i>г.&nbsp;Тюмень
              </p>
              <p>
                <i className="fas fa-envelope me-2"></i>egorlo059@gmail.com
              </p>
            </Col>
          </Row>
        </Container>
      </section>
      <div
        className="text-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
      >
        Для сотрудничества пишите на почту: &nbsp;
        <a href="mailto:egorlo059@gmail.com?subject=Письмо от&amp;body=Здравствуйте,">
          egorlo059@gmail.com
        </a>
      </div>
    </footer>
  );
}
