/* same thing */
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

export interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    user_type: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserParams extends ParamsDictionary {
  userId: string;
}

export interface ClassParams extends ParamsDictionary {
  classId: string;
}

export interface FeedbackParams extends ParamsDictionary {
  golferId: string;
}

export interface FeedbackDelParams extends ParamsDictionary {
  feedbackId: string;
}

export interface CommentDelParams extends ParamsDictionary {
  commentId: string;
}


export interface NoteParams extends ParamsDictionary {
  noteId: string;
}

export interface CreateClassRequest {
  title: string;
  start: string;
  end: string;
  location: string;
  instructor: string;
  level: number;
}

// let's combine authenticated request with params
export type AuthRequestWithParams<P> = AuthenticatedRequest & {
  params: P;
};