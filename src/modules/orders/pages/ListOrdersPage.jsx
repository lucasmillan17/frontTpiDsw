import Card from "../../shared/components/Card";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useEffect, useCallback } from "react";
import { getOrders } from "../services/listOrders.js";
import { useState } from "react";

function ListOrdersPage() {

    //const [ total, setTotal ] = useState(0);
    const [ orders, setOrders ] = useState([]);

    const [loading, setLoading] = useState(false);

    const {
        register,
        control,
    } = useForm({mode: 'onChange', defaultValues: { search: '', status: 'all' }});

    // observar campos concretos (no todo el form)
    const searchValue = useWatch({ control, name: 'search' });
    const statusValue = useWatch({ control, name: 'status' });

    const fetchOrders = useCallback(async () => {
          try {
            setLoading(true);
            const { data, error } = await getOrders();
            if (error) throw error;
            setOrders(data);
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        }, []);

    useEffect(() => {
        const id = setTimeout(() => {
        fetchOrders();
      }, 300);
      return () => clearTimeout(id);
    }, [searchValue, statusValue, fetchOrders]);

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
                        <span className="font-bold">Ordenes</span>
                    </div>
                    <div className="flex gap-2 w-full">
                        <input type="text" placeholder="Buscar ordenes por id..." className="input-default w-full" {...register('search')} />
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

            <div className="flex-1 overflow-auto p-2 space-y-4 bg-transparent">
                {orders.map(order => (
                    <Card key={order.orderId}>
                        <div className="flex flex-col gap-2">
                          <span className="font-bold">{order.orderId} - {order.customerName}</span>
                          <span>{order.stockQuantity} - {statusMap[order.status] ?? order.status}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default ListOrdersPage;