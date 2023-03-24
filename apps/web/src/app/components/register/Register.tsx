import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { Container } from 'react-bootstrap';
import { FormEvent, useState } from 'react';
import { Action, Colors, CustomStyles } from '../../utils/Utils';
import { RegisterUserForm } from '../interfaces/Intefaces';
import { environment } from 'apps/web/src/environments/environment';

Modal.setAppElement('#root');

export default function Register() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [customStyles] = useState(CustomStyles);

  function openModal(Action: { mess: string; color: string }, error?: string) {
    customStyles.content.backgroundColor = Action.color;
    setMessage(Action.mess + (error !== '' ? error : ''));
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const navigate = useNavigate();

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
      passwordRepeat !== '' &&
      avatar !== ''
    ) {
      if (password !== passwordRepeat) {
        openModal(Action.ERROR, 'Пароли не совпадают!');
      } else {
        const formdata = new FormData();
        formdata.append('firstName', firstName);
        formdata.append('lastName', lastName);
        formdata.append('email', email);
        formdata.append('password', password);
        formdata.append('role', 'user');
        formdata.append(
          'avatar',
          avatarFilesTaget,
          `${environment.apiUrl}/user-static/` + avatar
        );
        const requestOptions = {
          method: 'POST',
          body: formdata,
        };
        const url = `${environment.apiUrl}/api/users/create`;
        fetch(url, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            const data = JSON.parse(result);
            if (data && !data?.error) {
              openModal(
                Action.SUCCESS,
                'Вы успешно зарегестрировались на сайте. Пожалуйста авторизутесь под своим логином и паролем.'
              );
              setTimeout(() => {
                navigate('/login');
              }, 3000);
            } else {
              if (Array.isArray(data?.message)) {
                let error = '';
                data.message.forEach((item: string) => {
                  console.log(item);
                  error += item + '; ';
                });
                error =
                  'При регистрации пользователя обнаружены следующие ошибки: ' +
                  error;
                openModal(Action.ERROR, error);
              }
            }
          })
          .catch((error) => console.log('error', error));
      }
    } else {
      openModal(
        Action.ERROR,
        'В форме регистрации все поля обязательны для заполнения'
      );
    }
  };

  return (
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

      <section className="h-70" style={{ backgroundColor: Colors.GRAY }}>
        <div className="row d-flex justify-content-center align-items-center h-70">
          <div className="col-lg-12 col-xl-11 m-4">
            <div className="card text-black" style={{ borderRadius: '25px' }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                      Регистрация
                    </p>
                    <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
                      <div className="input-group mb-2 align-items-center">
                        <i className="far fa-image fa-lg me-3 fa-fw"></i>
                        <input
                          className="form-control"
                          type="file"
                          id="avatar"
                        />
                      </div>

                      <div className="d-flex flex-row align-items-center mb-1">
                        <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="text"
                            id="firstName"
                            className="form-control"
                            placeholder="Введите Ваше Имя"
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
                      <div className="d-flex justify-content-start mx-4 mb-3 mb-lg-4 ms-0">
                        <i className="fa-lg me-3 fa-fw"></i>
                        <button
                          id="btnRegister"
                          type="submit"
                          className="btn btn-primary btn-lg"
                        >
                          Зарегистрироваться
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                      className="img-fluid"
                      alt="Sample pic"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
