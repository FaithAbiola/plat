import { defineStore } from "pinia";
import payrollService from "../../service/payroll/payroll.service";

import {
  Create,
  Update,
  UpdateSettings,
} from "../../service/payroll/interface/payroll.interface";

interface State {}
const payrollStore = defineStore("payroll", {
  state: (): State => ({}),
  actions: {
    async index(organisationId: number, scheduledDate: string | null, status: string | null, pageSize: number,pageNumber: number): Promise<any> {
      try {
        const response = await payrollService.get(organisationId, scheduledDate, status, pageSize, pageNumber);
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    async deleteMany(data:string[]): Promise<any> {
      try {
        const response = await payrollService.deleteMany(data);
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    async retryPayment(id: string, data: any): Promise<any> {
      try {
        const response = await payrollService.retryPayment(id, data);
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    // async initiate(department: any): Promise<any> {
    //   try {
    //     const response = await payrollService.initiate(department);
    //     if (response.data) {
    //       return await Promise.resolve(response);
    //     } else if (response.response) {
    //       return await Promise.reject(response.response);
    //     } else {
    //       return await Promise.reject(response.message);
    //     }
    //   } catch (error: any) {
    //     return await Promise.reject(error);
    //   }
    // },
    async initiate(organisationId: number, pageSize: number, pageNumber: number): Promise<any> {
      try {
        const response = await payrollService.initiate(organisationId, pageSize, pageNumber);
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },

    async fetchEmployeePayroll(organisationId: number, employeeId: number, pageSize: number = 10, pageNumber: number = 1): Promise<any> {
      try {
        const response = await payrollService.getEmployeePayroll(organisationId, employeeId, pageSize, pageNumber);
        if (response.data) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error("Error fetching payroll:", error);
        throw error;
      }
    },    

    async draft(): Promise<any> {
      try {
        const response = await payrollService.draft();
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },

    async fetchDraftPayrollCount(organisationId: number): Promise<any> {
      try {
        const response = await payrollService.getDraftedPayrollCount(organisationId);
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },    

    async getSingle(id: string): Promise<any> {
      try {
        const response = await payrollService.getSingle(id);
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    async preview(department: any): Promise<any> {
      try {
        const response = await payrollService.preview(department);
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    async getSettings(): Promise<any> {
      try {
        const response = await payrollService.settings();
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    async create(data: Create): Promise<any> {
      try {
        const response = await payrollService.create(data);
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    async update(data: Update, id: string): Promise<any> {
      try {
        const response = await payrollService.update(data, id);
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    async updateSettings(data: UpdateSettings): Promise<any> {
      try {
        const response = await payrollService.updateSettings(data);
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    async delete(id: string): Promise<any> {
      try {
        const response = await payrollService.delete(id);
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
  },
});

export default payrollStore;
