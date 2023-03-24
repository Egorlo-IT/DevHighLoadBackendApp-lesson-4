interface LoginUserElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

interface RegisterUserElements extends HTMLFormControlsCollection {
  firstName: HTMLInputElement;
  lastName: HTMLInputElement;
  email: HTMLInputElement;
  password: HTMLInputElement;
  passwordRepeat: HTMLInputElement;
  avatar: HTMLInputElement;
}

interface CreateNewsElements extends HTMLFormControlsCollection {
  title: HTMLInputElement;
  description: HTMLInputElement;
  authorId: HTMLInputElement;
  categoryId: HTMLInputElement;
  cover: HTMLInputElement;
}

interface CreateCommentElements extends HTMLFormControlsCollection {
  message: HTMLInputElement;
}

export interface LoginUserForm extends HTMLFormElement {
  readonly elements: LoginUserElements;
}

export interface RegisterUserForm extends HTMLFormElement {
  readonly elements: RegisterUserElements;
}

export interface CreateCommentForm extends HTMLFormElement {
  readonly elements: CreateCommentElements;
}

export interface CreateNewsForm extends HTMLFormElement {
  readonly elements: CreateNewsElements;
}
