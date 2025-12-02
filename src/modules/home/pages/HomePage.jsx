import Card from "../../shared/components/Card";
import ProductCardHome from "../components/ProductCardHome";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { getProducts } from "../../products/services/products";
import Pagination from "../components/Pagination";
import "./HomePage.css";

export default function HomePage() {
    const [ total, setTotal ] = useState(0);
    const [ products, setProducts ] = useState([]);
    const [ pageNumber, setPageNumber ] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        control,
    } = useForm({mode: 'onChange', defaultValues: { search: '', status: 'all' }});

    const getLinkStyles = ({ isActive }) => (
  `
    inline-flex items-center justify-center
    px-4 py-2
    rounded-full transition hover:bg-gray-100
    ${isActive ? 'bg-purple-200 hover:bg-purple-100' : ''}
  `
);

    // observar campos concretos (no todo el form)
    const searchValue = useWatch({ control, name: 'search' });
    const statusValue = useWatch({ control, name: 'status' });

    const pageSize = 6;

    // fetchProducts should depend on pageNumber so changing page fetches new data
    const fetchProducts = useCallback(async (search, status) => {
      try {
        setLoading(true);
        const { data, error } = await getProducts(search, status, pageNumber, pageSize);
        if (error) throw error;
        setTotal(data.totalCount);
        setProducts(data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, [pageNumber]);

    useEffect(() => {
      const id = setTimeout(() => {
        fetchProducts(searchValue, statusValue);
      }, 300);

      return () => clearTimeout(id);
    }, [searchValue, statusValue, fetchProducts]);

    // cuando cambia la búsqueda o el filtro, volver a la página 1
    useEffect(() => {
      setPageNumber(1);
    }, [searchValue, statusValue]);

    const statusMap = {
      active: 'Activo',
      disabled: 'Inactivo',
      all: 'Todos'
    };

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const goToPage = (p) => {
      if (p < 1 || p > totalPages) return;
      setPageNumber(p);
    };

  return (
    <div className="home-page">
        <header className="bg-white
                border-gray-200
                rounded-md
                flex
                justify-between
                items-center
                shadow
                p-4
                text-base
                font-semibold
                text-gray-700
                w-full">
            <div className="flex items-center text-center h-full pl-25 gap-10">
            <NavLink to="/" className={getLinkStyles}>Products</NavLink>
            <NavLink to="/cart" className={getLinkStyles}>Carrito de compras</NavLink>
            </div>
            <div className="relative w-64">
              <input
                type="text"
                className="border border-gray-300 rounded-2xl p-2 pr-10 w-full"
                placeholder="Search"
                {...register('search')}
              />
              <img
                src="https://www.svgrepo.com/show/532555/search.svg"
                alt="search"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
              />
            </div>
            <div className="flex pr-25 gap-10">
            <button className="bg-gray-200 p-2 text-gray-700 rounded-md border-none shadow-none" onClick={() => navigate('/login')}>Iniciar Sesión</button>
            <button className="bg-gray-200 p-2 text-gray-700 rounded-md border-none shadow-none" onClick={() => navigate('/register')}>Registrarse</button>
            </div>
        </header>
        <main className="p-4 w-full h-full grid grid-cols-3 grid-rows-2 gap-4">
            {products.map((product) => (
              <ProductCardHome key={product.id} product={product} />
            ))}
        </main>
        <Pagination total={total} pageNumber={pageNumber} totalPages={totalPages} onPageChange={goToPage} />
    </div>
  );
}
