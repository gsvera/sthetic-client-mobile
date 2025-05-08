import axiosInstance from "..";

const BASE_URL = "/schedule-service";

export const apiScheduleService = {
  save: function (data) {
    return axiosInstance.post(`${BASE_URL}/make-schedule-service`, data);
  },
};
