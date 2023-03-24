import { FormEvent, useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Container } from 'react-bootstrap';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Moment from 'react-moment';
import { AppContext } from '../../context/Context';
import { Action, Colors, CustomStyles } from '../../utils/Utils';
import { CreateNewsForm } from '../interfaces/Intefaces';
import { Link } from 'react-router-dom';
import loadashFetchNewsAll from '../../lodash/loadashFetchNewsAll';
import { environment } from 'apps/web/src/environments/environment';

export default function News() {
  const context = useContext(AppContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [customStyles] = useState(CustomStyles);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [itemsNews, setItemsNews] = useState([] as any[]);

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

  const showCards = () => {
    return (
      <>
        {itemsNews.map((item, index) => {
          return (
            <div key={index} className="col-lg-6 mb-3">
              <div className="card text-center">
                <div className="card-body">
                  <h4 className="card-title text-uppercase">{item.title}</h4>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Автор: {item.user.firstName} {item.user.lastName}
                  </h6>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Дата создания:{' '}
                    <Moment format="DD.MM.YYYY">{item.createdAt}</Moment>
                  </h6>
                  <img
                    src={environment.apiUrl + item.cover}
                    className="img-fluid rounded m-2"
                    style={{ maxHeight: '250px' }}
                    alt="cover news"
                  />
                  <p className="card-text text-truncate">{item.description}</p>
                  <Link to={'/news/' + item.id}>
                    <button type="button" className="btn btn-dark mb-4">
                      Читать далее
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const showSkeleton = () => {
    return (
      <>
        {Array(4)
          .fill(0)
          .map((_, index) => {
            return (
              <div key={index} className="col-lg-6 mb-3">
                <div className="card">
                  <SkeletonTheme baseColor="#ccc" highlightColor="#fff">
                    <div className="card-body" style={{ height: '450px' }}>
                      <h4 className="card-title text-center">
                        <Skeleton width={'30%'} />
                      </h4>
                      <p className="text-center mb-1">
                        <Skeleton width={'60%'} />
                        <Skeleton width={'40%'} />
                      </p>
                      <div className="text-center">
                        <Skeleton width={'60%'} height={200} />
                      </div>
                      <p className="text-center mt-2 mb-4">
                        <Skeleton width={'80%'} />
                      </p>
                      <div className="text-center">
                        <Skeleton width={'120px'} height={'40px'} />
                      </div>
                    </div>
                  </SkeletonTheme>
                </div>
              </div>
            );
          })}
      </>
    );
  };

  const showFormCreate = () => {
    return (
      <div
        style={{ maxWidth: '550px' }}
        className="card text-center mt-3 m-auto"
      >
        <h3 className="text-uppercase mt-4">Создайте свою новость</h3>
        <form onSubmit={handleSubmit}>
          <div className="card-body mx-auto">
            <div className="input-group mb-2 align-items-center">
              <label htmlFor="cover" className="form-label mb-0 me-2">
                Изображение анонса:
              </label>
              <input className="form-control" type="file" id="cover" />
            </div>
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                aria-describedby="title"
                placeholder="Введите название новости"
              />
            </div>
            <div className="mb-2">
              <textarea
                className="form-control text-left"
                id="description"
                rows={4}
                cols={50}
                name="description"
                placeholder="Введите текст новости"
              ></textarea>
            </div>
            <button
              id="btnCreateNews"
              type="submit"
              className="btn btn-dark mb-3"
            >
              Создать новость
            </button>
          </div>
        </form>
      </div>
    );
  };

  const noNews = () => {
    return <h2 className="text-center text-muted">Новостей нет</h2>;
  };

  const showAtention = () => {
    return (
      <h4 className="text-secondary text-center">
        Для создания своих новостей Вы можете авторизоваться на сайте
      </h4>
    );
  };

  const handleSubmit = (event: FormEvent<CreateNewsForm>) => {
    event.preventDefault();
    const formTarget = document.querySelector('form');
    const target = event.currentTarget.elements;
    const title = target.title.value;
    const description = target.description.value;
    const cover = target.cover.value;
    const coverFiles: FileList | null = target.cover.files;
    let coverFilesTaget = '';
    [].forEach.call(coverFiles, (file) => {
      coverFilesTaget = file;
    });

    if (cover !== '' && title !== '' && description !== '') {
      const myHeaders = new Headers();
      myHeaders.append('Authorization', 'Bearer ' + context.accessToken);

      const formdata = new FormData();
      formdata.append('title', title);
      formdata.append('description', description);
      formdata.append('authorId', context.user.id);
      formdata.append('categoryId', '1');
      formdata.append(
        'cover',
        coverFilesTaget,
        `${environment.apiUrl}/news-static` + cover
      );
      const requestOptions = {
        headers: myHeaders,
        method: 'POST',
        body: formdata,
      };
      const url = `${environment.apiUrl}/api/news/create`;
      fetch(url, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const data = JSON.parse(result);
          if (data?.statusCode === 401) {
            openModal(Action.ERROR, 'Вы не авторизованы!');
            return;
          }
          // fetchData();
          openModal(Action.SUCCESS, 'Новость успешно создана');
          formTarget?.reset();
        })
        .catch((error) => {
          openModal(Action.ERROR, error);
        });
    } else {
      openModal(
        Action.ERROR,
        'В форме создания новости все поля обязательны для заполнения!'
      );
    }
  };

  // const fetchNoCache = () => {
  //   fetch(`${environment.apiUrl}/api/news`)
  //     .then((res) => res.json())
  //     .then((json) => {
  //       setItemsNews(json.news);
  //     })
  //     .catch((e) => console.log(e));
  // };

  useEffect(() => {
    loadashFetchNewsAll().then((data) => {
      setItemsNews(data.news);
    });
    // fetchNoCache();
  }, []);

  return (
    <main className="main mt-4">
      <Container>
        <Modal
          style={customStyles}
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="News Modal"
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
        <h1 className="text-uppercase mb-5 text-center">Новости</h1>
        <div className="row">
          {itemsNews.length > 0
            ? showCards()
            : itemsNews.length === 0
            ? noNews()
            : showSkeleton()}
        </div>
        {context.authenticated ? showFormCreate() : showAtention()}
      </Container>
    </main>
  );
}
