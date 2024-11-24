import { http } from "../../core/utils/http";
import authHeader from "../../core/utils/auth.header.js";
import axios, { Axios } from "axios";
import { Create, Update, UpdateSettings } from "./interface/payroll.interface";
import authhHeader from "../../core/utils/authh.header";

class Payroll {
  constructor(private readonly request: Axios) {}

  private createAxiosInstance() {
    return axios.create({
      baseURL: "https://platoon-backend-1.onrender.com/api", 
      headers: authhHeader(), 
    });
  }

  async get(organisationId: number, scheduledDate: string | null, status: string | null, pageSize: number = 10, pageNumber: number = 1): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .get('/Payroll/get-organisation-payroll', {
        headers: authhHeader(),
        params: {
          OrganisationId: organisationId,
          ScheduledDate: scheduledDate,
          Status: status,
          PageSize: pageSize,
          PageNumber: pageNumber,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

 
  async initiate(organisationId: number, pageSize: number = 10, pageNumber: number = 1): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .get('/Payroll/get-payroll', {
        headers: authhHeader(),
        params: {
          OrganisationId: organisationId, 
          PageSize: pageSize,
          PageNumber: pageNumber
        }
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async getEmployeePayroll(organisationId: number, employeeId: number, pageSize: number = 10, pageNumber: number = 1): Promise<any> {
    const customRequest = this.createAxiosInstance();
  
    return await customRequest
      .get('/Payroll/get-employee-payroll', {
        headers: authhHeader(),
        params: {
          OrganisationId: organisationId,
          EmployeeId: employeeId,
          PageSize: pageSize,
          PageNumber: pageNumber,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  
 // async initiate(department: any): Promise<any> {
  //   return await this.request
  //     .get(`/payroll/init?department=${department}`, {
  //       headers: authHeader(),
  //     })
  //     .then((res) => {
  //       return res;
  //     })
  //     .catch((err) => {
  //       return err;
  //     });
  // }

  async preview(department: any): Promise<any> {
    return await this.request
      .get(`/payroll/init?department=${department}&show=preview`, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async getSingle(id: string): Promise<any> {
    return await this.request
      .get(`/payroll/${id}`, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async draft(): Promise<any> {
    return await this.request
      .get(`/payroll?status=draft`, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async getDraftedPayrollCount(organisationId: number): Promise<any> {
    const customRequest = this.createAxiosInstance();
  
    return await customRequest
      .get(`/Payroll/drafted-payroll-count/${organisationId}`, {
        headers: authhHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  
  async create(data: Create): Promise<any> {
    return await this.request
      .post(
        "/payroll",
        { ...data },
        {
          headers: authHeader(),
        }
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async update(data: Update, id: string): Promise<any> {
    return await this.request
      .put(
        `/payroll/${id}`,
        { ...data },
        {
          headers: authHeader(),
        }
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async delete(id: string): Promise<any> {
    return await this.request
      .delete(`/payroll/${id}`, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async settings(): Promise<any> {
    return await this.request
      .get(`/payroll/settings`, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async deleteMany( data: string[]): Promise<any> {
    return await this.request
      .delete(
        `/payroll/${data}`,
      
        {
          headers: authHeader(),
        }
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async retryPayment(id: string, data: any): Promise<any> {
    return await this.request
      .post(
        `/payroll/${id}/payments`,
        { ...data },
        {
          headers: authHeader(),
        }
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async updateSettings(data: UpdateSettings): Promise<any> {
    return await this.request
      .put(
        `/payroll/settings`,
        { ...data },
        {
          headers: authHeader(),
        }
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
}

export default new Payroll(http);
