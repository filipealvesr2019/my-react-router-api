const Product =  require('../models/product')

// criar produto => /api/v1/product/new
exports.newProduct = async(req, res, next) =>{
    const product =  await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })
}

// mostrar produtos => /api/v1/products
exports.getProducts = async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success:true,
        count: products.length,
        products
    })
}


// mostrar produto especifico por id => /api/v1/product/:id

exports.getSingleProduct = async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(404).json({
            success:false,
            message:"Produto não encontrado"
        })
    }

    res.status(200).json({
        success:true,
        product
    })
}


// atualisar produto => /api/v1/admin/product/:id

exports.updateProduct = async (req, res, next) => {

    let product = await Product.findById(req.params.id);
    
    if(!product){
        return res.status(404).json({
            success:false,
            message:"Produto não encontrado"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false

    })
    res.status(200).json({
        success:true,
        product
    })

}