import axiosInstance from "..";

const BASE_URL = "/calendar";
const BASE_URL_PUBLIC = "/public/calendar";

export const apiCalendar = {
  getTimeCalendarByPovider: function (iProvider, day) {
    return axiosInstance.get(
      `${BASE_URL_PUBLIC}/get-time-by-provider/${iProvider}?day=${day}`
    );
  },
  getCalencarExceptionByUser: function (iProvider, date) {
    return axiosInstance.get(
      `${BASE_URL}/get-calendar-exception-by-user/${iProvider}?date-tostring=${date}`
    );
  },
  getServicesByProvider: function (idProvider) {
    return axiosInstance.get(
      `${BASE_URL_PUBLIC}/get-services-by-provider/${idProvider}`
    );
  },
  /**
   *
   * @deprecated no se usa en esta app
   */
  getCalendarByUser: function (idUser) {
    return axiosInstance.get(`${BASE_URL}/get-calendar-by-user/${idUser}`);
  },
  /**
   *
   * @deprecated no se usa en esta app
   */
  saveCalendar: function (data) {
    return axiosInstance.post(`${BASE_URL}/save-calendar`, data);
  },
  /**
   *
   * @deprecated no se usa en esta app
   */
  saveExceptionDay: function (data) {
    return axiosInstance.post(`${BASE_URL}/save-calendar-exception`, data);
  },
  /**
   *
   * @deprecated no se usa en esta app
   */
  updateExceptionDay: function (data) {
    return axiosInstance.put(`${BASE_URL}/update-calendar-exception`, data);
  },
  /**
   *
   * @deprecated no se usa en esta app
   */
  deleteCalendarException: function (id) {
    return axiosInstance.delete(
      `${BASE_URL}/delete-calendar-exception?id-exception=${id}`
    );
  },
};
