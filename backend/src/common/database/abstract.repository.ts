import { Logger, NotFoundException } from '@nestjs/common';
import {
  ClientSession,
  Condition,
  Connection,
  FilterQuery,
  InsertManyOptions,
  Model,
  ProjectionType,
  QueryOptions,
  SaveOptions,
  Types,
  UpdateQuery,
} from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { IPaginatedType, PaginationOptions } from '../types/pagination.types';

/**
 * Abstract repository providing base CRUD operations for MongoDB documents.
 * @template TDocument - Type of document extending AbstractDocument.
 * @template CreateTDocument - Type of document for create operations.
 * @template UpdateTDocument - Type of document for update operations.
 */
export abstract class AbstractRepository<
  TDocument extends AbstractDocument,
  CreateTDocument = Partial<TDocument>,
  UpdateTDocument = Partial<TDocument>,
> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection,
  ) {}

  /**
   * Array of field names to populate automatically during find operations.
   * Use this to specify related fields that should be populated with full documents
   * instead of just their references.
   * @type {string[]}
   * @protected
   */
  protected populateOnFind: string[] = [];

  /**
   * Array of field names to exclude from query results.
   * These fields are typically sensitive (e.g., password) and should not be returned
   * in the response.
   * @type {string[]}
   * @protected
   */
  protected excludedFields: string[] = [];

  /**
   * Array of field names that can be used in text-based search operations.
   * These fields allow for keyword searches to improve find and filter functionality.
   * @type {(keyof TDocument)[]}
   * @protected
   */
  protected searchableFields: (keyof TDocument)[] = [];

  /**
   * Creates a new document.
   * @param document - Document data to create (excluding _id).
   * @param options - Optional save options.
   * @returns {Promise<TDocument>} The created document.
   */
  async create(
    document: Omit<CreateTDocument, '_id'>,
    options?: SaveOptions,
  ): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (
      await createdDocument.save(options)
    ).toJSON() as unknown as TDocument;
  }

  /**
   * Finds a document by the specified query or creates a new one if it doesn't exist.
   * @param findBy - Query to find an existing document.
   * @param dto - Data to create the document if not found.
   * @param options - Optional save options.
   * @returns {Promise<[TDocument, boolean]>} The document and a flag indicating if it was created.
   */
  public async findOrCreate(
    findBy: FilterQuery<TDocument>,
    dto: CreateTDocument,
    options?: SaveOptions,
  ): Promise<[TDocument, boolean]> {
    let document = await this.findOne(findBy);
    if (!document) {
      document = await this.create(dto, options);
      return [document, true];
    }
    return [document, false];
  }

  /**
   * Creates multiple documents.
   * @param dto - Array of documents to create.
   * @param options - Optional insert many options.
   * @returns {Promise<TDocument[]>} Array of created documents.
   */
  public async bulkCreate(
    dto: CreateTDocument[],
    options: InsertManyOptions = {},
  ) {
    return this.model.insertMany(dto, options);
  }

  /**
   * Finds a single document by the specified query.
   * @param filterQuery - Query to find the document.
   * @returns {Promise<TDocument | null>} The found document or null if not found.
   */
  async findOne(
    filterQuery: FilterQuery<TDocument>,
    projection?: ProjectionType<TDocument> | null,
    options?: QueryOptions<TDocument> | null,
  ): Promise<TDocument> {
    const exclusionProjection = {
      ...this.getExclusionProjection(),
      ...(projection as Record<string, unknown>), // Spread objects only
    };
    const document = await this.model.findOne(
      filterQuery,
      exclusionProjection,
      { lean: true, ...options, populate: this.populateOnFind },
    );

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
    }

    return document as TDocument;
  }

  /**
   * Finds a single document and updates it.
   * @param filterQuery - Query to find the document.
   * @param update - Update data.
   * @param options - Optional query options.
   * @returns {Promise<TDocument>} The updated document.
   * @throws {NotFoundException} If the document is not found.
   */
  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
    options?: QueryOptions<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
      ...options,
      populate: this.populateOnFind,
    });

    if (!document) {
      this.logger.warn(`Document not found with filterQuery:`, filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  /**
   * Finds a document and updates it if it exists; otherwise, creates a new document.
   * @param filterQuery - Query to find the document.
   * @param document - Data for update or creation.
   * @param options - Optional query options.
   * @returns {Promise<TDocument>} The upserted document.
   */
  async upsert(
    filterQuery: FilterQuery<TDocument>,
    document: UpdateTDocument,
    options?: QueryOptions<TDocument>,
  ): Promise<TDocument> {
    return this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
      ...options,
      populate: this.populateOnFind,
    });
  }

  /**
   * Finds multiple documents based on the filter query.
   * @param filter - Query filter.
   * @param projection - Optional fields to include or exclude.
   * @param options - Optional query options.
   * @returns {Promise<TDocument[]>} Array of found documents.
   */
  public async find(
    filter: FilterQuery<TDocument> = {},
    projection?: ProjectionType<TDocument>,
    options?: QueryOptions<TDocument>,
  ): Promise<TDocument[]> {
    // Combine excluded fields with any additional projection provided
    const finalProjection = {
      ...this.getExclusionProjection(),
      ...(projection as Record<string, unknown>), // Spread objects only
    };

    return this.model
      .find(filter, finalProjection, options)
      .populate(this.populateOnFind)
      .exec();
  }

  /**
   * Deletes a single document based on the filter query.
   * @param filterQuery - Query to find the document.
   * @returns {Promise<{ deletedCount?: number }>} The result of the deletion operation.
   */
  async deleteOne(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<{ deletedCount?: number }> {
    return this.model.deleteOne(filterQuery, { lean: true });
  }

  /**
   * Deletes multiple documents based on the filter query.
   * @param filterQuery - Query to find documents to delete.
   * @returns {Promise<{ deletedCount?: number }>} The result of the deletion operation.
   */
  async delete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<{ deletedCount?: number }> {
    return this.model.deleteMany(filterQuery, { lean: true });
  }

  /**
   * Starts a MongoDB session with a transaction.
   * @returns {Promise<ClientSession>} The started session.
   */
  async startTransaction(): Promise<ClientSession> {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }

  /**
   * Generates a projection object for MongoDB queries that excludes the fields
   * specified in `excludedFields`.
   * @returns {Record<string, 0>} The projection object with specified fields set to 0
   */
  private getExclusionProjection(): Record<string, 0> {
    const projection: Record<string, 0> = {};
    this.excludedFields.forEach((field) => {
      projection[field as string] = 0;
    });
    return projection;
  }

  public async paginate({
    defaultFilter,
    filter,
    select,
    options = {},
    search,
    sort = { _id: -1 },
    limit = 20,
    page = 1,
  }: PaginationOptions<TDocument>): Promise<IPaginatedType<TDocument>> {
    // TODO: Implement Full text search
    const searchFilter: FilterQuery<TDocument> = this.getSearchQuery(search);

    const data = await this.model
      .find({ ...defaultFilter, ...filter }, select, {
        ...options,
        sort,
        limit,
        skip: limit * (page - 1),
      })
      .find(searchFilter)
      .exec();

    const count = await this.model
      .countDocuments({ ...defaultFilter, ...filter, ...searchFilter })
      .exec();
    return {
      results: data,
      pagination: {
        limit,
        page,
        total: count,
        pages: Math.ceil(count / limit),
      },
    };
  }

  public getSearchQuery(
    search: string | undefined,
    searchableFields: string[] = [],
  ) {
    const searchFilter: FilterQuery<TDocument> = {};

    if (search) {
      const fields = searchableFields.length
        ? searchableFields
        : this.searchableFields;
      fields.forEach((field) => {
        const searchRegex = `${search}`
          ?.split(' ') // separate strings
          .flatMap((s) => s.split('-')) // separate dashed words
          .map((s) => `(${s})`)
          .join('|');
        searchFilter.$or = searchFilter.$or ?? [];
        searchFilter.$or.push({
          [field]: {
            $regex: new RegExp(`${searchRegex}`, 'i'),
          },
        } as Condition<TDocument>);
      });
    }
    return searchFilter;
  }
}
