import axiosInstance from "..";

const BASE_URL = "/auth-user-config";

export const apiUserConfig = {
  getLocationByProvider: function (idUser) {
    return axiosInstance.get(
      `${BASE_URL}/get-location-by-provider?id-user=${idUser}`
    );
  },
  getLocationByUser: function (idUser) {
    return axiosInstance.get(
      `${BASE_URL}/get-default-location-by-client/${idUser}`
    );
  },
  saveProfilePicture: function (data) {
    return axiosInstance.put(`${BASE_URL}/save-profile-picture`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  saveDefaultLocation: function (data) {
    const { idUser, defaultState, defaultMunicipality } = data;
    return axiosInstance.put(
      `${BASE_URL}/save-default-location-client/${idUser}?default-state=${defaultState}${
        !defaultMunicipality
          ? ""
          : "&default-municipality=" + defaultMunicipality
      }`,
      data
    );
  },
  saveTokenNotification: function (data) {
    return axiosInstance.put(`${BASE_URL}/save-notifications-token`, data);
  },
  /**
   *
   * @deprecated no se usa para esta app
   */
  getPlanByUser: function (idUser) {
    return axiosInstance.get(`${BASE_URL}/get-my-current-plan/${idUser}`);
  },
  /**
   *
   * @deprecated no se usa para esta app
   */
  saveLocation: function (data) {
    return axiosInstance.post(`${BASE_URL}/save-location`, data);
  },
};

export default apiUserConfig;
