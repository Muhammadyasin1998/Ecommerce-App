const Product = require('../models/product')


///
///=================create new product ==================================
///

exports.createProduct = async (req, res) => {
    console.log(`req file ${req.file}`)

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        image: req.file.path,
        price: req.body.price
    });

    product = await product.save();
    if (!product) return res.send("the product cannot be created");

    res.send(product)
}



///
///=================Get All Product ==================================
///
exports.getAllProduct = async (req, res) => {

    const allProduct = await Product.find();
    if (!allProduct) return res.send('the product cannot be found');

    res.send(allProduct);

}


///
///=================Get spacific Product ==================================
///
exports.getSingleProduct = async (req, res) => {

    const { productId } = req.query;
    console.log(productId)
    Product.findById(productId).then(product => {
        if (!product) {
            return res.send('user not found');
        }

        res.send(product)

    }).catch(err => {
        res.send(err.message);
    })


}





///
///=================update product ==================================
///
exports.updateProduct = async (req, res) => {
    const { productId } = req.query;


    Product.findByIdAndUpdate(productId, {
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        price: req.body.price
    },
        { new: true }
    ).then(product => {
        if (!product) return res.send('product not found');
        res.send(product);
    }).catch(err => res.send(err.message));



}





///
///=================delete product ==================================
///
exports.deleteProduct = async (req, res) => {
    const { productId } = req.query;
    const product = await Product.findById(productId);
    if (!product)

        Product.findByIdAndDelete(productId
        ).then(product => {
            if (!product) return res.send('product not found');
            res.send('product deleted');
        }).catch(err => res.json({
            err: err,
            status: false
        }));



}



exports.searchProduct = async (req, res) => {
    const { searchKey } = req.query;
    Product.find({ name: searchKey }).then(product => {
        res.json({ status: true, data: product });
    }).catch(err => res.json({
        err: err,
        status: false
    }));;


}
