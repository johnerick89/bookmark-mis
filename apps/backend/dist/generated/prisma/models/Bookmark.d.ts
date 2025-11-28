import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type BookmarkModel = runtime.Types.Result.DefaultSelection<Prisma.$BookmarkPayload>;
export type AggregateBookmark = {
    _count: BookmarkCountAggregateOutputType | null;
    _min: BookmarkMinAggregateOutputType | null;
    _max: BookmarkMaxAggregateOutputType | null;
};
export type BookmarkMinAggregateOutputType = {
    id: string | null;
    url: string | null;
    title: string | null;
    description: string | null;
    user_id: string | null;
    created_at: Date | null;
};
export type BookmarkMaxAggregateOutputType = {
    id: string | null;
    url: string | null;
    title: string | null;
    description: string | null;
    user_id: string | null;
    created_at: Date | null;
};
export type BookmarkCountAggregateOutputType = {
    id: number;
    url: number;
    title: number;
    description: number;
    user_id: number;
    embedding: number;
    created_at: number;
    _all: number;
};
export type BookmarkMinAggregateInputType = {
    id?: true;
    url?: true;
    title?: true;
    description?: true;
    user_id?: true;
    created_at?: true;
};
export type BookmarkMaxAggregateInputType = {
    id?: true;
    url?: true;
    title?: true;
    description?: true;
    user_id?: true;
    created_at?: true;
};
export type BookmarkCountAggregateInputType = {
    id?: true;
    url?: true;
    title?: true;
    description?: true;
    user_id?: true;
    embedding?: true;
    created_at?: true;
    _all?: true;
};
export type BookmarkAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BookmarkWhereInput;
    orderBy?: Prisma.BookmarkOrderByWithRelationInput | Prisma.BookmarkOrderByWithRelationInput[];
    cursor?: Prisma.BookmarkWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BookmarkCountAggregateInputType;
    _min?: BookmarkMinAggregateInputType;
    _max?: BookmarkMaxAggregateInputType;
};
export type GetBookmarkAggregateType<T extends BookmarkAggregateArgs> = {
    [P in keyof T & keyof AggregateBookmark]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBookmark[P]> : Prisma.GetScalarType<T[P], AggregateBookmark[P]>;
};
export type BookmarkGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BookmarkWhereInput;
    orderBy?: Prisma.BookmarkOrderByWithAggregationInput | Prisma.BookmarkOrderByWithAggregationInput[];
    by: Prisma.BookmarkScalarFieldEnum[] | Prisma.BookmarkScalarFieldEnum;
    having?: Prisma.BookmarkScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BookmarkCountAggregateInputType | true;
    _min?: BookmarkMinAggregateInputType;
    _max?: BookmarkMaxAggregateInputType;
};
export type BookmarkGroupByOutputType = {
    id: string;
    url: string;
    title: string;
    description: string | null;
    user_id: string;
    embedding: runtime.JsonValue | null;
    created_at: Date;
    _count: BookmarkCountAggregateOutputType | null;
    _min: BookmarkMinAggregateOutputType | null;
    _max: BookmarkMaxAggregateOutputType | null;
};
type GetBookmarkGroupByPayload<T extends BookmarkGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BookmarkGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BookmarkGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BookmarkGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BookmarkGroupByOutputType[P]>;
}>>;
export type BookmarkWhereInput = {
    AND?: Prisma.BookmarkWhereInput | Prisma.BookmarkWhereInput[];
    OR?: Prisma.BookmarkWhereInput[];
    NOT?: Prisma.BookmarkWhereInput | Prisma.BookmarkWhereInput[];
    id?: Prisma.StringFilter<"Bookmark"> | string;
    url?: Prisma.StringFilter<"Bookmark"> | string;
    title?: Prisma.StringFilter<"Bookmark"> | string;
    description?: Prisma.StringNullableFilter<"Bookmark"> | string | null;
    user_id?: Prisma.StringFilter<"Bookmark"> | string;
    embedding?: Prisma.JsonNullableFilter<"Bookmark">;
    created_at?: Prisma.DateTimeFilter<"Bookmark"> | Date | string;
    tags?: Prisma.TagListRelationFilter;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type BookmarkOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    embedding?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    tags?: Prisma.TagOrderByRelationAggregateInput;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type BookmarkWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    url?: string;
    AND?: Prisma.BookmarkWhereInput | Prisma.BookmarkWhereInput[];
    OR?: Prisma.BookmarkWhereInput[];
    NOT?: Prisma.BookmarkWhereInput | Prisma.BookmarkWhereInput[];
    title?: Prisma.StringFilter<"Bookmark"> | string;
    description?: Prisma.StringNullableFilter<"Bookmark"> | string | null;
    user_id?: Prisma.StringFilter<"Bookmark"> | string;
    embedding?: Prisma.JsonNullableFilter<"Bookmark">;
    created_at?: Prisma.DateTimeFilter<"Bookmark"> | Date | string;
    tags?: Prisma.TagListRelationFilter;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "url">;
export type BookmarkOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    embedding?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.BookmarkCountOrderByAggregateInput;
    _max?: Prisma.BookmarkMaxOrderByAggregateInput;
    _min?: Prisma.BookmarkMinOrderByAggregateInput;
};
export type BookmarkScalarWhereWithAggregatesInput = {
    AND?: Prisma.BookmarkScalarWhereWithAggregatesInput | Prisma.BookmarkScalarWhereWithAggregatesInput[];
    OR?: Prisma.BookmarkScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BookmarkScalarWhereWithAggregatesInput | Prisma.BookmarkScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Bookmark"> | string;
    url?: Prisma.StringWithAggregatesFilter<"Bookmark"> | string;
    title?: Prisma.StringWithAggregatesFilter<"Bookmark"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Bookmark"> | string | null;
    user_id?: Prisma.StringWithAggregatesFilter<"Bookmark"> | string;
    embedding?: Prisma.JsonNullableWithAggregatesFilter<"Bookmark">;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"Bookmark"> | Date | string;
};
export type BookmarkCreateInput = {
    id?: string;
    url: string;
    title: string;
    description?: string | null;
    embedding?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string;
    tags?: Prisma.TagCreateNestedManyWithoutBookmarksInput;
    user: Prisma.UserCreateNestedOneWithoutBookmarksInput;
};
export type BookmarkUncheckedCreateInput = {
    id?: string;
    url: string;
    title: string;
    description?: string | null;
    user_id: string;
    embedding?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string;
    tags?: Prisma.TagUncheckedCreateNestedManyWithoutBookmarksInput;
};
export type BookmarkUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    embedding?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: Prisma.TagUpdateManyWithoutBookmarksNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutBookmarksNestedInput;
};
export type BookmarkUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    embedding?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: Prisma.TagUncheckedUpdateManyWithoutBookmarksNestedInput;
};
export type BookmarkCreateManyInput = {
    id?: string;
    url: string;
    title: string;
    description?: string | null;
    user_id: string;
    embedding?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string;
};
export type BookmarkUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    embedding?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BookmarkUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    embedding?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BookmarkListRelationFilter = {
    every?: Prisma.BookmarkWhereInput;
    some?: Prisma.BookmarkWhereInput;
    none?: Prisma.BookmarkWhereInput;
};
export type BookmarkOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BookmarkCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    embedding?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type BookmarkMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type BookmarkMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type BookmarkCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.BookmarkCreateWithoutUserInput, Prisma.BookmarkUncheckedCreateWithoutUserInput> | Prisma.BookmarkCreateWithoutUserInput[] | Prisma.BookmarkUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.BookmarkCreateOrConnectWithoutUserInput | Prisma.BookmarkCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.BookmarkCreateManyUserInputEnvelope;
    connect?: Prisma.BookmarkWhereUniqueInput | Prisma.BookmarkWhereUniqueInput[];
};
export type BookmarkUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.BookmarkCreateWithoutUserInput, Prisma.BookmarkUncheckedCreateWithoutUserInput> | Prisma.BookmarkCreateWithoutUserInput[] | Prisma.BookmarkUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.BookmarkCreateOrConnectWithoutUserInput | Prisma.BookmarkCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.BookmarkCreateManyUserInputEnvelope;
    connect?: Prisma.BookmarkWhereUniqueInput | Prisma.BookmarkWhereUniqueInput[];
};
export type BookmarkUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.BookmarkCreateWithoutUserInput, Prisma.BookmarkUncheckedCreateWithoutUserInput> | Prisma.BookmarkCreateWithoutUserInput[] | Prisma.BookmarkUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.BookmarkCreateOrConnectWithoutUserInput | Prisma.BookmarkCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.BookmarkUpsertWithWhereUniqueWithoutUserInput | Prisma.BookmarkUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.BookmarkCreateManyUserInputEnvelope;
    set?: Prisma.BookmarkWhereUniqueInput | Prisma.BookmarkWhereUniqueInput[];
    disconnect?: Prisma.BookmarkWhereUniqueInput | Prisma.BookmarkWhereUniqueInput[];
    delete?: Prisma.BookmarkWhereUniqueInput | Prisma.BookmarkWhereUniqueInput[];
    connect?: Prisma.BookmarkWhereUniqueInput | Prisma.BookmarkWhereUniqueInput[];
    update?: Prisma.BookmarkUpdateWithWhereUniqueWithoutUserInput | Prisma.BookmarkUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.BookmarkUpdateManyWithWhereWithoutUserInput | Prisma.BookmarkUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.BookmarkScalarWhereInput | Prisma.BookmarkScalarWhereInput[];
};
export type BookmarkUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.BookmarkCreateWithoutUserInput, Prisma.BookmarkUncheckedCreateWithoutUserInput> | Prisma.BookmarkCreateWithoutUserInput[] | Prisma.BookmarkUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.BookmarkCreateOrConnectWithoutUserInput | Prisma.BookmarkCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.BookmarkUpsertWithWhereUniqueWithoutUserInput | Prisma.BookmarkUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.BookmarkCreateManyUserInputEnvelope;
    set?: Prisma.BookmarkWhereUniqueInput | Prisma.BookmarkWhereUniqueInput[];
    disconnect?: Prisma.BookmarkWhereUniqueInput | Prisma.BookmarkWhereUniqueInput[];
    delete?: Prisma.BookmarkWhereUniqueInput | Prisma.BookmarkWhereUniqueInput[];
    connect?: Prisma.BookmarkWhereUniqueInput | Prisma.BookmarkWhereUniqueInput[];
    update?: Prisma.BookmarkUpdateWithWhereUniqueWithoutUserInput | Prisma.BookmarkUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.BookmarkUpdateManyWithWhereWithoutUserInput | Prisma.BookmarkUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.BookmarkScalarWhereInput | Prisma.BookmarkScalarWhereInput[];
};
export type BookmarkCreateNestedManyWithoutTagsInput = {
    create?: Prisma.XOR<Prisma.BookmarkCreateWithoutTagsInput, Prisma.BookmarkUncheckedCreateWithoutTagsInput> | Prisma.BookmarkCreateWithoutTagsInput[] | Prisma.BookmarkUncheckedCreateWithoutTagsInput[];
    connectOrCreate?: Prisma.BookmarkCreateOrConnectWithoutTagsInput | Prisma.BookmarkCreateOrConnectWithoutTagsInput[];
    connect?: Prisma.BookmarkWhereUniqueInput | Prisma.BookmarkWhereUniqueInput[];
};
export type BookmarkUncheckedCreateNestedManyWithoutTagsInput = {
    create?: Prisma.XOR<Prisma.BookmarkCreateWithoutTagsInput, Prisma.BookmarkUncheckedCreateWithoutTagsInput> | Prisma.BookmarkCreateWithoutTagsInput[] | Prisma.BookmarkUncheckedCreateWithoutTagsInput[];
    connectOrCreate?: Prisma.BookmarkCreateOrConnectWithoutTagsInput | Prisma.BookmarkCreateOrConnectWithoutTagsInput[];
    connect?: Prisma.BookmarkWhereUniqueInput | Prisma.BookmarkWhereUniqueInput[];
};
export type BookmarkUpdateManyWithoutTagsNestedInput = {
    create?: Prisma.XOR<Prisma.BookmarkCreateWithoutTagsInput, Prisma.BookmarkUncheckedCreateWithoutTagsInput> | Prisma.BookmarkCreateWithoutTagsInput[] | Prisma.BookmarkUncheckedCreateWithoutTagsInput[];
    connectOrCreate?: Prisma.BookmarkCreateOrConnectWithoutTagsInput | Prisma.BookmarkCreateOrConnectWithoutTagsInput[];
    upsert?: Prisma.BookmarkUpsertWithWhereUniqueWithoutTagsInput | Prisma.BookmarkUpsertWithWhereUniqueWithoutTagsInput[];
    set?: Prisma.BookmarkWhereUniqueInput | Prisma.BookmarkWhereUniqueInput[];
    disconnect?: Prisma.BookmarkWhereUniqueInput | Prisma.BookmarkWhereUniqueInput[];
    delete?: Prisma.BookmarkWhereUniqueInput | Prisma.BookmarkWhereUniqueInput[];
    connect?: Prisma.BookmarkWhereUniqueInput | Prisma.BookmarkWhereUniqueInput[];
    update?: Prisma.BookmarkUpdateWithWhereUniqueWithoutTagsInput | Prisma.BookmarkUpdateWithWhereUniqueWithoutTagsInput[];
    updateMany?: Prisma.BookmarkUpdateManyWithWhereWithoutTagsInput | Prisma.BookmarkUpdateManyWithWhereWithoutTagsInput[];
    deleteMany?: Prisma.BookmarkScalarWhereInput | Prisma.BookmarkScalarWhereInput[];
};
export type BookmarkUncheckedUpdateManyWithoutTagsNestedInput = {
    create?: Prisma.XOR<Prisma.BookmarkCreateWithoutTagsInput, Prisma.BookmarkUncheckedCreateWithoutTagsInput> | Prisma.BookmarkCreateWithoutTagsInput[] | Prisma.BookmarkUncheckedCreateWithoutTagsInput[];
    connectOrCreate?: Prisma.BookmarkCreateOrConnectWithoutTagsInput | Prisma.BookmarkCreateOrConnectWithoutTagsInput[];
    upsert?: Prisma.BookmarkUpsertWithWhereUniqueWithoutTagsInput | Prisma.BookmarkUpsertWithWhereUniqueWithoutTagsInput[];
    set?: Prisma.BookmarkWhereUniqueInput | Prisma.BookmarkWhereUniqueInput[];
    disconnect?: Prisma.BookmarkWhereUniqueInput | Prisma.BookmarkWhereUniqueInput[];
    delete?: Prisma.BookmarkWhereUniqueInput | Prisma.BookmarkWhereUniqueInput[];
    connect?: Prisma.BookmarkWhereUniqueInput | Prisma.BookmarkWhereUniqueInput[];
    update?: Prisma.BookmarkUpdateWithWhereUniqueWithoutTagsInput | Prisma.BookmarkUpdateWithWhereUniqueWithoutTagsInput[];
    updateMany?: Prisma.BookmarkUpdateManyWithWhereWithoutTagsInput | Prisma.BookmarkUpdateManyWithWhereWithoutTagsInput[];
    deleteMany?: Prisma.BookmarkScalarWhereInput | Prisma.BookmarkScalarWhereInput[];
};
export type BookmarkCreateWithoutUserInput = {
    id?: string;
    url: string;
    title: string;
    description?: string | null;
    embedding?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string;
    tags?: Prisma.TagCreateNestedManyWithoutBookmarksInput;
};
export type BookmarkUncheckedCreateWithoutUserInput = {
    id?: string;
    url: string;
    title: string;
    description?: string | null;
    embedding?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string;
    tags?: Prisma.TagUncheckedCreateNestedManyWithoutBookmarksInput;
};
export type BookmarkCreateOrConnectWithoutUserInput = {
    where: Prisma.BookmarkWhereUniqueInput;
    create: Prisma.XOR<Prisma.BookmarkCreateWithoutUserInput, Prisma.BookmarkUncheckedCreateWithoutUserInput>;
};
export type BookmarkCreateManyUserInputEnvelope = {
    data: Prisma.BookmarkCreateManyUserInput | Prisma.BookmarkCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type BookmarkUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.BookmarkWhereUniqueInput;
    update: Prisma.XOR<Prisma.BookmarkUpdateWithoutUserInput, Prisma.BookmarkUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.BookmarkCreateWithoutUserInput, Prisma.BookmarkUncheckedCreateWithoutUserInput>;
};
export type BookmarkUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.BookmarkWhereUniqueInput;
    data: Prisma.XOR<Prisma.BookmarkUpdateWithoutUserInput, Prisma.BookmarkUncheckedUpdateWithoutUserInput>;
};
export type BookmarkUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.BookmarkScalarWhereInput;
    data: Prisma.XOR<Prisma.BookmarkUpdateManyMutationInput, Prisma.BookmarkUncheckedUpdateManyWithoutUserInput>;
};
export type BookmarkScalarWhereInput = {
    AND?: Prisma.BookmarkScalarWhereInput | Prisma.BookmarkScalarWhereInput[];
    OR?: Prisma.BookmarkScalarWhereInput[];
    NOT?: Prisma.BookmarkScalarWhereInput | Prisma.BookmarkScalarWhereInput[];
    id?: Prisma.StringFilter<"Bookmark"> | string;
    url?: Prisma.StringFilter<"Bookmark"> | string;
    title?: Prisma.StringFilter<"Bookmark"> | string;
    description?: Prisma.StringNullableFilter<"Bookmark"> | string | null;
    user_id?: Prisma.StringFilter<"Bookmark"> | string;
    embedding?: Prisma.JsonNullableFilter<"Bookmark">;
    created_at?: Prisma.DateTimeFilter<"Bookmark"> | Date | string;
};
export type BookmarkCreateWithoutTagsInput = {
    id?: string;
    url: string;
    title: string;
    description?: string | null;
    embedding?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutBookmarksInput;
};
export type BookmarkUncheckedCreateWithoutTagsInput = {
    id?: string;
    url: string;
    title: string;
    description?: string | null;
    user_id: string;
    embedding?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string;
};
export type BookmarkCreateOrConnectWithoutTagsInput = {
    where: Prisma.BookmarkWhereUniqueInput;
    create: Prisma.XOR<Prisma.BookmarkCreateWithoutTagsInput, Prisma.BookmarkUncheckedCreateWithoutTagsInput>;
};
export type BookmarkUpsertWithWhereUniqueWithoutTagsInput = {
    where: Prisma.BookmarkWhereUniqueInput;
    update: Prisma.XOR<Prisma.BookmarkUpdateWithoutTagsInput, Prisma.BookmarkUncheckedUpdateWithoutTagsInput>;
    create: Prisma.XOR<Prisma.BookmarkCreateWithoutTagsInput, Prisma.BookmarkUncheckedCreateWithoutTagsInput>;
};
export type BookmarkUpdateWithWhereUniqueWithoutTagsInput = {
    where: Prisma.BookmarkWhereUniqueInput;
    data: Prisma.XOR<Prisma.BookmarkUpdateWithoutTagsInput, Prisma.BookmarkUncheckedUpdateWithoutTagsInput>;
};
export type BookmarkUpdateManyWithWhereWithoutTagsInput = {
    where: Prisma.BookmarkScalarWhereInput;
    data: Prisma.XOR<Prisma.BookmarkUpdateManyMutationInput, Prisma.BookmarkUncheckedUpdateManyWithoutTagsInput>;
};
export type BookmarkCreateManyUserInput = {
    id?: string;
    url: string;
    title: string;
    description?: string | null;
    embedding?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string;
};
export type BookmarkUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    embedding?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: Prisma.TagUpdateManyWithoutBookmarksNestedInput;
};
export type BookmarkUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    embedding?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: Prisma.TagUncheckedUpdateManyWithoutBookmarksNestedInput;
};
export type BookmarkUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    embedding?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BookmarkUpdateWithoutTagsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    embedding?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutBookmarksNestedInput;
};
export type BookmarkUncheckedUpdateWithoutTagsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    embedding?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BookmarkUncheckedUpdateManyWithoutTagsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    embedding?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BookmarkCountOutputType = {
    tags: number;
};
export type BookmarkCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tags?: boolean | BookmarkCountOutputTypeCountTagsArgs;
};
export type BookmarkCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookmarkCountOutputTypeSelect<ExtArgs> | null;
};
export type BookmarkCountOutputTypeCountTagsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TagWhereInput;
};
export type BookmarkSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    url?: boolean;
    title?: boolean;
    description?: boolean;
    user_id?: boolean;
    embedding?: boolean;
    created_at?: boolean;
    tags?: boolean | Prisma.Bookmark$tagsArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    _count?: boolean | Prisma.BookmarkCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["bookmark"]>;
export type BookmarkSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    url?: boolean;
    title?: boolean;
    description?: boolean;
    user_id?: boolean;
    embedding?: boolean;
    created_at?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["bookmark"]>;
export type BookmarkSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    url?: boolean;
    title?: boolean;
    description?: boolean;
    user_id?: boolean;
    embedding?: boolean;
    created_at?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["bookmark"]>;
export type BookmarkSelectScalar = {
    id?: boolean;
    url?: boolean;
    title?: boolean;
    description?: boolean;
    user_id?: boolean;
    embedding?: boolean;
    created_at?: boolean;
};
export type BookmarkOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "url" | "title" | "description" | "user_id" | "embedding" | "created_at", ExtArgs["result"]["bookmark"]>;
export type BookmarkInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tags?: boolean | Prisma.Bookmark$tagsArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    _count?: boolean | Prisma.BookmarkCountOutputTypeDefaultArgs<ExtArgs>;
};
export type BookmarkIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type BookmarkIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $BookmarkPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Bookmark";
    objects: {
        tags: Prisma.$TagPayload<ExtArgs>[];
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        url: string;
        title: string;
        description: string | null;
        user_id: string;
        embedding: runtime.JsonValue | null;
        created_at: Date;
    }, ExtArgs["result"]["bookmark"]>;
    composites: {};
};
export type BookmarkGetPayload<S extends boolean | null | undefined | BookmarkDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BookmarkPayload, S>;
export type BookmarkCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BookmarkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BookmarkCountAggregateInputType | true;
};
export interface BookmarkDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Bookmark'];
        meta: {
            name: 'Bookmark';
        };
    };
    findUnique<T extends BookmarkFindUniqueArgs>(args: Prisma.SelectSubset<T, BookmarkFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BookmarkClient<runtime.Types.Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BookmarkFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BookmarkFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BookmarkClient<runtime.Types.Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BookmarkFindFirstArgs>(args?: Prisma.SelectSubset<T, BookmarkFindFirstArgs<ExtArgs>>): Prisma.Prisma__BookmarkClient<runtime.Types.Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BookmarkFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BookmarkFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BookmarkClient<runtime.Types.Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BookmarkFindManyArgs>(args?: Prisma.SelectSubset<T, BookmarkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BookmarkCreateArgs>(args: Prisma.SelectSubset<T, BookmarkCreateArgs<ExtArgs>>): Prisma.Prisma__BookmarkClient<runtime.Types.Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BookmarkCreateManyArgs>(args?: Prisma.SelectSubset<T, BookmarkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BookmarkCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BookmarkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BookmarkDeleteArgs>(args: Prisma.SelectSubset<T, BookmarkDeleteArgs<ExtArgs>>): Prisma.Prisma__BookmarkClient<runtime.Types.Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BookmarkUpdateArgs>(args: Prisma.SelectSubset<T, BookmarkUpdateArgs<ExtArgs>>): Prisma.Prisma__BookmarkClient<runtime.Types.Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BookmarkDeleteManyArgs>(args?: Prisma.SelectSubset<T, BookmarkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BookmarkUpdateManyArgs>(args: Prisma.SelectSubset<T, BookmarkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BookmarkUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BookmarkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BookmarkUpsertArgs>(args: Prisma.SelectSubset<T, BookmarkUpsertArgs<ExtArgs>>): Prisma.Prisma__BookmarkClient<runtime.Types.Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BookmarkCountArgs>(args?: Prisma.Subset<T, BookmarkCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BookmarkCountAggregateOutputType> : number>;
    aggregate<T extends BookmarkAggregateArgs>(args: Prisma.Subset<T, BookmarkAggregateArgs>): Prisma.PrismaPromise<GetBookmarkAggregateType<T>>;
    groupBy<T extends BookmarkGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BookmarkGroupByArgs['orderBy'];
    } : {
        orderBy?: BookmarkGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BookmarkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookmarkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BookmarkFieldRefs;
}
export interface Prisma__BookmarkClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tags<T extends Prisma.Bookmark$tagsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Bookmark$tagsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BookmarkFieldRefs {
    readonly id: Prisma.FieldRef<"Bookmark", 'String'>;
    readonly url: Prisma.FieldRef<"Bookmark", 'String'>;
    readonly title: Prisma.FieldRef<"Bookmark", 'String'>;
    readonly description: Prisma.FieldRef<"Bookmark", 'String'>;
    readonly user_id: Prisma.FieldRef<"Bookmark", 'String'>;
    readonly embedding: Prisma.FieldRef<"Bookmark", 'Json'>;
    readonly created_at: Prisma.FieldRef<"Bookmark", 'DateTime'>;
}
export type BookmarkFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookmarkSelect<ExtArgs> | null;
    omit?: Prisma.BookmarkOmit<ExtArgs> | null;
    include?: Prisma.BookmarkInclude<ExtArgs> | null;
    where: Prisma.BookmarkWhereUniqueInput;
};
export type BookmarkFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookmarkSelect<ExtArgs> | null;
    omit?: Prisma.BookmarkOmit<ExtArgs> | null;
    include?: Prisma.BookmarkInclude<ExtArgs> | null;
    where: Prisma.BookmarkWhereUniqueInput;
};
export type BookmarkFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookmarkSelect<ExtArgs> | null;
    omit?: Prisma.BookmarkOmit<ExtArgs> | null;
    include?: Prisma.BookmarkInclude<ExtArgs> | null;
    where?: Prisma.BookmarkWhereInput;
    orderBy?: Prisma.BookmarkOrderByWithRelationInput | Prisma.BookmarkOrderByWithRelationInput[];
    cursor?: Prisma.BookmarkWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BookmarkScalarFieldEnum | Prisma.BookmarkScalarFieldEnum[];
};
export type BookmarkFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookmarkSelect<ExtArgs> | null;
    omit?: Prisma.BookmarkOmit<ExtArgs> | null;
    include?: Prisma.BookmarkInclude<ExtArgs> | null;
    where?: Prisma.BookmarkWhereInput;
    orderBy?: Prisma.BookmarkOrderByWithRelationInput | Prisma.BookmarkOrderByWithRelationInput[];
    cursor?: Prisma.BookmarkWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BookmarkScalarFieldEnum | Prisma.BookmarkScalarFieldEnum[];
};
export type BookmarkFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookmarkSelect<ExtArgs> | null;
    omit?: Prisma.BookmarkOmit<ExtArgs> | null;
    include?: Prisma.BookmarkInclude<ExtArgs> | null;
    where?: Prisma.BookmarkWhereInput;
    orderBy?: Prisma.BookmarkOrderByWithRelationInput | Prisma.BookmarkOrderByWithRelationInput[];
    cursor?: Prisma.BookmarkWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BookmarkScalarFieldEnum | Prisma.BookmarkScalarFieldEnum[];
};
export type BookmarkCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookmarkSelect<ExtArgs> | null;
    omit?: Prisma.BookmarkOmit<ExtArgs> | null;
    include?: Prisma.BookmarkInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BookmarkCreateInput, Prisma.BookmarkUncheckedCreateInput>;
};
export type BookmarkCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BookmarkCreateManyInput | Prisma.BookmarkCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BookmarkCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookmarkSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BookmarkOmit<ExtArgs> | null;
    data: Prisma.BookmarkCreateManyInput | Prisma.BookmarkCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BookmarkIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BookmarkUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookmarkSelect<ExtArgs> | null;
    omit?: Prisma.BookmarkOmit<ExtArgs> | null;
    include?: Prisma.BookmarkInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BookmarkUpdateInput, Prisma.BookmarkUncheckedUpdateInput>;
    where: Prisma.BookmarkWhereUniqueInput;
};
export type BookmarkUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BookmarkUpdateManyMutationInput, Prisma.BookmarkUncheckedUpdateManyInput>;
    where?: Prisma.BookmarkWhereInput;
    limit?: number;
};
export type BookmarkUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookmarkSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BookmarkOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BookmarkUpdateManyMutationInput, Prisma.BookmarkUncheckedUpdateManyInput>;
    where?: Prisma.BookmarkWhereInput;
    limit?: number;
    include?: Prisma.BookmarkIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BookmarkUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookmarkSelect<ExtArgs> | null;
    omit?: Prisma.BookmarkOmit<ExtArgs> | null;
    include?: Prisma.BookmarkInclude<ExtArgs> | null;
    where: Prisma.BookmarkWhereUniqueInput;
    create: Prisma.XOR<Prisma.BookmarkCreateInput, Prisma.BookmarkUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BookmarkUpdateInput, Prisma.BookmarkUncheckedUpdateInput>;
};
export type BookmarkDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookmarkSelect<ExtArgs> | null;
    omit?: Prisma.BookmarkOmit<ExtArgs> | null;
    include?: Prisma.BookmarkInclude<ExtArgs> | null;
    where: Prisma.BookmarkWhereUniqueInput;
};
export type BookmarkDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BookmarkWhereInput;
    limit?: number;
};
export type Bookmark$tagsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
    where?: Prisma.TagWhereInput;
    orderBy?: Prisma.TagOrderByWithRelationInput | Prisma.TagOrderByWithRelationInput[];
    cursor?: Prisma.TagWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TagScalarFieldEnum | Prisma.TagScalarFieldEnum[];
};
export type BookmarkDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookmarkSelect<ExtArgs> | null;
    omit?: Prisma.BookmarkOmit<ExtArgs> | null;
    include?: Prisma.BookmarkInclude<ExtArgs> | null;
};
export {};
