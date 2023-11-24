class APIFeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;

       
    }

    search(){
        const keyword = this.queryString.keyword ? {
            name:{
                $regex: this.queryString.keyword,
                $options:"i"
            }
        } : {}
        
        console.log(keyword)
        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy = {...this.queryString};
        const removeFields = ["keyword", "limit", "page"]
        removeFields.forEach(element => delete queryCopy[element]);

        console.log(queryCopy);

        // filtrar por preço
        let queryString = JSON.stringify(queryCopy)
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, match => {
            return '$' + match;
          }
        )
        
        console.log(queryCopy);
        this.query = this.query.find(JSON.parse(queryString));
        return this
    }
    

    pagination(resPerPage){
        const currentPage = Number(this.queryString.page) || 1;
        const skip = resPerPage * (currentPage - 1);


        this.query = this.query.limit(resPerPage).skip(skip);
        return this
    }
}

module.exports = APIFeatures;
