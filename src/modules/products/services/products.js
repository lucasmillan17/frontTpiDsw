import { instance } from '../../shared/api/axiosInstance';

export const getProducts = async (search = null, status = null, pageNumber = 1, pageSize = 20 ) => {
  const queryString = new URLSearchParams({
    search,
    status,
    pageNumber,
    pageSize,
  });

  const response = await instance.get(`/api/products/admin?${queryString}`);

  return { data: response.data, error: null };
};

export const createProduct = async (productData) => {
  try {
    const response = await instance.post('/api/products', productData);
    return { data: response.data, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: error.response?.data};
  }
};