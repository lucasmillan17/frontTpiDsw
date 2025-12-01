import Card from "../../shared/components/Card";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useEffect, useCallback } from "react";
import { getProducts } from "../services/list.js";
import { useState } from "react";

function ListProductsPage() {

    const [ total, setTotal ] = useState(0);
    const [ products, setProducts ] = useState([]);

    const [loading, setLoading] = useState(false);

    const {
        register,
        control,
    } = useForm({mode: 'onChange', defaultValues: { search: '', status: 'all' }});

    // observar campos concretos (no todo el form)
    const searchValue = useWatch({ control, name: 'search' });
    const statusValue = useWatch({ control, name: 'status' });

    const fetchProducts = useCallback(async (search, status) => {
      try {
        setLoading(true);
        const { data, error } = await getProducts(search, status);
        if (error) throw error;
        setTotal(data.totalCount);
        setProducts(data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, []);

    
    useEffect(() => {
      const id = setTimeout(() => {
        fetchProducts(searchValue, statusValue);
      }, 300);

      return () => clearTimeout(id);
    }, [searchValue, statusValue, fetchProducts]);

    const statusMap = {
      active: 'Activo',
      disabled: 'Inactivo',
      all: 'Todos'
    };

    return (
        <div className="flex flex-col h-lvh justify-start gap-4"> {/* full viewport height, columna */}
            <Card className="flex flex-col gap-4"> {/* header / filtros queda fijo */}
                <form className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <span className="font-bold">Productos</span>
                        <button className="hidden sm:block text-sm p-2">Crear Producto</button>
                        <button className="sm:hidden text-sm">
                            <img
                                src="https://www.svgrepo.com/show/521942/add-ellipse.svg"
                                alt="add"
                                className="w-5 h-5"
                            />
                        </button>
                    </div>
                    <div className="flex gap-2 w-full">
                        <input type="text" placeholder="Buscar producto por nombre..." className="input-default w-full" {...register('search')} />
                        <div className="hidden sm:block">
                          <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                              <select {...field} className="input-default w-50">
                                <option value="all">Filtrar por estado</option>
                                <option value="enabled">Activo</option>
                                <option value="disabled">Inactivo</option>
                                <option value="all">Todos</option>
                              </select>
                            )}
                          />
                        </div>
                    </div>
                    <div className="sm:hidden w-full gap-2">
                        <Controller
                          name="status"
                          control={control}
                          render={({ field }) => (
                            <select {...field} className="input-default w-full">
                                <option value="all">Filtrar por estado</option>
                                <option value="enabled">Activo</option>
                                <option value="disabled">Inactivo</option>
                                <option value="all">Todos</option>
                            </select>
                          )}
                        />
                    </div>
                </form>
            </Card>

            {/* área scrollable: ocupa el resto de la altura y hace scroll sólo aquí */}
            <div className="flex-1 overflow-auto p-2 space-y-4 bg-transparent">
                {products.map(product => (
                    <Card key={product.productId}>
                        <div className="flex flex-col gap-2">
                          <span className="font-bold">{product.sku} - {product.name}</span>
                          <span>{product.stockQuantity} - {statusMap[product.status] ?? product.status}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default ListProductsPage;