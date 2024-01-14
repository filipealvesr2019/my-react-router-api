class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const { keyword } = this.queryString;
    console.log('Keyword:', keyword);
    if (keyword) {
      const regex = new RegExp(keyword, 'i');
      console.log('Regex:', regex);
      this.query = this.query.match({ 'name': regex });
      console.log('Query:', this.query);
    }
    return this;
  }

  async executeQuery() {
    return await this.query.exec();
  }

  filter() {
    // Sua lógica de filtro existente
    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }

  priceFilter() {
    const { minPrice, maxPrice } = this.queryString;
    if (minPrice && maxPrice) {
      this.query = this.query.match({
        price: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) }
      });
    }
    return this;
  }
}

module.exports = APIFeatures;
