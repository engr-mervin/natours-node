// import { Model, Query } from 'mongoose';
// import {
//   DEFAULT_DOCUMENTS_PER_PAGE,
//   DEFAULT_FIELDS,
//   DEFAULT_SORT_FIELD,
// } from './constants.js';

// export const findFiltered = function (model: Model<any>, queryObj: any) {
//   ['page', 'sort', 'limit', 'fields'].forEach((el) => {
//     delete queryObj[el];
//   });

//   let queryStr = JSON.stringify(queryObj);

//   queryStr = queryStr.replace(
//     /\b(gt|lt|lte|gte)\b/g,
//     (match: string) => `$${match}`
//   );

//   return model.find(JSON.parse(queryStr));
// };

// export const sort = function (query: Query<any, any>, sortString: string) {
//   if (sortString) {
//     return query.sort(sortString.replaceAll(',', ' '));
//   } else {
//     return query.sort(DEFAULT_SORT_FIELD);
//   }
// };

// export const limit = function (query: Query<any, any>, fieldsString: string) {
//   if (fieldsString) {
//     const fields = fieldsString.replaceAll(',', ' ');
//     return query.select(fields);
//   } else {
//     return query.select(DEFAULT_FIELDS);
//   }
// };

// export const paginate = async function (
//   query: Query<any, any>,
//   page: number = 1,
//   itemsPerPage: number = DEFAULT_DOCUMENTS_PER_PAGE,
//   model: Model<any> | undefined = undefined
// ) {
//   const skippedItems = (page - 1) * itemsPerPage;

//   if (model !== undefined) {
//     const numOfTours = await model.countDocuments();
//     if (skippedItems >= numOfTours) {
//       throw new Error('This page does not exist');
//     }
//   }

//   return query.skip(skippedItems).limit(itemsPerPage);
// };

import { Query } from 'mongoose';
import {
  DEFAULT_DOCUMENTS_PER_PAGE,
  DEFAULT_FIELDS,
  DEFAULT_SORT_FIELD,
} from './constants.js';

export class QueryManager {
  query: Query<any, any>;
  queryObj: any;

  constructor(query: Query<any, any>, queryObj: any) {
    this.query = query;
    this.queryObj = queryObj;
  }

  filter() {
    const filterFields = { ...this.queryObj };
    ['page', 'sort', 'limit', 'fields'].forEach((el) => {
      delete filterFields[el];
    });

    let queryStr = JSON.stringify(filterFields);

    queryStr = queryStr.replace(
      /\b(gt|lt|lte|gte)\b/g,
      (match: string) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryObj.sort) {
      this.query = this.query.sort(this.queryObj.sort.replaceAll(',', ' '));
    } else {
      this.query = this.query.sort(DEFAULT_SORT_FIELD);
    }
    return this;
  }

  select() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields.replaceAll(',', ' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select(DEFAULT_FIELDS);
    }
    return this;
  }

  limit() {
    const page = this.queryObj.page || 1;
    const itemsPerPage = this.queryObj.limit || DEFAULT_DOCUMENTS_PER_PAGE;

    const skippedItems = (page - 1) * itemsPerPage;

    this.query = this.query.skip(skippedItems).limit(itemsPerPage);
    return this;
  }
}

// if (model !== undefined) {
//     const numOfTours = await model.countDocuments();
//     if (skippedItems >= numOfTours) {
//       throw new Error('This page does not exist');
//     }
//   }
