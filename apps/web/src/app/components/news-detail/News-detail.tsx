import { FormEvent, useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Modal from 'react-modal';
import Moment from 'react-moment';
import { Link, useParams } from 'react-router-dom';
import { AppContext } from '../../context/Context';
import { CreateCommentForm } from '../interfaces/Intefaces';
import { io } from 'socket.io-client';
import fetchDataNewsDetail from '../../lodash/loadashFetchNewsDetail';
import { Action, Colors, CustomStyles } from '../../utils/Utils';
import { environment } from 'apps/web/src/environments/environment';

export default function NewsDetail() {
  const context = useContext(AppContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [customStyles] = useState(CustomStyles);

  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [news, setNews] = useState({} as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dataComments, setDataComments] = useState([] as any);
  const [message, setMessage] = useState('');

  const socketOptions = {
    query: {
      newsId: id,
    },
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: 'Bearer ' + context.accessToken,
        },
      },
    },
  };
  const socket = io(`${environment.apiUrl}/`, socketOptions);

  const handleSubmit = (event: FormEvent<CreateCommentForm>) => {
    event.preventDefault();
    const target = event.currentTarget.elements;
    if (target.message.value !== '') {
      socket.emit('addComment', {
        idNews: id,
        message: target.message.value,
      });
    } else {
      openModal(Action.ERROR, 'Введите текст комментария');
    }
  };

  const getAllComments = async () => {
    const response = await fetch(
      `${environment.apiUrl}/api/news-comments/all/news/${id}`,
      {
        method: 'GET',
      }
    );
    if (response.ok) {
      const data = await response.json();
      setDataComments(data);
    }
  };

  const removeComment = (idComment: string) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + context.accessToken);

    const requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
    };

    const url =
      `${environment.apiUrl}/api/news-comments/` + idComment + '/' + id;

    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        return result ? true : false;
      })
      .catch((error) => console.log('error', error));
  };

  const saveEditMessage = (commentId: string, userId: string) => {
    const el = document.getElementById(
      'editCommit' + commentId
    ) as HTMLInputElement | null;
    if (el != null) {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
      myHeaders.append('Authorization', 'Bearer ' + context.accessToken);

      const urlencoded = new URLSearchParams();
      urlencoded.append('message', el.value);
      urlencoded.append('userId', userId);

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
      };

      const url =
        `${environment.apiUrl}/api/news-comments/edit/` + commentId + '/' + id;

      fetch(url, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          socket.emit('editComment', {
            idComment: commentId,
            idNews: id,
            message: el.value,
          });

          return result ? true : false;
        })
        .catch((error) => {
          openModal(Action.ERROR, error);
        });
    } else {
      openModal(Action.ERROR, 'Введите текст комментария');
    }
  };

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

  useEffect(() => {
    fetchDataNewsDetail(id).then((data) => {
      setNews(data.news);
    });
    getAllComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.emit('create', id);
    socket.on('newComment', () => {
      getAllComments();
    });
    socket.on('editComment', () => {
      getAllComments();
    });
    socket.on('removeComment', () => {
      getAllComments();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="main">
      <Container>
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
        <div className="card text-center">
          <div className="card-body">
            <h2 className="text-uppercase">{news.title} </h2>
            <h6 className="card-subtitle mb-2 text-muted">
              Автор:
              <span className="ms-1 me-1">{context.user.firstName}</span>
              <span>{context.user.lastName}</span>
            </h6>
            <h6 className="card-subtitle text-muted mb-3">
              Дата создания:
              <Moment format="DD.MM.YYYY">{news.createdAt}</Moment>
            </h6>
            <img
              className="img-fluid rounded"
              style={{ maxHeight: '450px' }}
              src={environment.apiUrl + news.cover}
              alt="cover news"
            />
            <p className="card-text mt-3">{news.description}</p>
            <Link to="/news">
              <button type="button" className="btn btn-dark mb-2">
                К новостям
              </button>
            </Link>
          </div>
        </div>

        <div className="card mt-3 p-2">
          {!context.authenticated && (
            <h5 className="text-secondary text-center mt-2">
              Для возможности комментирования Вы можете авторизоваться на сайте
            </h5>
          )}

          {context.authenticated && (
            <div className="card-body" style={{ maxWidth: '320px' }}>
              <h5 className="text-uppercase">Добавить комментарий:</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <textarea
                    className="form-control text-left"
                    id="message"
                    rows={4}
                    cols={50}
                    placeholder="Введите текст комментария"
                  ></textarea>
                </div>
                <button className="btn btn-outline-dark mb-3">Добавить</button>
              </form>
            </div>
          )}

          {Array.isArray(dataComments) && dataComments?.length !== 0 ? (
            <div className="card-body text-start">
              <h5 className="text-uppercase">Комментарии:</h5>
              <div className="card text-left mt-3">
                <div className="card-body">
                  {dataComments.map((comment, index) => {
                    return (
                      <div
                        key={+comment?.id + index}
                        className="d-flex flex-row mb-2"
                      >
                        <form>
                          <div className="form-row align-items-center">
                            <div className="input-group mb-2">
                              <div className="col-auto">
                                <img
                                  className="rounded-circle me-3 mb-2"
                                  src={
                                    environment.apiUrl + comment?.user?.avatar
                                  }
                                  alt="avatar"
                                  height="50"
                                  width="50"
                                />
                              </div>
                              <div className="col-auto">
                                <p className="my-auto me-3">
                                  {comment.message}
                                </p>
                              </div>
                              {context.user.id === +comment?.user?.id && (
                                <>
                                  <div className="col-auto">
                                    <textarea
                                      id={'editCommit' + comment.id}
                                      className="form-control text-left"
                                      readOnly={false}
                                      name="text"
                                      placeholder="Редактирование комментария"
                                    />
                                  </div>
                                  <div className="col-auto">
                                    <button
                                      onClick={() => {
                                        saveEditMessage(
                                          comment.id,
                                          comment.user.id
                                        );
                                      }}
                                      className="btn btn-outline-dark ms-2 cmy-auto"
                                      type="button"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-save"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" />
                                      </svg>
                                    </button>
                                  </div>
                                  <div className="col-auto">
                                    <button
                                      onClick={() => {
                                        removeComment(comment.id);
                                      }}
                                      className="btn btn-outline-dark ms-2 cmy-auto"
                                      style={{ backgroundColor: '#ff5722' }}
                                      type="button"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-trash"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                      </svg>
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </form>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <h5 className="text-secondary text-center">
              Для этой новости комментариев нет
            </h5>
          )}
        </div>
      </Container>
    </main>
  );
}
