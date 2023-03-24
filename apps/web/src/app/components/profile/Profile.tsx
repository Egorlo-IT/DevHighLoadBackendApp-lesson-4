import { FormEvent, useContext, useState } from 'react';
import Modal from 'react-modal';
import { Container } from 'react-bootstrap';
import { AppContext } from '../../context/Context';
import { Action, Colors, CustomStyles } from '../../utils/Utils';
import { RegisterUserForm } from '../interfaces/Intefaces';
import { environment } from 'apps/web/src/environments/environment';

export default function Profile() {
  const context = useContext(AppContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [customStyles] = useState(CustomStyles);
  const [firstName, setFirstName] = useState(context.user.firstName);
  const [lastName, setLastName] = useState(context.user.lastName);
  const [email, setEmail] = useState(context.user.email);

  function openModal(Action: { mess: string; color: string }, error?: string) {
    customStyles.content.backgroundColor = Action.color;
    setMessage(Action.mess + (error !== '' ? error : ''));
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleSubmit = (event: FormEvent<RegisterUserForm>) => {
    event.preventDefault();
    const target = event.currentTarget.elements;
    const firstName = target.firstName.value;
    const lastName = target.lastName.value;
    const email = target.email.value;
    const password = target.password.value;
    const passwordRepeat = target.passwordRepeat.value;
    const avatar = target.avatar.value;
    const avatarFiles: FileList | null = target.avatar.files;
    let avatarFilesTaget = '';
    [].forEach.call(avatarFiles, (file) => {
      avatarFilesTaget = file;
    });

    if (
      firstName !== '' &&
      lastName !== '' &&
      email !== '' &&
      password !== '' &&
      passwordRepeat !== ''
    ) {
      if (password !== passwordRepeat) {
        openModal(Action.ERROR, 'Пароли не совпадают!');
      } else {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + context.accessToken);

        const formdata = new FormData();
        formdata.append('firstName', firstName);
        formdata.append('lastName', lastName);
        formdata.append('email', email);
        formdata.append('password', password);
        formdata.append('role', context.user.roles);

        if (avatarFilesTaget) {
          formdata.append(
            'avatar',
            avatarFilesTaget,
            `${environment.apiUrl}/user-static/` + avatar
          );
        }

        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: formdata,
        };

        fetch(`${environment.apiUrl}/api/profile/edit`, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            const data = JSON.parse(result);
            if (data && data?.statusCode !== 401) {
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
                  if (data?.access_token) {
                    localStorage.setItem('accessToken', data.access_token);
                    context.setAccessToken(data.access_token);

                    const myHeaders = new Headers();
                    myHeaders.append(
                      'Authorization',
                      'Bearer ' + data.access_token
                    );
                    const requestOptions = {
                      method: 'GET',
                      headers: myHeaders,
                    };
                    fetch(`${environment.apiUrl}/api/auth/user`, requestOptions)
                      .then((response) => response.text())
                      .then((result) => {
                        const data = JSON.parse(result);
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
                          'Вы успешно отредактировали свой профиль!'
                        );
                      })
                      .catch((error) => console.log('error', error));
                  }
                })
                .catch((error) => console.log('error', error));
            } else {
              if (Array.isArray(data?.message)) {
                let error = '';
                data.message.forEach((item: string) => {
                  error += item + '; ';
                });
                error =
                  'При сохранении профиля пользователя возникли следующие ошибки: ' +
                  error;
                openModal(Action.ERROR, error);
              }
            }
          })
          .catch((error) => {
            console.log('error', error);
          });
      }
    } else {
      openModal(
        Action.ERROR,
        'В форме профиля пользователя все поля обязательны для заполнения'
      );
    }
  };

  return (
    <main className="Profile">
      <Container>
        <Modal
          style={customStyles}
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
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
        <h2 className="text-uppercase text-center mb-5">
          Профиль пользователя
        </h2>

        <div className="card text-center mt-3">
          {context.user.avatar ? (
            <img
              style={{ objectFit: 'cover' }}
              src={environment.apiUrl + context.user.avatar}
              className="bi d-block mx-auto mb-1 mt-3 rounded-circle"
              width="150"
              height="150"
              alt="avatar"
            />
          ) : (
            <svg
              className="bi d-block mx-auto mb-1"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
              />
            </svg>
          )}

          <div className="card-body mx-auto">
            <div className="card-body mx-auto">
              <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
                <div className="input-group mb-2 align-items-center">
                  <i className="far fa-image fa-lg me-3 fa-fw"></i>
                  <input className="form-control" type="file" id="avatar" />
                </div>
                <div className="d-flex flex-row align-items-center mb-1">
                  <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                  <div className="form-outline flex-fill mb-0">
                    <input
                      type="text"
                      id="firstName"
                      className="form-control"
                      placeholder="Введите Ваше Имя"
                      value={firstName}
                      onChange={(e: FormEvent<HTMLInputElement>) => {
                        setFirstName(e.currentTarget.value);
                      }}
                    />
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-4">
                  <i className="fa-lg me-3 fa-fw"></i>
                  <div className="form-outline flex-fill mb-0">
                    <input
                      type="text"
                      id="lastName"
                      className="form-control"
                      placeholder="Введите Вашу Фамилию"
                      value={lastName}
                      onChange={(e: FormEvent<HTMLInputElement>) => {
                        setLastName(e.currentTarget.value);
                      }}
                    />
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-4">
                  <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                  <div className="form-outline flex-fill mb-0">
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      placeholder="Введите Ваш Email"
                      value={email}
                      onChange={(e: FormEvent<HTMLInputElement>) => {
                        setEmail(e.currentTarget.value);
                      }}
                    />
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-4">
                  <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                  <div className="form-outline flex-fill mb-0">
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      placeholder="Введите Ваш пароль"
                    />
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-4">
                  <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                  <div className="form-outline flex-fill mb-0">
                    <input
                      type="password"
                      id="passwordRepeat"
                      className="form-control"
                      placeholder="Повторите Ваш пароль"
                    />
                  </div>
                </div>
                <button id="btnEditProfile" className="btn btn-dark mb-3">
                  Сохранить
                </button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
