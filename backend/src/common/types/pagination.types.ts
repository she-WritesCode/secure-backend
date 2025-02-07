import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, {
  FilterQuery,
  PopulateOptions,
  ProjectionType,
  QueryOptions,
} from 'mongoose';

export interface PaginationOptions<TDocument> {
  limit?: number;
  page?: number;
  sort: Record<string, 1 | -1 | mongoose.Expression.Meta>;
  defaultFilter?: FilterQuery<TDocument>;
  filter?: FilterQuery<TDocument>;
  select?: ProjectionType<TDocument> | null;
  options?:
    | (Omit<QueryOptions<TDocument>, 'populate'> & {
        populate?: string[] | PopulateOptions[];
      })
    | null;
  search?: string;
  // pipelineBefore?: mongoose.PipelineStage[];
}

class PagingInfo {
  @ApiProperty()
  total!: number;
  @ApiProperty()
  limit!: number;
  @ApiProperty()
  page!: number;
  @ApiProperty()
  pages!: number;
}

export interface IPaginatedType<TDocument> {
  pagination: PagingInfo;
  results: TDocument[];
}

export function Paginated<TDocument>(
  classRef: Type<TDocument>,
): Type<IPaginatedType<TDocument>> {
  abstract class PaginatedType implements IPaginatedType<TDocument> {
    @ApiProperty({ type: () => [classRef], default: [] })
    results!: TDocument[];

    @ApiProperty({ type: () => PagingInfo })
    pagination!: PagingInfo;
  }
  return PaginatedType as Type<IPaginatedType<TDocument>>;
}
