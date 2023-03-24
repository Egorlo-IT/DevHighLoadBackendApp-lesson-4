import { FormEvent, useContext, useState } from 'react';
import Modal from 'react-modal';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/Context';
import { Action, Colors, CustomStyles } from '../../utils/Utils';
import { LoginUserForm } from '../interfaces/Intefaces';
import { environment } from 'apps/web/src/environments/environment';

export default function Login() {
  const context = useContext(AppContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [customStyles] = useState(CustomStyles);

  const openModal = (
    Action: { mess: string; color: string },
    error?: string
  ) => {
    customStyles.content.backgroundColor = Action.color;
    setMessage(Action.mess + (error !== '' ? error : ''));
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<LoginUserForm>) => {
    event.preventDefault();
    const target = event.currentTarget.elements;
    const email = target.email.value;
    const password = target.password.value;

    if (email !== '' && password !== '') {
      const raw = JSON.stringify({
        username: email,
        password: password,
      });
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
      };
      fetch(`${environment.apiUrl}/api/auth/login`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const data = JSON.parse(result);
          if (data?.access_token || data?.statusCode !== 401) {
            localStorage.setItem('accessToken', data.access_token);
            context.setAccessToken(data.access_token);

            const myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + data.access_token);
            const requestOptions = {
              method: 'GET',
              headers: myHeaders,
            };
            fetch(`${environment.apiUrl}/api/auth/user`, requestOptions)
              .then((response) => response.text())
              .then((result) => {
                if (result) {
                  const data = JSON.parse(result);
                  if (data && !data?.error) {
                    const dataTarget = JSON.stringify({
                      id: data.id,
                      firstName: data.firstName,
                      lastName: data.lastName,
                      email: data.email,
                      avatar: data.avatar,
                      exp: data.exp,
                      roles: data.roles,
                    });

                    localStorage.setItem('user', dataTarget);
                    context.setUser(JSON.parse(dataTarget));
                    context.setAuthenticated(true);
                    openModal(
                      Action.SUCCESS,
                      'Вы успешно авторизовались на сайте!'
                    );
                    setTimeout(() => {
                      navigate('/');
                    }, 2000);
                  } else {
                    if (Array.isArray(data?.message)) {
                      let error = '';
                      data.message.forEach((item: string) => {
                        error += item + '; ';
                      });
                      error =
                        'При авторизации пользователя возникли следующие ошибки: ' +
                        error;
                      openModal(Action.ERROR, error);
                    }
                  }
                } else {
                  if (data && data?.error) {
                    if (Array.isArray(data?.message)) {
                      let error = '';
                      data.message.forEach((item: string) => {
                        error += item + '; ';
                      });
                      error =
                        'При авторизации пользователя возникли следующие ошибки: ' +
                        error;
                      openModal(Action.ERROR, error);
                    }
                  }
                }
              })
              .catch((error) => console.log('error', error));
          } else {
            openModal(
              Action.ERROR,
              'Ошибка авторизации. Введите правильный логин и пароль!'
            );
          }
        })
        .catch((error) => console.log('error', error));
    } else {
      openModal(
        Action.ERROR,
        'В форме авторизации все поля обязательны для заполнения!'
      );
    }
  };

  return (
    <Container className="h-custom">
      <Modal
        style={customStyles}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Login Modal"
      >
        <h5
          className="m-0 p-4"
          style={{
            cursor: 'none',
            color: Colors.BLACK,
            fontWeight: '300',
          }}
        >
          {message}
        </h5>
        <i
          className="fa-solid fa-xmark me-2 text-end mt-2 fixed-top"
          onClick={closeModal}
          role="button"
        ></i>
      </Modal>
      <div className="row d-flex justify-content-center align-items-center h-60">
        <div className="col-md-9 col-lg-6 col-xl-5">
          <img
            src={
              'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp'
            }
            className="img-fluid"
            alt="Sample pic"
          />
        </div>
        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
          <form onSubmit={handleSubmit}>
            <div className="divider d-flex align-items-center my-4"></div>

            <div className="form-outline mb-4">
              <input
                type="email"
                id="email"
                className="form-control form-control-lg"
                placeholder="Введите Email"
              />
            </div>

            <div className="form-outline mb-3">
              <input
                type="password"
                id="password"
                className="form-control form-control-lg"
                placeholder="Введите пароль"
              />
            </div>

            <div className="text-center text-lg-start mt-4 pt-2">
              <button
                id="btnLogin"
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              >
                Войти
              </button>
              <p className="small fw-bold mt-2 pt-1 mb-0">
                У Вас нет аккаунта?
                <Link to="/register" className="link-danger ms-1">
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
}
