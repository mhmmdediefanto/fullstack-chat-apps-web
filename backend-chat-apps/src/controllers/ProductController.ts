import { response } from "../helpers/response";
import Productservice from "../services/Productservice";

// controller hanya menerima request dan response
class ProducController {
  async index(req: any, res: any) {
    try {
      const products = await Productservice.getAllProduct();
      if (products.length === 0)
        return response(404, [], "Data not found", res);
      return response(200, products, "Success", res);
    } catch (error) {
      response(500, error, "Error", res);
    }
  }

  async create(req: any, res: any) {
    try {
      const { name, price, stock } = req.body;
      const slugProduct = name.toLowerCase().split(" ").join("-");
      const product = await Productservice.createProduct({
        name,
        price,
        stock,
        slug: slugProduct,
      });

      return response(200, product, "Success", res);
    } catch (error: any) {
      if ((error.message = "Product already exists"))
        return response(400, {}, error.message, res);
      response(500, error, "Error", res);
    }
  }

  async destroy(req: any, res: any) {
    try {
      const { id } = req.params;
      const product = await Productservice.destroyProduct(parseInt(id));
      return response(200, product, "Product deleted successfully", res);
    } catch (error: any) {
      if ((error.message = "Product not found"))
        return response(404, {}, error.message, res);
      response(500, {}, error, res);
    }
  }
}

export default new ProducController();
