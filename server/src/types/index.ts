/*  This file is the central location of TS interfaces and types
*/
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

// base authenticated request type
export interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    user_type: string;
  };
}

// auth related types
export interface LoginRequest {
  email: string;
  password: string;
}

// parameter types
export interface UserParams extends ParamsDictionary {
  userId: string;
}

export interface ClassParams extends ParamsDictionary {
  classId: string;
}

export interface NoteParams extends ParamsDictionary {
  noteId: string;
}

// request body types
export interface CreateClassRequest {
  title: string;
  start: string;
  end: string;
  location: string;
  instructor: string;
  level: number;
}

export interface UpdateClassRequest {
  title?: string;
  start?: string;
  end?: string;
  location?: string;
  instructor?: string;
  level?: number;
}

export interface CreateNoteRequest {
  instructor_id: string;
  golfer_id: string;
  class_id: string;
  note_content: string;
}

export interface UpdateNoteRequest {
  note_content: string;
}

// combined types for authenticated requests with params
export type AuthRequestWithParams<P> = AuthenticatedRequest & {
  params: P;
};

// combined types for authenticated requests with body
export type AuthRequestWithBody<T> = AuthenticatedRequest & {
  body: T;
};

// combined types for authenticated requests with params and body
export type AuthRequestWithParamsAndBody<P, T> = AuthenticatedRequest & {
  params: P;
  body: T;
};