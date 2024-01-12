class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
   
  search() {
    const { keyword } = this.queryString;
    if (keyword) {
      // Use regex to perform a case-insensitive search on the 'name' field
      const regex = new RegExp(keyword, 'i');
      this.query = this.query.find({ name: regex });
    }
    return this;
  }
  
    filter() {
      // Your existing filter logic
      return this;
    }
  
    pagination(resPerPage) {
      const currentPage = Number(this.queryString.page) || 1;
      const skip = resPerPage * (currentPage - 1);
  
      this.query = this.query.limit(resPerPage).skip(skip);
      return this;
    }
  }
  
  module.exports = APIFeatures;
  