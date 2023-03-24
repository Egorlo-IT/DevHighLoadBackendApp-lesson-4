import { Route, Routes } from 'react-router-dom';
import PageNotFound from './components/page-not-found/Page-not-found';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.module.scss';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import News from './components/news/News';
import Home from './components/home/home';
import Login from './components/login/Login';
import Profile from './components/profile/Profile';
import Register from './components/register/Register';
import NewsDetail from './components/news-detail/News-detail';
import AppContextProvider from './context/Context';

export function App() {
  return (
    <AppContextProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path={'/news/:id'} element={<NewsDetail />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </AppContextProvider>
  );
}

export default App;
