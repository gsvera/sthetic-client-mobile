import axiosInstance from "..";

const BASE_URL = "/schedule-service";

export const apiScheduleService = {
  findMyReservations: function (idClient, date) {
    return axiosInstance.get(
      `${BASE_URL}/find-schedules-by-client/${idClient}?date=${date}`
    );
  },
  save: function (data) {
    return axiosInstance.post(`${BASE_URL}/make-schedule-service`, data);
  },
  changeStatusSchedule: function ({
    idSchedule,
    statusSchedule,
    textComments,
  }) {
    return axiosInstance.patch(
      `${BASE_URL}/change-status-schedule?id-schedule=${idSchedule}&status-schedule=${statusSchedule}&text-comments=${textComments}`
    );
  },
  getPendingRatingByUser: function (idUser) {
    return axiosInstance.get(
      `${BASE_URL}/get-pending-rating-by-user/${idUser}`
    );
  },
  makeRatingByService: function (data) {
    return axiosInstance.post(`${BASE_URL}/update-rating-by-service`, data);
  },
  deleteRatingByService: function (id) {
    return axiosInstance.delete(
      `${BASE_URL}/delete-rating-by-service?id-rating=${id}`
    );
  },
  getRatingsByProvider: function(idProvider) {
    return axiosInstance.get(`${BASE_URL}/get-ratings-by-provider/${idProvider}`);
  }
};
