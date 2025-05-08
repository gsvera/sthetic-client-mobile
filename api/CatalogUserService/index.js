import axiosInstance from "..";

const BASE_URL = "/catalog-type-service";
const BASE_URL_AUTH = "/auth/catalog-type-user-service";

export const apiCatalogUserService = {
  getCatalogServicesByUserId: function (idUser) {
    return axiosInstance.get(`${BASE_URL}/get-services-by-user/${idUser}`);
  },
  getCatalogServiceDetailByIdPorject: function (id) {
    return axiosInstance.get(
      `${BASE_URL}/get-detail-service-by-id?id-project=${id}`
    );
  },
  saveCatalogService: function (data) {
    return axiosInstance.post(
      `${BASE_URL_AUTH}/save-catalog-user-service`,
      data
    );
  },
  updateCatalogService: function (data) {
    return axiosInstance.put(
      `${BASE_URL_AUTH}/update-catalog-user-service`,
      data
    );
  },
  /**
   * @deprecated Este servicio solo se uitiliza para un componente que no es funcional para esta app, eliminar posteriormente
   */
  getCatalogServiceByUser: function (id) {
    return axiosInstance.get(`${BASE_URL_AUTH}/service-get-by-user/${id}`);
  },

  getToEditCatalogService: function (id) {
    return axiosInstance.get(
      `${BASE_URL_AUTH}/get-catalog-service-by-id/${id}`
    );
  },
  /**
   *
   * @depecrated // Este servicio no se utiliza en esta app por seguritdad
   */
  deleteProject: function (id) {
    return axiosInstance.delete(
      `${BASE_URL_AUTH}/delete-catalog-service-by-id/${id}`
    );
  },
};

export default apiCatalogUserService;
