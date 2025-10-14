import axiosInstance from "..";

const BASE_URL = "/user";
const AUTH_BASE_URL = "/auth-user";

export const apiUser = {
  saveUser: function (data) {
    return axiosInstance.post(`${BASE_URL}/save/user-sthetic-client`, data);
  },
  findDuplicateUser: function (email, phone) {
    return axiosInstance.get(
      `${BASE_URL}/find-duplicated-user?email=${email}&phone=${phone}`
    );
  },
  getDataUser: function () {
    return axiosInstance.get(`${AUTH_BASE_URL}/get-data-user`);
  },
  updatePersonalInformation: function (data) {
    return axiosInstance.put(
      `${AUTH_BASE_URL}/update-personel-information`,
      data
    );
  },
  updatePassword: function (value) {
    return axiosInstance.put(
      `${AUTH_BASE_URL}/update-password-by-user?new-password=${value}`
    );
  },
  login: function (data) {
    return axiosInstance.post(`${BASE_URL}/login`, data);
  },
  logout: function () {
    return axiosInstance.post(`${AUTH_BASE_URL}/logout`);
  },
  deleteAccount: function (idUser) {
    return axiosInstance.delete(
      `${AUTH_BASE_URL}/delete-client-account/${idUser}`
    );
  },
  searchProvider: function (data) {
    return axiosInstance.get(`${BASE_URL}/get-provider-available`, {
      params: {
        ...data,
        size: 5,
      },
    });
  },
  findProviderByUser: function (idUser) {
    return axiosInstance.get(`${BASE_URL}/get-provider-by-id/${idUser}`);
  },
  sendVerificationCode: function (data) {
    return axiosInstance.post(`${BASE_URL}/send-verification-code`, data);
  },
  saveResetPassword: function (data) {
    return axiosInstance.post(`${BASE_URL}/save-reset-password`, data);
  },
  getAccountVerification: function (idUser) {
    return axiosInstance.get(
      `${AUTH_BASE_URL}/get-verification-account/${idUser}`
    );
  },
  resendRequestVerification: function (idUser) {
    return axiosInstance.post(
      `${AUTH_BASE_URL}/resend-verification-account/${idUser}`
    );
  },
  getCurrentVersion: function (slugName) {
    return axiosInstance.get(
      `${BASE_URL}/get-current-version?slug-name=${slugName}`
    );
  },
  getFavoritesKeysProvider: function (idclient) {
    return axiosInstance.get(
      `${AUTH_BASE_URL}/get-keys-favorites-providers/${idclient}`
    );
  },
  getFavoritesProvider: function (data) {
    return axiosInstance.get(`${AUTH_BASE_URL}/get-my-favorites-providers`, {
      params: {
        ...data,
        size: 5,
      },
    });
  },
  saveFavoriteProvider: function (data) {
    return axiosInstance.post(`${AUTH_BASE_URL}/save-favorite-provider`, data);
  },
  deleteFavoriteProvider: function (data) {
    return axiosInstance.delete(`${AUTH_BASE_URL}/delete-favorite-provider`, {
      data: data,
    });
  },
};
