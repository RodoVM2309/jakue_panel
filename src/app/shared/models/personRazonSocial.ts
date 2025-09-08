export class PersonRazonSocial {
  constructor(public razon_social: string, public cuit_cuil: string) {}
}

export interface IPersonRazonSocialResponse {
  success: boolean;
  status: number;
  data: PersonRazonSocial[];
}
