import { Outlet } from 'react-router-dom';
import CustomNav from './components/Nav';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <CustomNav />
            <main className="flex-grow-1" style={{ paddingTop: '70px', background: "linear-gradient(100deg,rgba(237, 225, 225, 1) 0%, rgba(213, 219, 230, 1) 100%)" }}>
                <Outlet />
            </main>
            <Footer />
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
};

export default Layout;
