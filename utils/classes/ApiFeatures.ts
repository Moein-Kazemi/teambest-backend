import { Query } from "mongoose";
import { ParsedQs } from "qs";

export default class ApiFeatures<ResultDoc> {
  // query from mongoose to query on DB
  query: Query<ResultDoc[], ResultDoc>;
  // queryString is object in req.query
  queryString: ParsedQs;

  constructor(query: Query<ResultDoc[], ResultDoc>, queryString: ParsedQs) {
    ((this.query = query), (this.queryString = queryString));
  }
  filter(): this {
    //1A) FILTER DATA BY EQUALITY
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "limit", "sort", "fields"];
    excludeFields.forEach((deleteProp) => delete queryObj[deleteProp]);

    //1B) ADVANCED FILTER DATA BY OPERATORS
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let finalQueryStr = JSON.parse(queryStr);

    // firs query on this.query
    this.query = this.query.find(finalQueryStr);

    //  must return this , so we can chain method on it like .filter().sort()
    return this;
  }
  sort(): this {
    // 2) SORTING
    if (this.queryString.sort) {
      // this is for when the type is string and sort does not reapet in query string
      if (typeof this.queryString.sort === "string") {
        const sortBy = this.queryString.sort.split(",").join(" ");

        this.query = this.query.sort(sortBy);
      }
    } else {
      this.query = this.query.sort("createdAt");
    }
    return this;
  }
  limitFields(): this {
    // 3) LIMIT FIELDS
    if (this.queryString.fields) {
      if (typeof this.queryString.fields === "string") {
        const selectFields = this.queryString.fields.split(",").join(" ");
        this.query = this.query.select(selectFields);
      }
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  pagenate(): this {
    // 4) PAGENATION
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 10;
    const skipDoc = (page - 1) * limit;

    this.query = this.query.skip(skipDoc).limit(limit);

    return this;
  }
}
