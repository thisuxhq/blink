/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Blogs = "blogs",
	Docs = "docs",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export enum BlogsStatusOptions {
	"draft" = "draft",
	"published" = "published",
	"archived" = "archived",
}
export type BlogsRecord = {
	author_id?: RecordIdString[]
	content?: HTMLString
	description?: string
	featured_image?: string
	published_at?: IsoDateString
	slug?: string
	status?: BlogsStatusOptions
	tags?: string
	title?: string
}

export enum DocsTagsOptions {
	"self–hosting" = "self–hosting",
	"docker" = "docker",
	"setup" = "setup",
	"fli.so" = "fli.so",
}

export enum DocsCategoryOptions {
	"Getting Started" = "Getting Started",
	"Features" = "Features",
	"API Documentation" = "API Documentation",
	"Troubleshooting" = "Troubleshooting",
	"FAQs" = "FAQs",
}
export type DocsRecord = {
	author?: RecordIdString
	category?: DocsCategoryOptions
	content?: HTMLString
	description?: string
	published?: boolean
	slug?: string
	tags?: DocsTagsOptions[]
	title?: string
}

export type UsersRecord<Tsocial_links = unknown> = {
	avatar?: string
	bio?: string
	name?: string
	social_links?: null | Tsocial_links
}

// Response types include system fields and match responses from the PocketBase API
export type BlogsResponse<Texpand = unknown> = Required<BlogsRecord> & BaseSystemFields<Texpand>
export type DocsResponse<Texpand = unknown> = Required<DocsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Tsocial_links = unknown, Texpand = unknown> = Required<UsersRecord<Tsocial_links>> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	blogs: BlogsRecord
	docs: DocsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	blogs: BlogsResponse
	docs: DocsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'blogs'): RecordService<BlogsResponse>
	collection(idOrName: 'docs'): RecordService<DocsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
