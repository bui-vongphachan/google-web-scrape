import { en } from "./en";
export interface Locale extends Record<string, string> {
  authentication_need_to_login: string;
  authentication_validate_access_token_success: string;
  authentication_get_access_token_from_cookie_no_token: string;
  authentication_get_access_token_from_cookie_invalid_token: string;
  authentication_get_access_token_from_cookie_expired_token: string;
  authentication_login_failed: string;
  authentication_login_success: string;
  authentication_login_incorrect_password: string;
  authentication_make_access_token_failed: string;
  user_find_one_not_found: string;
  user_find_one_found: string;
  validate_sign_in_empty_email: string;
  validate_sign_in_invalid_email: string;
  validate_sign_in_empty_password: string;
  validate_sign_in_success: string;
}

export * from "./en";

const locale = {
  en,
};

export default locale;
