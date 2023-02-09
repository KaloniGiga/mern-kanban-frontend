//props for button component

import React from "react";

export const BOARD_ROLES = {
  ADMIN: "ADMIN",
  NORMAL: "NORMAL",
};

export const ITEMTYPES = {
  CARD: "CARD",
  LIST: "LIST",
};

export const CARD_DRAG_DIRECTION = {
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  UP: "UP",
  DOWN: "DOWN",
};

export const LIST_DRAG_DIRECTION = {
  LEFT: "LEFT",
  RIGHT: "RIGHT",
};

export const ListType = "LIST";
export const CardType = "CARD";

export const ToastKind = {
  ERROR: "ERROR",
  INFO: "INFO",
  SUCCESS: "SUCCESS",
  WARNING: "WARNING",
  DEFAULT: "DEFAULT",
};

export type ToastObj = {
  msg: string;
  kind: string;
};

export type WorkSpaceContext = {
  workspaceId: string;
  myRole: string;
};

export interface MemberObj {
  _id: string;
  username: string;
  avatar: string;
  role: string;
  isOnlyAdmin: boolean;
}

export type ButtonProps = {
  name: string;
  color?: string;
  hoverColor?: string;
  isSubmitting?: boolean;
  classes?: string;
  onClick?: () => void;
};

export type InputProps = {
  typeName: string;
  placeholder: string;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  width?: string;
  label: string;
  disabled?: boolean;
};

export type UserObj = {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  emailVerified: boolean;
  isGoogleAuth: boolean;
  isMember?: boolean;
};

export interface WorkSpace {
  _id: string;
  name: string;
  description: string;
  picture: string;
  isFavorite: boolean;
  favoriteId: string | null;
  myRole: string;
  visibility: string;
  createBoard: string;
  inviteMember: string;
}

export interface WorkSpaceObj extends WorkSpace {
  boards: BoardObj[];
  visibility: string;
}

export interface FavoriteObj {
  _id: string;
  name: string;
  bgImage?: string;
  color?: string;
  workspace?: {
    _id: string;
    name: string;
    visibility: string;
  };
  type: string;
  visibility: string;
  FavoriteId: string | null;
  isFavorite: boolean;
  icon?: string;
}

export interface BoardObj {
  _id: string;
  name: string;
  ismember: boolean;
  isFavourite: boolean;
  FavouriteId: string | null;
  color: string;
  bgImage?: string;
  visibility: string;
  role: string;
  workSpaceId: string;
}

export interface BoardMemberObj {
  _id: string;
  picture: string;
  username: string;
  role: string;
}

export interface SettingObj {
  _id: string;
  name: string;
  picture: string;
  description: string;
  visibility: string;
  createBoard: string;
  inviteMember: string;
}

export interface RecentBoard {
  _id: string;
  name: string;
  visibility: string;
  isFavorite: boolean;
  favoriteId: string | null;
  color: string;
  bgImage: string | undefined;
  workspaceId: string;
}

export interface Board {
  _id: string;
  name: string;
  description: string;
  visibility: string;
  role: string;
  listId: string[];
  isFavorite: boolean;
  FavoriteId: string | null;
  color: string;
  bgImage: string | undefined;
  workspace: {
    _id: string;
    name: string;
    picture: string;
  };
  members: BoardMemberObj[];
}

export interface SelectOption {
  id: string;
  name: string;
}

export interface ListObj {
  _id: string;
  name: string;
  pos: string;
  cards: CardObj[];
}

export interface CardObj {
  _id: string;
  listId: string;
  name: string;
  pos: string;
  coverImage?: string;
  color?: string;
  description: string;
  isComplete: boolean;
  expireDate: string;
  members: MyCardMemberObj[];
  labels: LabelObj[];
  comments: string;
}

export interface CardDetailObj {
  _id: string;
  listId: string;
  name: string;
  pos: string;
  coverImage?: string;
  color?: string;
  description: string;
  isComplete: boolean;
  expireDate?: string;
  members: MemberObj[];
  labels?: LabelObj[];
  comments?: CommentObj[];
  role: string;
}

export interface MyCardMemberObj {
  _id: string;
  username: string;
  picture: string;
}

export interface MyCardObj {
  _id: string;
  name: string;
  position: string;
  boardId: string;
  workspaceId: string;
  color: string;
  coverImage: string;
  expireDate: Date;
  members: MyCardMemberObj[];
  labels: LabelObj[];
  comments: number;
}

export interface LabelObj {
  _id: string;
  name: string;
  color: string;
}

export interface BoardLabel {
  _id: string;
  name: string;
  color: string;
  pos: number;
}

export interface CommentObj {
  _id: string;
  comment: string;
  user: MemberObj;
  createdAt: string;
  updatedAt: string;
  isUpdated: boolean;
}
