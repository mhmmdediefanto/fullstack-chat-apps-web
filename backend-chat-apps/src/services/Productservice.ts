import {
  findAllProduct,
  insertProduct,
  getBySlug,
  deleteProduct,
  getById,
} from "../repository/ProductRepository";

// service hanya menerima request dari controller
const getAllProduct = async () => {
  const products = await findAllProduct();
  return products;
};

const createProduct = async (params: any) => {
  const existing = await getBySlug(params.slug);
  if (existing) {
    throw new Error("Product already exists");
  }

  const product = await insertProduct(params);
  return product;
};

const destroyProduct = async (id: number) => {
  const handling = await getById(id);
  if (!handling) {
    throw new Error("Product not found");
  }

  const product = await deleteProduct(id);
  return product;
};

export default { getAllProduct, createProduct, destroyProduct };
