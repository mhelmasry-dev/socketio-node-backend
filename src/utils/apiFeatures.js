class ApiFeatures {
  constructor(mongooseQuery, queryData) {
    this.mongooseQuery = mongooseQuery;
    this.queryData = queryData;
  }

  paginate() {
    let { page, size } = this.queryData;
    if (!page || page <= 0) {
      page = 1;
    }
    if (!size || size <= 0) {
      size = 2;
    }
    this.mongooseQuery = this.mongooseQuery
      .limit(parseInt(size))
      .skip((parseInt(page) - 1) * parseInt(size));
    return this;
  }

  filter() {
    const excludeQueryParams = ["page", "size", "sort", "search", "fields"];
    const filterQuery = { ...this.queryData };
    excludeQueryParams.forEach((param) => {
      delete filterQuery[param];
    });
    this.mongooseQuery.find(
      JSON.parse(
        JSON.stringify(filterQuery).replace(
          /(gt|gte|lt|lte|in|nin|eq|neq)/g,
          (match) => `$${match}`
        )
      )
    );
    return this;
  }

  sort() {
    if (this.queryData.sort) {
      // تأكد من وجود الحقول في قاعدة البيانات
      this.mongooseQuery = this.mongooseQuery.sort(this.queryData.sort.replaceAll(",", " "));
    }
    return this;
  }

  search() {
    if (this.queryData.search) {
      // استخدام $or للبحث في الحقول المطلوبة
      this.mongooseQuery = this.mongooseQuery.find({
        $or: [
          { name: { $regex: this.queryData.search, $options: "i" } },
          { description: { $regex: this.queryData.search, $options: "i" } },
        ],
      });
    }
    return this; // للسماح بسلسلة الدوال
  }

  select() {
    this.mongooseQuery = this.mongooseQuery.select(this.queryData.fields?.replaceAll(",", " "));
    return this;
  }
}

export default ApiFeatures;
