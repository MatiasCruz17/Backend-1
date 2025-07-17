import ProductModel from "../models/product.model.js";

class ProductManager {
    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        const filter = {};

        if (query) {
            if (query === 'available') filter.status = true;
            else filter.category = query;
        }
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1} : undefined
        };
        const result = await ProductModel.paginate(filter, options);
        return {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalpages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hastNextPage,
            prevLink: result.hasPrevPage ? `?page=${result.prevPage}`: null,
            nextLink: result.hasNextPage ? `?page=${result.NextPage}`: null
        };
    }
    async getProductById(id) {
        return await ProductModel.findById(id);
    }
    async addProduct(data){
        const exist = await ProductManager.findOne({code: data.code});
        if (exist) throw new Error ('Codigo de productos ya existente');
        return await ProductModel.create(data);
    }
    async updateProduct(id, updates) {
        return await ProductModel.findByIdAndUpdate(id, updates, { new: true});
    }
    async deleteProduct(id){
        return await ProductModel.findByIdAndDelete(id);
    }
}

export default ProductManager;