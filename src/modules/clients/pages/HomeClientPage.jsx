import { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { getProducts } from '../../products/services/products';
import ProductCard from '../../home/components/ProductCardHome';
import Pagination from '../../home/components/Pagination';
import { useNavigate } from 'react-router-dom';

function HomeClientPage() {

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
    <div>
      <main className="p-4 w-full h-full flex flex-col sm:grid sm:grid-cols-3 sm:grid-rows-2 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </main>
              <Pagination total={total} pageNumber={pageNumber} totalPages={totalPages} onPageChange={goToPage} />
    </div>
  );
}

export default HomeClientPage;
